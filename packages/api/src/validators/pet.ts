import { z } from 'zod';

export const createPetSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  type: z.enum(['DOG', 'CAT', 'BIRD', 'RABBIT', 'FISH', 'OTHER']),
  breed: z.string().optional(),
  age: z.number().int().min(0).optional(),
  weight: z.number().positive().optional(),
  gender: z.enum(['MALE', 'FEMALE']).optional(),
  description: z.string().optional(),
  specialNeeds: z.string().optional(),
  photoUrl: z.string().url().optional(),
  isNeutered: z.boolean().optional(),
  vaccinated: z.boolean().optional(),
});

export const updatePetSchema = createPetSchema.partial();

export type CreatePetInput = z.infer<typeof createPetSchema>;
export type UpdatePetInput = z.infer<typeof updatePetSchema>;
