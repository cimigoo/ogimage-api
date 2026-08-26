/**
 * OG Image API - Rendering Module
 * Uses Satori (HTML/CSS → SVG) + Resvg (SVG → PNG)
 */

const satori = require('satori');
const { Resvg } = require('@resvg/resvg-js');

// Default dimensions for OG images
const DEFAULT_WIDTH = 1200;
const DEFAULT_HEIGHT = 630;

// Built-in themes
const THEMES = {
  default: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    textColor: '#ffffff',
    titleFont: 'bold 72px sans-serif',
    descriptionFont: '36px sans-serif'
  },
  minimal: {
    background: '#ffffff',
    textColor: '#1a1a1a',
    titleFont: 'bold 64px sans-serif',
    descriptionFont: '32px sans-serif',
    borderColor: '#e5e5e5'
  },
  dark: {
    background: '#0f172a',
    textColor: '#f1f5f9',
    titleFont: 'bold 68px sans-serif',
    descriptionFont: '34px sans-serif'
  },
  tech: {
    background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
    textColor: '#ffffff',
    titleFont: 'bold 64px monospace',
    descriptionFont: '28px monospace'
  }
};

// Generate OG image from simple parameters
async function generateFromParams(params) {
  const {
    title = 'Untitled',
    description = '',
    theme = 'default',
    width = DEFAULT_WIDTH,
    height = DEFAULT_HEIGHT,
    logo = null,
    author = ''
  } = params;
  
  const themeConfig = THEMES[theme] || THEMES.default;
  
  // Build HTML structure
  const html = `
    <div style="
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: flex-start;
      width: ${width}px;
      height: ${height}px;
      background: ${themeConfig.background};
      color: ${themeConfig.textColor};
      padding: 80px;
      box-sizing: border-box;
    ">
      ${logo ? `<img src="${logo}" style="width: 120px; height: 120px; margin-bottom: 40px; border-radius: 12px;" />` : ''}
      <div style="font: ${themeConfig.titleFont}; line-height: 1.2; margin-bottom: 24px; max-width: 90%;">
        ${escapeHtml(title)}
      </div>
      ${description ? `
        <div style="font: ${themeConfig.descriptionFont}; opacity: 0.9; max-width: 85%; line-height: 1.4;">
          ${escapeHtml(description)}
        </div>
      ` : ''}
      ${author ? `
        <div style="position: absolute; bottom: 60px; left: 80px; font: 28px sans-serif; opacity: 0.8;">
          by ${escapeHtml(author)}
        </div>
      ` : ''}
    </div>
  `;
  
  return await renderHtml(html, width, height);
}

// Generate OG image from custom HTML
async function generateFromHtml(html, width = DEFAULT_WIDTH, height = DEFAULT_HEIGHT) {
  return await renderHtml(html, width, height);
}

// Core rendering function
async function renderHtml(html, width, height) {
  try {
    // Convert HTML to SVG using Satori
    const svg = await satori(
      // Satori expects a React-like element, we'll pass a simple object
      {
        type: 'div',
        props: {
          style: {
            display: 'flex',
            width: `${width}px`,
            height: `${height}px`,
          },
          children: [
            {
              type: 'div',
              props: {
                style: {
                  width: '100%',
                  height: '100%',
                },
                dangerouslySetInnerHTML: { __html: html }
              }
            }
          ]
        }
      },
      {
        width,
        height,
        fonts: [], // Using system fonts
      }
    );
    
    // Convert SVG to PNG using Resvg
    const resvg = new Resvg(svg, {
      fitTo: {
        mode: 'width',
        value: width
      }
    });
    
    const pngData = resvg.render();
    const pngBuffer = pngData.asPng();
    
    return pngBuffer;
  } catch (err) {
    console.error('Render error:', err);
    throw new Error(`Failed to render image: ${err.message}`);
  }
}

// HTML escape helper
function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, m => map[m]);
}

// Get available themes
function getThemes() {
  return Object.keys(THEMES);
}

module.exports = {
  generateFromParams,
  generateFromHtml,
  getThemes,
  DEFAULT_WIDTH,
  DEFAULT_HEIGHT
};
