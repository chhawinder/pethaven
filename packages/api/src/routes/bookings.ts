import { Router, Response } from 'express';
import { prisma } from '@pethaven/database';
import { authenticate, AuthRequest } from '../middleware/auth';
import { createBookingSchema, updateBookingStatusSchema } from '../validators/booking';

const SERVICE_FEE_PERCENTAGE = 0.1; // 10% service fee

const router = Router();

// Get all bookings for current user (as pet owner or host)
router.get('/', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.userId;
    const { role, status } = req.query;

    const where: Record<string, unknown> = {};

    if (role === 'owner') {
      where.ownerId = userId;
    } else if (role === 'host') {
      where.host = { userId };
    } else {
      where.OR = [
        { ownerId: userId },
        { host: { userId } },
      ];
    }

    if (status) {
      where.status = status;
    }

    const bookings = await prisma.booking.findMany({
      where,
      include: {
        pet: {
          select: {
            id: true,
            name: true,
            type: true,
            breed: true,
            photoUrl: true,
          },
        },
        host: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            hostProfile: {
              select: {
                address: true,
                city: true,
                pricePerNight: true,
              },
            },
          },
        },
        owner: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({
      success: true,
      data: bookings,
    });
  } catch (error) {
    console.error('Get bookings error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch bookings',
    });
  }
});

// Get single booking by ID
router.get('/:id', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const booking = await prisma.booking.findUnique({
      where: { id: req.params.id },
      include: {
        pet: true,
        host: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
            hostProfile: true,
          },
        },
        owner: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
          },
        },
      },
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        error: 'Booking not found',
      });
    }

    // Check if user is owner or host
    const userId = req.user!.userId;
    if (booking.ownerId !== userId && booking.hostId !== userId) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to view this booking',
      });
    }

    res.json({
      success: true,
      data: booking,
    });
  } catch (error) {
    console.error('Get booking error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch booking',
    });
  }
});

// Create a new booking
router.post('/', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const validation = createBookingSchema.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: validation.error.errors,
      });
    }

    const { hostId, petId, startDate, endDate, specialInstructions } = validation.data;

    // hostId here refers to the HostProfile id, we need to get the user
    const userId = req.user!.userId;

    // Verify pet belongs to user
    const pet = await prisma.pet.findFirst({
      where: { id: petId, ownerId: userId },
    });

    if (!pet) {
      return res.status(400).json({
        success: false,
        error: 'Pet not found or does not belong to you',
      });
    }

    // Verify host exists and is available
    const hostProfile = await prisma.hostProfile.findUnique({
      where: { id: hostId },
      include: { user: true },
    });

    if (!hostProfile) {
      return res.status(400).json({
        success: false,
        error: 'Host not found',
      });
    }

    if (!hostProfile.isAvailable) {
      return res.status(400).json({
        success: false,
        error: 'Host is not available',
      });
    }

    // Check if host accepts this pet type
    if (hostProfile.acceptedPetTypes.length > 0 && !hostProfile.acceptedPetTypes.includes(pet.type)) {
      return res.status(400).json({
        success: false,
        error: `Host does not accept ${pet.type} pets`,
      });
    }

    // Calculate total price
    const start = new Date(startDate);
    const end = new Date(endDate);
    const nights = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    const basePrice = nights * hostProfile.pricePerNight;
    const serviceFee = basePrice * SERVICE_FEE_PERCENTAGE;
    const totalPrice = basePrice + serviceFee;

    // Create booking (hostId in schema refers to User id, not HostProfile id)
    const booking = await prisma.booking.create({
      data: {
        ownerId: userId,
        hostId: hostProfile.userId,
        petId,
        startDate: start,
        endDate: end,
        totalPrice,
        serviceFee,
        specialRequests: specialInstructions,
        status: 'PENDING',
      },
      include: {
        pet: true,
        host: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            hostProfile: true,
          },
        },
      },
    });

    res.status(201).json({
      success: true,
      data: booking,
    });
  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create booking',
    });
  }
});

// Update booking status (host can confirm/cancel, owner can cancel)
router.patch('/:id/status', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const validation = updateBookingStatusSchema.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: validation.error.errors,
      });
    }

    const booking = await prisma.booking.findUnique({
      where: { id: req.params.id },
      include: { host: true },
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        error: 'Booking not found',
      });
    }

    const userId = req.user!.userId;
    const isOwner = booking.ownerId === userId;
    const isHost = booking.hostId === userId;

    if (!isOwner && !isHost) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to update this booking',
      });
    }

    const { status } = validation.data;

    // Owners can only cancel
    if (isOwner && !isHost && status !== 'CANCELLED') {
      return res.status(403).json({
        success: false,
        error: 'Pet owners can only cancel bookings',
      });
    }

    // Can't update completed or cancelled bookings
    if (booking.status === 'COMPLETED' || booking.status === 'CANCELLED') {
      return res.status(400).json({
        success: false,
        error: `Cannot update a ${booking.status.toLowerCase()} booking`,
      });
    }

    const updatedBooking = await prisma.booking.update({
      where: { id: req.params.id },
      data: { status },
      include: {
        pet: true,
        host: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    res.json({
      success: true,
      data: updatedBooking,
    });
  } catch (error) {
    console.error('Update booking status error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update booking status',
    });
  }
});

// Cancel booking (convenience endpoint)
router.delete('/:id', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const booking = await prisma.booking.findUnique({
      where: { id: req.params.id },
      include: { host: true },
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        error: 'Booking not found',
      });
    }

    const userId = req.user!.userId;
    const isOwner = booking.ownerId === userId;
    const isHost = booking.hostId === userId;

    if (!isOwner && !isHost) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to cancel this booking',
      });
    }

    if (booking.status === 'COMPLETED') {
      return res.status(400).json({
        success: false,
        error: 'Cannot cancel a completed booking',
      });
    }

    if (booking.status === 'CANCELLED') {
      return res.status(400).json({
        success: false,
        error: 'Booking is already cancelled',
      });
    }

    const updatedBooking = await prisma.booking.update({
      where: { id: req.params.id },
      data: { status: 'CANCELLED' },
    });

    res.json({
      success: true,
      message: 'Booking cancelled successfully',
      data: updatedBooking,
    });
  } catch (error) {
    console.error('Cancel booking error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to cancel booking',
    });
  }
});

export default router;
