/**
 * OG Image API - Authentication Module
 */

const crypto = require('crypto');

const SIGNING_SECRET = process.env.OGIMAGE_SIGNING_SECRET || 'ogk-default-secret-2026-08-26-cimigo';

module.exports = { authenticateRequest, verifyKey, generateKey, SIGNING_SECRET };

function authenticateRequest(req) {
  const authHeader = req.headers.authorization || req.headers['x-api-key'];
  if (!authHeader) {
    return { authenticated: false, error: 'Missing authorization header' };
  }
  
  const key = authHeader.replace('Bearer ', '').replace('Token ', '');
  if (!verifyKey(key)) {
    return { authenticated: false, error: 'Invalid API key' };
  }
  
  return { authenticated: true, key };
}

function verifyKey(key) {
  if (!key || typeof key !== 'string' || !key.startsWith('ogk_')) return false;
  
  try {
    const withoutPrefix = key.slice(4); // remove 'ogk_'
    const dotIndex = withoutPrefix.lastIndexOf('.');
    if (dotIndex === -1) return false;
    
    const payload = withoutPrefix.slice(0, dotIndex);
    const signature = withoutPrefix.slice(dotIndex + 1);
    
    const expectedSignature = crypto
      .createHmac('sha256', SIGNING_SECRET)
      .update(payload)
      .digest('base64url');
    
    // Simple comparison (safe enough for API key validation)
    return signature === expectedSignature;
  } catch (err) {
    console.error('verifyKey error:', err.message);
    return false;
  }
}

function generateKey(email, plan = 'free') {
  const payload = Buffer.from(JSON.stringify({ email, plan, issuedAt: Date.now() })).toString('base64url');
  const signature = crypto.createHmac('sha256', SIGNING_SECRET).update(payload).digest('base64url');
  return `ogk_${payload}.${signature}`;
}
