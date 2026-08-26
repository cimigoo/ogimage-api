/**
 * OG Image API - Check Usage Endpoint
 * GET/POST /api/check-usage
 * 
 * Input: Authorization header or x-api-key
 * Output: { email, plan, usage: { current, limit }, quota }
 */

const auth = require('./_lib/auth');

// Plan limits (images per month)
const PLAN_LIMITS = {
  free: 100,
  developer: 2000,
  pro: 10000
};

module.exports = async function handler(req, res) {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Api-Key');
    return res.status(200).end();
  }
  
  // Authenticate request
  const authResult = auth.authenticateRequest(req);
  if (!authResult.authenticated) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    return res.status(401).json({ error: authResult.error });
  }
  
  try {
    const plan = authResult.plan || 'free';
    const limit = PLAN_LIMITS[plan] || PLAN_LIMITS.free;
    
    // TODO: Track actual usage (for now, return mock data)
    // In production, this would query Vercel Analytics or a usage tracking service
    const currentUsage = 0;
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    return res.status(200).json({
      email: authResult.email,
      plan,
      usage: {
        current: currentUsage,
        limit: limit
      },
      quota: {
        remaining: limit - currentUsage,
        percentage: ((currentUsage / limit) * 100).toFixed(2)
      }
    });
    
  } catch (err) {
    console.error('Check usage error:', err);
    res.setHeader('Access-Control-Allow-Origin', '*');
    return res.status(500).json({ error: err.message });
  }
};
