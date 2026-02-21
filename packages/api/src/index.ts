import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import petRoutes from './routes/pets';
import hostRoutes from './routes/hosts';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/pets', petRoutes);
app.use('/api/v1/hosts', hostRoutes);

const apiInfo = {
  name: 'PetHaven API',
  version: '0.1.0',
  endpoints: {
    health: '/health',
    auth: '/api/v1/auth',
    pets: '/api/v1/pets',
    hosts: '/api/v1/hosts',
    users: '/api/v1/users (coming soon)',
    bookings: '/api/v1/bookings (coming soon)',
  },
};

app.get('/api', (req, res) => res.json(apiInfo));
app.get('/api/v1', (req, res) => res.json(apiInfo));

app.listen(PORT, () => {
  console.log(`🐾 PetHaven API running on http://localhost:${PORT}`);
});

export default app;
