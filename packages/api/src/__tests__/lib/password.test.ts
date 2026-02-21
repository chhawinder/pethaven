import { hashPassword, comparePassword } from '../../lib/password';

describe('Password Utils', () => {
  const testPassword = 'SecurePassword123!';

  describe('hashPassword', () => {
    it('should hash a password', async () => {
      const hash = await hashPassword(testPassword);
      
      expect(hash).toBeDefined();
      expect(hash).not.toBe(testPassword);
      expect(hash.length).toBeGreaterThan(0);
    });

    it('should generate different hashes for same password', async () => {
      const hash1 = await hashPassword(testPassword);
      const hash2 = await hashPassword(testPassword);
      
      expect(hash1).not.toBe(hash2);
    });
  });

  describe('comparePassword', () => {
    it('should return true for matching password', async () => {
      const hash = await hashPassword(testPassword);
      const isMatch = await comparePassword(testPassword, hash);
      
      expect(isMatch).toBe(true);
    });

    it('should return false for non-matching password', async () => {
      const hash = await hashPassword(testPassword);
      const isMatch = await comparePassword('WrongPassword', hash);
      
      expect(isMatch).toBe(false);
    });
  });
});
