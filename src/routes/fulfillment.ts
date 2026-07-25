import { Router, Request, Response } from 'express';
import { prisma } from '../../db';

const router = Router();

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
  };
  shopId?: string; // from requireActiveSubscription
}

// Get all fulfillment orders for this shop
router.get('/orders', async (req: AuthenticatedRequest, res: Response) => {
  const shopId = req.shopId;
  if (!shopId) return res.status(401).json({ error: 'Shop required' });

  try {
    // receipts and fulfillment_orders relation
    // Wait, fulfillment_orders doesn't have a direct shopId. It has receipt_id.
    // The receipt belongs to a shop. We need to fetch orders where receipt.shop_id = shopId
    
    // We can fetch from fulfillment_orders and join with receipts
    const orders = await prisma.fulfillment_orders.findMany({
      where: {
        receipts: {
          shop_id: shopId
        }
      },
      include: {
        receipts: true,
        pod_providers: {
          select: { provider: true }
        }
      },
      orderBy: { created_at: 'desc' },
      take: 50
    });
    
    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// Sync mappings (e.g. telling the backend that a listing variant maps to a Printify variant)
router.post('/mapping', async (req: AuthenticatedRequest, res: Response) => {
  const shopId = req.shopId;
  if (!shopId) return res.status(401).json({ error: 'Shop required' });

  const { listing_id, provider_id, blueprint_id, provider_product_id, variant_mapping } = req.body;

  try {
    const newMapping = await prisma.listing_provider_mapping.create({
      data: {
        listing_id,
        provider_id,
        blueprint_id,
        provider_product_id,
        variant_mapping
      }
    });
    res.json({ success: true, id: newMapping.id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create mapping' });
  }
});

export default router;
