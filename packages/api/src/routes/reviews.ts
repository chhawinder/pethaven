import { Router, Request, Response } from 'express';
import { prisma } from '@pethaven/database';
import { authenticate, AuthRequest } from '../middleware/auth';
import { createReviewSchema, updateReviewSchema } from '../validators/review';

const router = Router();

// Get reviews for a user (host)
router.get('/user/:userId', async (req: Request, res: Response) => {
  try {
    const reviews = await prisma.review.findMany({
      where: { subjectId: req.params.userId },
      include: {
        author: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatarUrl: true,
          },
        },
        booking: {
          select: {
            id: true,
            startDate: true,
            endDate: true,
            pet: {
              select: {
                name: true,
                type: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Calculate average rating
    const avgRating = reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : null;

    res.json({
      success: true,
      data: {
        reviews,
        stats: {
          count: reviews.length,
          averageRating: avgRating ? Math.round(avgRating * 10) / 10 : null,
        },
      },
    });
  } catch (error) {
    console.error('Get user reviews error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch reviews',
    });
  }
});

// Get review for a specific booking
router.get('/booking/:bookingId', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const booking = await prisma.booking.findUnique({
      where: { id: req.params.bookingId },
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        error: 'Booking not found',
      });
    }

    // Check authorization
    const userId = req.user!.userId;
    if (booking.ownerId !== userId && booking.hostId !== userId) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to view this booking\'s review',
      });
    }

    const review = await prisma.review.findUnique({
      where: { bookingId: req.params.bookingId },
      include: {
        author: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        subject: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    if (!review) {
      return res.status(404).json({
        success: false,
        error: 'Review not found for this booking',
      });
    }

    res.json({
      success: true,
      data: review,
    });
  } catch (error) {
    console.error('Get booking review error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch review',
    });
  }
});

// Create a review (only pet owner can review host after completed booking)
router.post('/', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const validation = createReviewSchema.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: validation.error.errors,
      });
    }

    const { bookingId, rating, comment } = validation.data;
    const userId = req.user!.userId;

    // Get the booking
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        review: true,
      },
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        error: 'Booking not found',
      });
    }

    // Only the pet owner can create a review
    if (booking.ownerId !== userId) {
      return res.status(403).json({
        success: false,
        error: 'Only the pet owner can create a review',
      });
    }

    // Booking must be completed
    if (booking.status !== 'COMPLETED') {
      return res.status(400).json({
        success: false,
        error: 'Can only review completed bookings',
      });
    }

    // Check if review already exists
    if (booking.review) {
      return res.status(400).json({
        success: false,
        error: 'Review already exists for this booking',
      });
    }

    // Create the review
    const review = await prisma.review.create({
      data: {
        bookingId,
        authorId: userId,
        subjectId: booking.hostId,
        rating,
        comment,
      },
      include: {
        author: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
        subject: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    // Update host's rating
    const hostReviews = await prisma.review.findMany({
      where: { subjectId: booking.hostId },
    });

    const avgRating = hostReviews.reduce((sum, r) => sum + r.rating, 0) / hostReviews.length;

    await prisma.hostProfile.update({
      where: { userId: booking.hostId },
      data: {
        rating: Math.round(avgRating * 10) / 10,
        reviewCount: hostReviews.length,
      },
    });

    res.status(201).json({
      success: true,
      data: review,
    });
  } catch (error) {
    console.error('Create review error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create review',
    });
  }
});

// Update a review (only author can update)
router.put('/:id', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const validation = updateReviewSchema.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: validation.error.errors,
      });
    }

    const review = await prisma.review.findUnique({
      where: { id: req.params.id },
    });

    if (!review) {
      return res.status(404).json({
        success: false,
        error: 'Review not found',
      });
    }

    if (review.authorId !== req.user!.userId) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to update this review',
      });
    }

    const updatedReview = await prisma.review.update({
      where: { id: req.params.id },
      data: validation.data,
    });

    // Update host's rating if rating changed
    if (validation.data.rating) {
      const hostReviews = await prisma.review.findMany({
        where: { subjectId: review.subjectId },
      });

      const avgRating = hostReviews.reduce((sum, r) => sum + r.rating, 0) / hostReviews.length;

      await prisma.hostProfile.update({
        where: { userId: review.subjectId },
        data: {
          rating: Math.round(avgRating * 10) / 10,
        },
      });
    }

    res.json({
      success: true,
      data: updatedReview,
    });
  } catch (error) {
    console.error('Update review error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update review',
    });
  }
});

// Delete a review (only author can delete)
router.delete('/:id', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const review = await prisma.review.findUnique({
      where: { id: req.params.id },
    });

    if (!review) {
      return res.status(404).json({
        success: false,
        error: 'Review not found',
      });
    }

    if (review.authorId !== req.user!.userId) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to delete this review',
      });
    }

    const subjectId = review.subjectId;

    await prisma.review.delete({
      where: { id: req.params.id },
    });

    // Update host's rating
    const hostReviews = await prisma.review.findMany({
      where: { subjectId },
    });

    if (hostReviews.length > 0) {
      const avgRating = hostReviews.reduce((sum, r) => sum + r.rating, 0) / hostReviews.length;

      await prisma.hostProfile.update({
        where: { userId: subjectId },
        data: {
          rating: Math.round(avgRating * 10) / 10,
          reviewCount: hostReviews.length,
        },
      });
    } else {
      await prisma.hostProfile.update({
        where: { userId: subjectId },
        data: {
          rating: null,
          reviewCount: 0,
        },
      });
    }

    res.json({
      success: true,
      message: 'Review deleted successfully',
    });
  } catch (error) {
    console.error('Delete review error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete review',
    });
  }
});

export default router;
