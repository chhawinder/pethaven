import { z } from 'zod';

export const createHostProfileSchema = z.object({
  bio: z.string().optional(),
  address: z.string().min(1, 'Address is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  zipCode: z.string().min(1, 'Zip code is required'),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  homeType: z.enum(['APARTMENT', 'HOUSE', 'CONDO', 'FARM']).optional(),
  hasYard: z.boolean().optional(),
  acceptedPetTypes: z.array(z.enum(['DOG', 'CAT', 'BIRD', 'RABBIT', 'FISH', 'OTHER'])).optional(),
  maxPets: z.number().int().min(1).optional(),
  pricePerNight: z.number().positive('Price per night must be positive'),
  pricePerWeek: z.number().positive().optional(),
  photos: z.array(z.string().url()).optional(),
});

export const updateHostProfileSchema = createHostProfileSchema.partial();

export type CreateHostProfileInput = z.infer<typeof createHostProfileSchema>;
export type UpdateHostProfileInput = z.infer<typeof updateHostProfileSchema>;
