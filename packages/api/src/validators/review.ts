import { z } from 'zod';

export const createReviewSchema = z.object({
  bookingId: z.string().min(1, 'Booking ID is required'),
  rating: z.number().int().min(1, 'Rating must be at least 1').max(5, 'Rating must be at most 5'),
  comment: z.string().optional(),
});

export const updateReviewSchema = z.object({
  rating: z.number().int().min(1).max(5).optional(),
  comment: z.string().optional(),
}).refine((data) => data.rating !== undefined || data.comment !== undefined, {
  message: 'At least one field must be provided',
});

export type CreateReviewInput = z.infer<typeof createReviewSchema>;
export type UpdateReviewInput = z.infer<typeof updateReviewSchema>;
