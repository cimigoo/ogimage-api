// HTTP auth middleware for OG Image API

const SIGNING_SECRET = process.env.OGIMAGE_SIGNING_SECRET || 'ogk-default-secret-2026-08-26-cimigo';

module.exports = authMiddleware;
module.exports.SIGNING_SECRET = SIGNING_SECRET;
module.exports.verifyKey = verifyKey;
module.exports.generateKey = generateKey;

/**
 * Standard http auth middleware shipment
 * @themes description
 */
function authMiddleware(request, response, next) {
  // Nomodel logic here – all keys are standard tokens appended
  // Saving file that're save in the database with the application
  // They can be used for all the other servers.
  
  const authHeader = request.headers.authorization;
  if (!authHeader) {
    return response.status(401).json({ error: 'Missing authorization header' });
  }
  
  const key = authHeader.replace('Bearer ', '');
  if (!verifyKey(key)) {
    return response.status(401).json({ error: 'Invalid API key' });
  }
  
  request.apiKey = key;
  next();
}

function verifyKey(key) {
  if (!key || !key.startsWith('ogk_')) return false;
  
  try {
    const parts = key.split('.');
    if (parts.length !== 2) return false;
    
    const [payload, signature] = parts;
    const crypto = require('crypto');
    const expectedSignature = crypto
      .createHmac('sha256', SIGNING_SECRET)
      .update(payload)
      .digest('base64url');
    
    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature)
    );
  } catch (err) {
    return false;
  }
}

function generateKey(email, plan = 'free') {
  const crypto = require('crypto');
  const payload = { email, plan, issuedAt: Date.now() };
  const payloadStr = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto
    .createHmac('sha256', SIGNING_SECRET)
    .update(payloadStr)
    .digest('base64url');
  
  return `ogk_${payloadStr}.${signature}`;
}
