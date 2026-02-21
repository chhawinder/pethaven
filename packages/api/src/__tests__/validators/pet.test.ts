import { createPetSchema, updatePetSchema } from '../../validators/pet';

describe('Pet Validators', () => {
  describe('createPetSchema', () => {
    it('should validate correct pet data', () => {
      const validData = {
        name: 'Buddy',
        type: 'DOG',
        breed: 'Golden Retriever',
        age: 3,
      };

      const result = createPetSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should validate with minimal required fields', () => {
      const minimalData = {
        name: 'Max',
        type: 'CAT',
      };

      const result = createPetSchema.safeParse(minimalData);
      expect(result.success).toBe(true);
    });

    it('should reject missing name', () => {
      const invalidData = {
        type: 'DOG',
      };

      const result = createPetSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject missing type', () => {
      const invalidData = {
        name: 'Buddy',
      };

      const result = createPetSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject invalid pet type', () => {
      const invalidData = {
        name: 'Buddy',
        type: 'DINOSAUR',
      };

      const result = createPetSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should accept all valid pet types', () => {
      const petTypes = ['DOG', 'CAT', 'BIRD', 'RABBIT', 'FISH', 'OTHER'];

      petTypes.forEach((type) => {
        const data = { name: 'Pet', type };
        const result = createPetSchema.safeParse(data);
        expect(result.success).toBe(true);
      });
    });

    it('should validate gender enum', () => {
      const maleData = { name: 'Max', type: 'DOG', gender: 'MALE' };
      const femaleData = { name: 'Luna', type: 'CAT', gender: 'FEMALE' };
      const invalidGender = { name: 'Pet', type: 'DOG', gender: 'UNKNOWN' };

      expect(createPetSchema.safeParse(maleData).success).toBe(true);
      expect(createPetSchema.safeParse(femaleData).success).toBe(true);
      expect(createPetSchema.safeParse(invalidGender).success).toBe(false);
    });

    it('should reject negative age', () => {
      const invalidData = {
        name: 'Buddy',
        type: 'DOG',
        age: -1,
      };

      const result = createPetSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject negative weight', () => {
      const invalidData = {
        name: 'Buddy',
        type: 'DOG',
        weight: -5,
      };

      const result = createPetSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should validate optional boolean fields', () => {
      const validData = {
        name: 'Buddy',
        type: 'DOG',
        isNeutered: true,
        vaccinated: false,
      };

      const result = createPetSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });
  });

  describe('updatePetSchema', () => {
    it('should allow partial updates', () => {
      const partialData = {
        name: 'New Name',
      };

      const result = updatePetSchema.safeParse(partialData);
      expect(result.success).toBe(true);
    });

    it('should allow empty object', () => {
      const result = updatePetSchema.safeParse({});
      expect(result.success).toBe(true);
    });

    it('should still validate field types', () => {
      const invalidData = {
        age: 'not a number',
      };

      const result = updatePetSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });
});
