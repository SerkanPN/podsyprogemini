import { Router, Request, Response } from 'express';
import { prisma } from '../../db';

const router = Router();

// Extend Request type to include user
interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
  };
}

// Get all configured providers for the current user/shop
router.get('/', async (req: AuthenticatedRequest, res: Response) => {
  const user = req.user;
  if (!user) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const providers = await prisma.pod_providers.findMany({
      where: { user_id: user.id },
      select: { id: true, provider: true, is_active: true, connected_at: true } // don't send API key to client
    });
    res.json(providers);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch providers' });
  }
});

// Add or update a provider
router.post('/', async (req: AuthenticatedRequest, res: Response) => {
  const user = req.user;
  if (!user) return res.status(401).json({ error: 'Unauthorized' });
  
  const { provider, api_key } = req.body;
  if (!provider || !api_key) return res.status(400).json({ error: 'Missing required fields' });

  try {
    const existing = await prisma.pod_providers.findFirst({
      where: { user_id: user.id, provider }
    });

    if (existing) {
      const updated = await prisma.pod_providers.update({
        where: { id: existing.id },
        data: { api_key, is_active: true }
      });
      return res.json({ success: true, id: updated.id });
    } else {
      const newProvider = await prisma.pod_providers.create({
        data: {
          user_id: user.id,
          provider,
          api_key,
          is_active: true
        }
      });
      return res.json({ success: true, id: newProvider.id });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to save provider config' });
  }
});

// Disable a provider
router.post('/:id/disable', async (req: AuthenticatedRequest, res: Response) => {
  const user = req.user;
  if (!user) return res.status(401).json({ error: 'Unauthorized' });
  
  try {
    const p = await prisma.pod_providers.findFirst({ where: { id: req.params.id, user_id: user.id } });
    if (!p) return res.status(404).json({ error: 'Not found' });
    
    await prisma.pod_providers.update({
      where: { id: p.id },
      data: { is_active: false }
    });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update' });
  }
});

export default router;
