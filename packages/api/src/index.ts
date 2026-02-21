import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/api/v1', (req, res) => {
  res.json({
    name: 'PetHaven API',
    version: '0.1.0',
    endpoints: {
      health: '/health',
      auth: '/api/v1/auth (coming soon)',
      users: '/api/v1/users (coming soon)',
      pets: '/api/v1/pets (coming soon)',
      hosts: '/api/v1/hosts (coming soon)',
      bookings: '/api/v1/bookings (coming soon)',
    },
  });
});

app.listen(PORT, () => {
  console.log(`🐾 PetHaven API running on http://localhost:${PORT}`);
});

export default app;
