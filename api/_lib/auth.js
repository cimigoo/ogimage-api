/**
 * OG Image API - Authentication Module
 * HMAC-based API key verification
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
  if (!key || !key.startsWith('ogk_')) return false;
  
  try {
    const parts = key.split('.');
    if (parts.length !== 2) return false;
    
    const [payload, signature] = parts;
    const expectedSignature = crypto
      .createHmac('sha256', SIGNING_SECRET)
      .update(payload)
      .digest('base64url');
    
    return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature));
  } catch (err) {
    return false;
  }
}

function generateKey(email, plan = 'free') {
  const payload = { email, plan, issuedAt: Date.now() };
  const payloadStr = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto.createHmac('sha256', SIGNING_SECRET).update(payloadStr).digest('base64url');
  return `ogk_${payloadStr}.${signature}`;
}
