export type PetType = 'dog' | 'cat' | 'bird' | 'fish' | 'rabbit' | 'other';
export type Gender = 'male' | 'female';
export type UserRole = 'owner' | 'host' | 'both' | 'admin';
export type BookingStatus = 'pending' | 'accepted' | 'rejected' | 'ongoing' | 'completed' | 'cancelled';

export interface User {
  id: string;
  email: string;
  phone?: string;
  fullName: string;
  profilePhotoUrl?: string;
  role: UserRole;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Pet {
  id: string;
  ownerId: string;
  name: string;
  species: PetType;
  breed?: string;
  ageYears?: number;
  weightKg?: number;
  gender: Gender;
  isNeutered: boolean;
  medicalNotes?: string;
  behavioralNotes?: string;
  photos: string[];
  createdAt: Date;
}

export interface HostProfile {
  id: string;
  userId: string;
  bio?: string;
  experienceYears: number;
  acceptedPetTypes: PetType[];
  maxPets: number;
  hasYard: boolean;
  hasOtherPets: boolean;
  amenities: string[];
  hourlyRate: number;
  dailyRate: number;
  isBackgroundChecked: boolean;
  location: {
    latitude: number;
    longitude: number;
    address: string;
    city: string;
  };
  createdAt: Date;
}

export interface Booking {
  id: string;
  petId: string;
  hostId: string;
  ownerId: string;
  startDatetime: Date;
  endDatetime: Date;
  status: BookingStatus;
  totalAmount: number;
  specialInstructions?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Review {
  id: string;
  bookingId: string;
  reviewerId: string;
  revieweeId: string;
  rating: number;
  comment?: string;
  createdAt: Date;
}
