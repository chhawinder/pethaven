import { Router, Response } from 'express';
import { prisma } from '@pethaven/database';
import { authenticate, AuthRequest } from '../middleware/auth';
import { createPetSchema, updatePetSchema } from '../validators/pet';

const router = Router();

// Get all pets for current user
router.get('/', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const pets = await prisma.pet.findMany({
      where: { ownerId: req.user!.userId },
      orderBy: { createdAt: 'desc' },
    });

    res.json({
      success: true,
      data: pets,
    });
  } catch (error) {
    console.error('Get pets error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch pets',
    });
  }
});

// Get single pet by ID
router.get('/:id', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const pet = await prisma.pet.findFirst({
      where: {
        id: req.params.id,
        ownerId: req.user!.userId,
      },
    });

    if (!pet) {
      return res.status(404).json({
        success: false,
        error: 'Pet not found',
      });
    }

    res.json({
      success: true,
      data: pet,
    });
  } catch (error) {
    console.error('Get pet error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch pet',
    });
  }
});

// Create new pet
router.post('/', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const validation = createPetSchema.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: validation.error.errors,
      });
    }

    const pet = await prisma.pet.create({
      data: {
        ...validation.data,
        ownerId: req.user!.userId,
      },
    });

    res.status(201).json({
      success: true,
      data: pet,
    });
  } catch (error) {
    console.error('Create pet error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create pet',
    });
  }
});

// Update pet
router.put('/:id', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const validation = updatePetSchema.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: validation.error.errors,
      });
    }

    // Check if pet exists and belongs to user
    const existingPet = await prisma.pet.findFirst({
      where: {
        id: req.params.id,
        ownerId: req.user!.userId,
      },
    });

    if (!existingPet) {
      return res.status(404).json({
        success: false,
        error: 'Pet not found',
      });
    }

    const pet = await prisma.pet.update({
      where: { id: req.params.id },
      data: validation.data,
    });

    res.json({
      success: true,
      data: pet,
    });
  } catch (error) {
    console.error('Update pet error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update pet',
    });
  }
});

// Delete pet
router.delete('/:id', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    // Check if pet exists and belongs to user
    const existingPet = await prisma.pet.findFirst({
      where: {
        id: req.params.id,
        ownerId: req.user!.userId,
      },
    });

    if (!existingPet) {
      return res.status(404).json({
        success: false,
        error: 'Pet not found',
      });
    }

    await prisma.pet.delete({
      where: { id: req.params.id },
    });

    res.json({
      success: true,
      message: 'Pet deleted successfully',
    });
  } catch (error) {
    console.error('Delete pet error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete pet',
    });
  }
});

export default router;
