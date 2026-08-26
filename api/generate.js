/**
 * OG Image API - Main Generation Endpoint
 * POST /api/generate
 * 
 * Accepts:
 * - Simple mode: { title, description, theme, logo?, author? }
 * - Advanced mode: { html, width?, height? }
 * 
 * Returns: PNG image binary
 */

const auth = require('./_lib/auth');
const render = require('./_lib/render');

module.exports = async function handler(req, res) {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Api-Key');
    return res.status(200).end();
  }
  
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  // Authenticate request
  const authResult = auth.authenticateRequest(req);
  if (!authResult.authenticated) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    return res.status(401).json({ error: authResult.error });
  }
  
  try {
    const body = req.body;
    let pngBuffer;
    
    // Check if advanced mode (custom HTML)
    if (body.html) {
      const width = body.width || render.DEFAULT_WIDTH;
      const height = body.height || render.DEFAULT_HEIGHT;
      pngBuffer = await render.generateFromHtml(body.html, width, height);
    } 
    // Simple mode (JSON parameters)
    else if (body.title || body.description) {
      pngBuffer = await render.generateFromParams({
        title: body.title || 'Untitled',
        description: body.description || '',
        theme: body.theme || 'default',
        width: body.width || render.DEFAULT_WIDTH,
        height: body.height || render.DEFAULT_HEIGHT,
        logo: body.logo || null,
        author: body.author || ''
      });
    } 
    else {
      res.setHeader('Access-Control-Allow-Origin', '*');
      return res.status(400).json({ 
        error: 'Invalid request. Provide either { title, description, theme } or { html }' 
      });
    }
    
    // Return PNG image
    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.status(200).send(pngBuffer);
    
  } catch (err) {
    console.error('Generation error:', err);
    res.setHeader('Access-Control-Allow-Origin', '*');
    return res.status(500).json({ error: `Generation failed: ${err.message}` });
  }
};
