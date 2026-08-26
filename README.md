# OG Image API

Developer-friendly API for generating dynamic Open Graph (social share) images. Pure HTML/CSS rendering, zero database, 3-minute integration.

## Features

- 🎨 **Full HTML/CSS Support** - No limited template engine. Write standard HTML and CSS.
- ⚡ **Lightning Fast** - Edge-rendered globally. 20-300ms response times.
- 🔒 **Zero Database** - HMAC-signed API keys. Privacy-first architecture.
- 🚀 **3-Minute Integration** - Simple REST API. Works with any framework.
- 💰 **Affordable Pricing** - Start free with 100 images/month.
- 🎯 **Built-in Themes** - 4 professional themes included.

## Quick Start

### 1. Get Your API Key

```bash
curl -X POST https://api.getogimage.com/api/get-api-key \
  -H "Content-Type: application/json" \
  -d '{"email": "you@example.com"}'
```

### 2. Generate Your First Image

```bash
curl -X POST https://api.getogimage.com/api/generate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -d '{
    "title": "My Blog Post",
    "description": "A brief description",
    "theme": "default"
  }' \
  --output og-image.png
```

### 3. Use in Your HTML

```html
<meta property="og:image" content="https://yoursite.com/api/og?title=My+Post&theme=default" />
```

## API Reference

### `POST /api/generate`

Generate an OG image.

**Simple Mode (JSON parameters):**

```json
{
  "title": "Blog Post Title",
  "description": "Brief description",
  "theme": "default|minimal|dark|tech",
  "logo": "https://example.com/logo.png",
  "author": "John Doe",
  "width": 1200,
  "height": 630
}
```

**Advanced Mode (Custom HTML):**

```json
{
  "html": "<div style='...'>Your custom HTML</div>",
  "width": 1200,
  "height": 630
}
```

**Response:** PNG image binary

### `POST /api/get-api-key`

Get a free API key.

**Request:**

```json
{
  "email": "you@example.com"
}
```

**Response:**

```json
{
  "apiKey": "ogk_...",
  "plan": "free",
  "email": "you@example.com"
}
```

### `GET /api/check-usage`

Check your API usage.

**Headers:** `Authorization: Bearer YOUR_API_KEY`

**Response:**

```json
{
  "email": "you@example.com",
  "plan": "free",
  "usage": {
    "current": 42,
    "limit": 100
  },
  "quota": {
    "remaining": 58,
    "percentage": "42.00"
  }
}
```

### `GET /api/themes`

List available themes.

**Response:**

```json
{
  "themes": ["default", "minimal", "dark", "tech"]
}
```

## Pricing

| Plan | Price | Images/Month | Features |
|------|-------|--------------|----------|
| Free | $0 | 100 | 4 themes, community support |
| Developer | $9/mo | 2,000 | Custom HTML, priority support |
| Pro | $19/mo | 10,000 | Custom HTML, priority support, custom domains |

## Architecture

- **Zero Database**: HMAC-signed API keys, no user data stored
- **Serverless**: Deployed on Vercel, globally distributed
- **Rendering**: Satori (HTML/CSS → SVG) + Resvg (SVG → PNG)
- **Authentication**: HMAC-SHA256 signature verification

## Development

```bash
# Install dependencies
npm install

# Run locally
npm run dev

# Deploy
npm run deploy
```

## License

MIT

## Support

- Documentation: https://getogimage.com/docs
- Email: support@getogimage.com
