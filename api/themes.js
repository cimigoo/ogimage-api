/**
 * OG Image API - List Themes Endpoint
 * GET /api/themes
 * 
 * Output: { themes: ['default', 'minimal', 'dark', 'tech'] }
 */

const render = require('./_lib/render');

module.exports = async function handler(req, res) {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(200).end();
  }
  
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  try {
    const themes = render.getThemes();
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    return res.status(200).json({ themes });
    
  } catch (err) {
    console.error('List themes error:', err);
    res.setHeader('Access-Control-Allow-Origin', '*');
    return res.status(500).json({ error: err.message });
  }
};
