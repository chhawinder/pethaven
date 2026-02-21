import { PrismaClient, UserRole, PetType, Gender, HomeType } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create sample users
  const owner1 = await prisma.user.upsert({
    where: { email: 'john@example.com' },
    update: {},
    create: {
      email: 'john@example.com',
      passwordHash: '$2b$10$placeholder', // Replace with actual hash
      firstName: 'John',
      lastName: 'Doe',
      phone: '+1234567890',
      role: UserRole.PET_OWNER,
      isVerified: true,
    },
  });

  const host1 = await prisma.user.upsert({
    where: { email: 'sarah@example.com' },
    update: {},
    create: {
      email: 'sarah@example.com',
      passwordHash: '$2b$10$placeholder',
      firstName: 'Sarah',
      lastName: 'Smith',
      phone: '+1987654321',
      role: UserRole.HOST,
      isVerified: true,
    },
  });

  // Create pet for owner
  const pet1 = await prisma.pet.upsert({
    where: { id: 'pet-1' },
    update: {},
    create: {
      id: 'pet-1',
      ownerId: owner1.id,
      name: 'Buddy',
      type: PetType.DOG,
      breed: 'Golden Retriever',
      age: 3,
      weight: 30,
      gender: Gender.MALE,
      description: 'Friendly and playful dog',
      isNeutered: true,
      vaccinated: true,
    },
  });

  // Create host profile
  const hostProfile1 = await prisma.hostProfile.upsert({
    where: { userId: host1.id },
    update: {},
    create: {
      userId: host1.id,
      bio: 'Animal lover with 10 years of pet care experience',
      address: '123 Pet Street',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94102',
      latitude: 37.7749,
      longitude: -122.4194,
      homeType: HomeType.HOUSE,
      hasYard: true,
      acceptedPetTypes: [PetType.DOG, PetType.CAT],
      maxPets: 3,
      pricePerNight: 45.0,
      pricePerWeek: 280.0,
      isAvailable: true,
      rating: 4.8,
      reviewCount: 12,
    },
  });

  console.log('✅ Seeding completed!');
  console.log({ owner1, host1, pet1, hostProfile1 });
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
