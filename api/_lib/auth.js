/**
 * OG Image API - HMAC Authentication Module
 * Zero-database API key validation using HMAC-SHA256 signatures
 */

const crypto = require('crypto');

// Get signing secret from environment
function getSigningSecret() {
  const secret = process.env.OGIMAGE_SIGNING_SECRET;
  if (!secret) {
    throw new Error('OGIMAGE_SIGNING_SECRET not configured');
  }
  return secret;
}

// Generate HMAC signature
function sign(data, secret) {
  return crypto.createHmac('sha256', secret).update(data).digest('base64url');
}

// Verify HMAC signature
function verify(data, signature, secret) {
  const expected = sign(data, secret);
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expected)
  );
}

// Generate API key for user
// Format: ogk_<base64url(payload)>.<base64url(signature)>
// Payload: { e: email, i: issuedAt, p: plan }
function generateApiKey(email, plan = 'free') {
  const secret = getSigningSecret();
  const payload = {
    e: email,
    i: Date.now(),
    p: plan
  };
  
  const payloadB64 = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = sign(payloadB64, secret);
  
  return `ogk_${payloadB64}.${signature}`;
}

// Validate API key and extract user info
function validateApiKey(apiKey) {
  try {
    if (!apiKey || !apiKey.startsWith('ogk_')) {
      return { valid: false, error: 'Invalid key format' };
    }
    
    const secret = getSigningSecret();
    const parts = apiKey.substring(4).split('.');
    
    if (parts.length !== 2) {
      return { valid: false, error: 'Malformed key' };
    }
    
    const [payloadB64, signature] = parts;
    
    if (!verify(payloadB64, signature, secret)) {
      return { valid: false, error: 'Invalid signature' };
    }
    
    const payload = JSON.parse(Buffer.from(payloadB64, 'base64url').toString());
    
    return {
      valid: true,
      email: payload.e,
      issuedAt: payload.i,
      plan: payload.p || 'free'
    };
  } catch (err) {
    return { valid: false, error: 'Key validation failed' };
  }
}

// Extract API key from request
function extractApiKey(req) {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }
  return req.headers['x-api-key'] || null;
}

// Middleware-style authentication
function authenticateRequest(req) {
  const apiKey = extractApiKey(req);
  if (!apiKey) {
    return { authenticated: false, error: 'Missing API key' };
  }
  
  const validation = validateApiKey(apiKey);
  if (!validation.valid) {
    return { authenticated: false, error: validation.error };
  }
  
  return {
    authenticated: true,
    email: validation.email,
    plan: validation.plan
  };
}

module.exports = {
  generateApiKey,
  validateApiKey,
  extractApiKey,
  authenticateRequest,
  getSigningSecret
};
