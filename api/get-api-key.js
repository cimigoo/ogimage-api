/**
 * OG Image API - Get API Key Endpoint
 * POST /api/get-api-key
 * 
 * Input: { email }
 * Output: { apiKey, plan: 'free' }
 */

const auth = require('./_lib/auth');

module.exports = async function handler(req, res) {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(200).end();
  }
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  try {
    const { email } = req.body;
    
    if (!email || !email.includes('@')) {
      res.setHeader('Access-Control-Allow-Origin', '*');
      return res.status(400).json({ error: 'Valid email required' });
    }
    
    // Generate API key for free plan
    const apiKey = auth.generateApiKey(email, 'free');
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    return res.status(200).json({
      apiKey,
      plan: 'free',
      email
    });
    
  } catch (err) {
    console.error('Get API key error:', err);
    res.setHeader('Access-Control-Allow-Origin', '*');
    return res.status(500).json({ error: err.message });
  }
};
