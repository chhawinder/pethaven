export const APP_NAME = 'PetHaven';

export const PET_TYPES = ['dog', 'cat', 'bird', 'fish', 'rabbit', 'other'] as const;

export const BOOKING_STATUSES = [
  'pending',
  'accepted', 
  'rejected',
  'ongoing',
  'completed',
  'cancelled',
] as const;

export const API_ENDPOINTS = {
  AUTH: '/api/v1/auth',
  USERS: '/api/v1/users',
  PETS: '/api/v1/pets',
  HOSTS: '/api/v1/hosts',
  BOOKINGS: '/api/v1/bookings',
  REVIEWS: '/api/v1/reviews',
  MESSAGES: '/api/v1/messages',
} as const;

export const PLATFORM_FEE_PERCENTAGE = 15;

export const MAX_PHOTOS_PER_PET = 5;
export const MAX_PHOTOS_PER_HOST = 10;

export const CANCELLATION_POLICIES = {
  FLEXIBLE: { refundPercent: 100, hoursBeforeStart: 24 },
  MODERATE: { refundPercent: 50, hoursBeforeStart: 24 },
  STRICT: { refundPercent: 0, hoursBeforeStart: 48 },
} as const;
