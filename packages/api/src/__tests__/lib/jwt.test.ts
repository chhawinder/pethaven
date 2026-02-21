import { signToken, verifyToken, JwtPayload } from '../../lib/jwt';

describe('JWT Utils', () => {
  const testPayload: JwtPayload = {
    userId: 'user-123',
    email: 'test@example.com',
    role: 'PET_OWNER',
  };

  describe('signToken', () => {
    it('should generate a valid JWT token', () => {
      const token = signToken(testPayload);
      
      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token.split('.')).toHaveLength(3);
    });
  });

  describe('verifyToken', () => {
    it('should verify and decode a valid token', () => {
      const token = signToken(testPayload);
      const decoded = verifyToken(token);
      
      expect(decoded.userId).toBe(testPayload.userId);
      expect(decoded.email).toBe(testPayload.email);
      expect(decoded.role).toBe(testPayload.role);
    });

    it('should throw error for invalid token', () => {
      expect(() => verifyToken('invalid-token')).toThrow();
    });

    it('should throw error for tampered token', () => {
      const token = signToken(testPayload);
      const tamperedToken = token.slice(0, -5) + 'xxxxx';
      
      expect(() => verifyToken(tamperedToken)).toThrow();
    });
  });
});
