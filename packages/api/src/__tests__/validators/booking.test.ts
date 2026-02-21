import { createBookingSchema, updateBookingStatusSchema } from '../../validators/booking';

describe('Booking Validators', () => {
  describe('createBookingSchema', () => {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 7);
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 10);

    it('should validate correct booking data', () => {
      const validData = {
        hostId: 'host123',
        petId: 'pet123',
        startDate: futureDate.toISOString(),
        endDate: endDate.toISOString(),
      };

      const result = createBookingSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should validate with special instructions', () => {
      const validData = {
        hostId: 'host123',
        petId: 'pet123',
        startDate: futureDate.toISOString(),
        endDate: endDate.toISOString(),
        specialInstructions: 'Please give medication at 8am',
      };

      const result = createBookingSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should reject missing hostId', () => {
      const invalidData = {
        petId: 'pet123',
        startDate: futureDate.toISOString(),
        endDate: endDate.toISOString(),
      };

      const result = createBookingSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject missing petId', () => {
      const invalidData = {
        hostId: 'host123',
        startDate: futureDate.toISOString(),
        endDate: endDate.toISOString(),
      };

      const result = createBookingSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject invalid date format', () => {
      const invalidData = {
        hostId: 'host123',
        petId: 'pet123',
        startDate: 'not-a-date',
        endDate: endDate.toISOString(),
      };

      const result = createBookingSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject end date before start date', () => {
      const invalidData = {
        hostId: 'host123',
        petId: 'pet123',
        startDate: endDate.toISOString(),
        endDate: futureDate.toISOString(),
      };

      const result = createBookingSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject start date in the past', () => {
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 1);

      const invalidData = {
        hostId: 'host123',
        petId: 'pet123',
        startDate: pastDate.toISOString(),
        endDate: futureDate.toISOString(),
      };

      const result = createBookingSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });

  describe('updateBookingStatusSchema', () => {
    it('should validate CONFIRMED status', () => {
      const result = updateBookingStatusSchema.safeParse({ status: 'CONFIRMED' });
      expect(result.success).toBe(true);
    });

    it('should validate CANCELLED status', () => {
      const result = updateBookingStatusSchema.safeParse({ status: 'CANCELLED' });
      expect(result.success).toBe(true);
    });

    it('should validate COMPLETED status', () => {
      const result = updateBookingStatusSchema.safeParse({ status: 'COMPLETED' });
      expect(result.success).toBe(true);
    });

    it('should reject invalid status', () => {
      const result = updateBookingStatusSchema.safeParse({ status: 'INVALID' });
      expect(result.success).toBe(false);
    });

    it('should reject PENDING status (not allowed for updates)', () => {
      const result = updateBookingStatusSchema.safeParse({ status: 'PENDING' });
      expect(result.success).toBe(false);
    });

    it('should reject empty object', () => {
      const result = updateBookingStatusSchema.safeParse({});
      expect(result.success).toBe(false);
    });
  });
});
