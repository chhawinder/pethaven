import { createHostProfileSchema, updateHostProfileSchema } from '../../validators/host';

describe('Host Profile Validators', () => {
  describe('createHostProfileSchema', () => {
    it('should validate correct host profile data', () => {
      const validData = {
        address: '123 Main St',
        city: 'San Francisco',
        state: 'CA',
        zipCode: '94102',
        pricePerNight: 50,
      };

      const result = createHostProfileSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should validate with all optional fields', () => {
      const fullData = {
        bio: 'I love pets!',
        address: '123 Main St',
        city: 'San Francisco',
        state: 'CA',
        zipCode: '94102',
        latitude: 37.7749,
        longitude: -122.4194,
        homeType: 'HOUSE',
        hasYard: true,
        acceptedPetTypes: ['DOG', 'CAT'],
        maxPets: 3,
        pricePerNight: 50,
        pricePerWeek: 300,
        photos: ['https://example.com/photo1.jpg'],
      };

      const result = createHostProfileSchema.safeParse(fullData);
      expect(result.success).toBe(true);
    });

    it('should reject missing required fields', () => {
      const invalidData = {
        bio: 'I love pets!',
        pricePerNight: 50,
      };

      const result = createHostProfileSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject missing address', () => {
      const invalidData = {
        city: 'San Francisco',
        state: 'CA',
        zipCode: '94102',
        pricePerNight: 50,
      };

      const result = createHostProfileSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject negative price', () => {
      const invalidData = {
        address: '123 Main St',
        city: 'San Francisco',
        state: 'CA',
        zipCode: '94102',
        pricePerNight: -50,
      };

      const result = createHostProfileSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject invalid home type', () => {
      const invalidData = {
        address: '123 Main St',
        city: 'San Francisco',
        state: 'CA',
        zipCode: '94102',
        pricePerNight: 50,
        homeType: 'MANSION',
      };

      const result = createHostProfileSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should accept all valid home types', () => {
      const homeTypes = ['APARTMENT', 'HOUSE', 'CONDO', 'FARM'];

      homeTypes.forEach((homeType) => {
        const data = {
          address: '123 Main St',
          city: 'San Francisco',
          state: 'CA',
          zipCode: '94102',
          pricePerNight: 50,
          homeType,
        };
        const result = createHostProfileSchema.safeParse(data);
        expect(result.success).toBe(true);
      });
    });

    it('should validate accepted pet types array', () => {
      const validData = {
        address: '123 Main St',
        city: 'San Francisco',
        state: 'CA',
        zipCode: '94102',
        pricePerNight: 50,
        acceptedPetTypes: ['DOG', 'CAT', 'BIRD'],
      };

      const result = createHostProfileSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should reject invalid pet type in array', () => {
      const invalidData = {
        address: '123 Main St',
        city: 'San Francisco',
        state: 'CA',
        zipCode: '94102',
        pricePerNight: 50,
        acceptedPetTypes: ['DOG', 'DINOSAUR'],
      };

      const result = createHostProfileSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });

  describe('updateHostProfileSchema', () => {
    it('should allow partial updates', () => {
      const partialData = {
        pricePerNight: 75,
      };

      const result = updateHostProfileSchema.safeParse(partialData);
      expect(result.success).toBe(true);
    });

    it('should allow empty object', () => {
      const result = updateHostProfileSchema.safeParse({});
      expect(result.success).toBe(true);
    });

    it('should still validate field types', () => {
      const invalidData = {
        pricePerNight: 'not a number',
      };

      const result = updateHostProfileSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should allow updating only bio', () => {
      const partialData = {
        bio: 'Updated bio text',
      };

      const result = updateHostProfileSchema.safeParse(partialData);
      expect(result.success).toBe(true);
    });
  });
});
