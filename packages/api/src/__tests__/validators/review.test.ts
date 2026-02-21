import { createReviewSchema, updateReviewSchema } from '../../validators/review';

describe('Review Validators', () => {
  describe('createReviewSchema', () => {
    it('should validate correct review data', () => {
      const validData = {
        bookingId: 'booking123',
        rating: 5,
        comment: 'Great host!',
      };

      const result = createReviewSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should validate without comment', () => {
      const validData = {
        bookingId: 'booking123',
        rating: 4,
      };

      const result = createReviewSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should reject missing bookingId', () => {
      const invalidData = {
        rating: 5,
      };

      const result = createReviewSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject missing rating', () => {
      const invalidData = {
        bookingId: 'booking123',
      };

      const result = createReviewSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject rating below 1', () => {
      const invalidData = {
        bookingId: 'booking123',
        rating: 0,
      };

      const result = createReviewSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject rating above 5', () => {
      const invalidData = {
        bookingId: 'booking123',
        rating: 6,
      };

      const result = createReviewSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject non-integer rating', () => {
      const invalidData = {
        bookingId: 'booking123',
        rating: 4.5,
      };

      const result = createReviewSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should accept all valid ratings (1-5)', () => {
      for (let rating = 1; rating <= 5; rating++) {
        const data = { bookingId: 'booking123', rating };
        const result = createReviewSchema.safeParse(data);
        expect(result.success).toBe(true);
      }
    });
  });

  describe('updateReviewSchema', () => {
    it('should validate rating update', () => {
      const validData = { rating: 4 };
      const result = updateReviewSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should validate comment update', () => {
      const validData = { comment: 'Updated comment' };
      const result = updateReviewSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should validate both rating and comment update', () => {
      const validData = { rating: 5, comment: 'Updated comment' };
      const result = updateReviewSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should reject empty object', () => {
      const result = updateReviewSchema.safeParse({});
      expect(result.success).toBe(false);
    });

    it('should reject invalid rating in update', () => {
      const invalidData = { rating: 10 };
      const result = updateReviewSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });
});
