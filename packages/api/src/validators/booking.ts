import { z } from 'zod';

export const createBookingSchema = z.object({
  hostId: z.string().min(1, 'Host ID is required'),
  petId: z.string().min(1, 'Pet ID is required'),
  startDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: 'Invalid start date',
  }),
  endDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: 'Invalid end date',
  }),
  specialInstructions: z.string().optional(),
}).refine((data) => new Date(data.startDate) < new Date(data.endDate), {
  message: 'End date must be after start date',
  path: ['endDate'],
}).refine((data) => new Date(data.startDate) >= new Date(), {
  message: 'Start date must be in the future',
  path: ['startDate'],
});

export const updateBookingStatusSchema = z.object({
  status: z.enum(['CONFIRMED', 'CANCELLED', 'COMPLETED']),
});

export type CreateBookingInput = z.infer<typeof createBookingSchema>;
export type UpdateBookingStatusInput = z.infer<typeof updateBookingStatusSchema>;
