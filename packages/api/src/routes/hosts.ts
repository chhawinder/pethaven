import { Router, Request, Response } from 'express';
import { prisma } from '@pethaven/database';
import { authenticate, AuthRequest } from '../middleware/auth';
import { createHostProfileSchema, updateHostProfileSchema } from '../validators/host';

const router = Router();

// Get all available hosts (public)
router.get('/', async (req: Request, res: Response) => {
  try {
    const { city, petType, minPrice, maxPrice } = req.query;

    const where: Record<string, unknown> = {
      isAvailable: true,
    };

    if (city) {
      where.city = { contains: city as string, mode: 'insensitive' };
    }

    if (petType) {
      where.acceptedPetTypes = { has: petType as string };
    }

    if (minPrice || maxPrice) {
      where.pricePerNight = {};
      if (minPrice) (where.pricePerNight as Record<string, number>).gte = Number(minPrice);
      if (maxPrice) (where.pricePerNight as Record<string, number>).lte = Number(maxPrice);
    }

    const hosts = await prisma.hostProfile.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatarUrl: true,
          },
        },
      },
      orderBy: { rating: 'desc' },
    });

    res.json({
      success: true,
      data: hosts,
    });
  } catch (error) {
    console.error('Get hosts error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch hosts',
    });
  }
});

// Get single host profile by ID (public)
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const host = await prisma.hostProfile.findUnique({
      where: { id: req.params.id },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatarUrl: true,
          },
        },
        availability: {
          where: {
            date: { gte: new Date() },
            isAvailable: true,
          },
          orderBy: { date: 'asc' },
          take: 30,
        },
      },
    });

    if (!host) {
      return res.status(404).json({
        success: false,
        error: 'Host not found',
      });
    }

    res.json({
      success: true,
      data: host,
    });
  } catch (error) {
    console.error('Get host error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch host',
    });
  }
});

// Get current user's host profile
router.get('/me/profile', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const hostProfile = await prisma.hostProfile.findUnique({
      where: { userId: req.user!.userId },
    });

    if (!hostProfile) {
      return res.status(404).json({
        success: false,
        error: 'You do not have a host profile',
      });
    }

    res.json({
      success: true,
      data: hostProfile,
    });
  } catch (error) {
    console.error('Get my host profile error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch host profile',
    });
  }
});

// Create host profile (become a host)
router.post('/', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const validation = createHostProfileSchema.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: validation.error.errors,
      });
    }

    // Check if user already has a host profile
    const existingProfile = await prisma.hostProfile.findUnique({
      where: { userId: req.user!.userId },
    });

    if (existingProfile) {
      return res.status(400).json({
        success: false,
        error: 'You already have a host profile',
      });
    }

    // Create host profile and update user role
    const [hostProfile] = await prisma.$transaction([
      prisma.hostProfile.create({
        data: {
          ...validation.data,
          userId: req.user!.userId,
        },
      }),
      prisma.user.update({
        where: { id: req.user!.userId },
        data: { role: 'HOST' },
      }),
    ]);

    res.status(201).json({
      success: true,
      data: hostProfile,
    });
  } catch (error) {
    console.error('Create host profile error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create host profile',
    });
  }
});

// Update host profile
router.put('/', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const validation = updateHostProfileSchema.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: validation.error.errors,
      });
    }

    const existingProfile = await prisma.hostProfile.findUnique({
      where: { userId: req.user!.userId },
    });

    if (!existingProfile) {
      return res.status(404).json({
        success: false,
        error: 'Host profile not found',
      });
    }

    const hostProfile = await prisma.hostProfile.update({
      where: { userId: req.user!.userId },
      data: validation.data,
    });

    res.json({
      success: true,
      data: hostProfile,
    });
  } catch (error) {
    console.error('Update host profile error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update host profile',
    });
  }
});

// Toggle availability
router.patch('/availability', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const existingProfile = await prisma.hostProfile.findUnique({
      where: { userId: req.user!.userId },
    });

    if (!existingProfile) {
      return res.status(404).json({
        success: false,
        error: 'Host profile not found',
      });
    }

    const hostProfile = await prisma.hostProfile.update({
      where: { userId: req.user!.userId },
      data: { isAvailable: !existingProfile.isAvailable },
    });

    res.json({
      success: true,
      data: hostProfile,
    });
  } catch (error) {
    console.error('Toggle availability error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to toggle availability',
    });
  }
});

// Delete host profile
router.delete('/', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const existingProfile = await prisma.hostProfile.findUnique({
      where: { userId: req.user!.userId },
    });

    if (!existingProfile) {
      return res.status(404).json({
        success: false,
        error: 'Host profile not found',
      });
    }

    await prisma.$transaction([
      prisma.hostProfile.delete({
        where: { userId: req.user!.userId },
      }),
      prisma.user.update({
        where: { id: req.user!.userId },
        data: { role: 'PET_OWNER' },
      }),
    ]);

    res.json({
      success: true,
      message: 'Host profile deleted successfully',
    });
  } catch (error) {
    console.error('Delete host profile error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete host profile',
    });
  }
});

export default router;
