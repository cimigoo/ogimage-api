/**
 * OG Image API - Rendering Module
 * Uses Satori (HTML/CSS → SVG) + Resvg (SVG → PNG)
 */

const satori = require('satori');
const { Resvg } = require('@resvg/resvg-js');

const DEFAULT_WIDTH = 1200;
const DEFAULT_HEIGHT = 630;

const THEMES = {
  default: {
    bg: ['#667eea', '#764ba2'],
    text: '#ffffff',
    font: 'sans-serif'
  },
  minimal: {
    bg: ['#ffffff', '#f5f5f5'],
    text: '#1a1a1a',
    font: 'sans-serif'
  },
  dark: {
    bg: ['#0f172a', '#1e293b'],
    text: '#f1f5f9',
    font: 'sans-serif'
  },
  tech: {
    bg: ['#1e3a8a', '#3b82f6'],
    text: '#ffffff',
    font: 'monospace'
  }
};

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
  
  const children = [];
  
  if (logo) {
    children.push({
      type: 'div',
      props: {
        style: { marginBottom: 40 },
        children: {
          type: 'img',
          props: { src: logo, width: 120, height: 120 }
        }
      }
    });
  }
  
  children.push({
    type: 'div',
    props: {
      style: {
        fontSize: 72,
        fontWeight: 'bold',
        color: themeConfig.text,
        fontFamily: themeConfig.font,
        lineHeight: 1.2,
        marginBottom: 24
      },
      children: title
    }
  });
  
  if (description) {
    children.push({
      type: 'div',
      props: {
        style: {
          fontSize: 36,
          color: themeConfig.text,
          opacity: 0.9,
          fontFamily: themeConfig.font,
          lineHeight: 1.4
        },
        children: description
      }
    });
  }
  
  if (author) {
    children.push({
      type: 'div',
      props: {
        style: {
          position: 'absolute',
          bottom: 60,
          left: 80,
          fontSize: 28,
          color: themeConfig.text,
          opacity: 0.8,
          fontFamily: themeConfig.font
        },
        children: `by ${author}`
      }
    });
  }
  
  const element = {
    type: 'div',
    props: {
      style: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-start',
        width: width,
        height: height,
        background: `linear-gradient(135deg, ${themeConfig.bg[0]} 0%, ${themeConfig.bg[1]} 100%)`,
        padding: 80,
        boxSizing: 'border-box'
      },
      children: children
    }
  };
  
  const svg = await satori(element, { width, height, fonts: [] });
  
  const resvg = new Resvg(svg, { fitTo: { mode: 'width', value: width } });
  return resvg.render().asPng();
}

async function generateFromHtml(html, width = DEFAULT_WIDTH, height = DEFAULT_HEIGHT) {
  const element = {
    type: 'div',
    props: {
      style: { width, height, display: 'flex' },
      children: [{ type: 'div', props: { style: { width: '100%', height: '100%' }, dangerouslySetInnerHTML: { __html: html } } }]
    }
  };
  
  const svg = await satori(element, { width, height, fonts: [] });
  const resvg = new Resvg(svg, { fitTo: { mode: 'width', value: width } });
  return resvg.render().asPng();
}

function getThemes() { return Object.keys(THEMES); }

module.exports = { generateFromParams, generateFromHtml, getThemes, DEFAULT_WIDTH, DEFAULT_HEIGHT };
