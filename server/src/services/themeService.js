const path = require('path');
const env = require('../config/env');

const siteConfig = require(path.resolve(__dirname, '../../..', 'src/_data/siteConfig.json'));

const themeRegistry = {
  'skyward-courage': {
    ...siteConfig.theme,
    updatedAt: siteConfig.meta?.lastUpdated || new Date().toISOString()
  },
  'aurora-dusk': {
    id: 'aurora-dusk',
    tagline: 'Evening Glow Above the Wing',
    missionStatement: 'An after-hours motif that pairs starlit cabins with luminous horizon gradients.',
    values: [
      {
        title: 'Twilight Serenity',
        description: 'A calming palette that evokes sundown flights over the Atlantic.'
      },
      {
        title: 'Cabin Luminosity',
        description: 'Soft purples and blues for ambient experiences and VIP lounges.'
      },
      {
        title: 'Celestial Navigation',
        description: 'Guided highlights that mirror constellations from night routes.'
      }
    ],
    palette: {
      primary: '#7c3aed',
      primarySoft: '#a855f7',
      highlight: '#facc15',
      surface: '#0f172a'
    },
    updatedAt: new Date().toISOString()
  },
  'golden-horizon': {
    id: 'golden-horizon',
    tagline: 'Sunrise Over Runway 27L',
    missionStatement: 'An uplifting dawn-inspired treatment for celebratory premiere weekends.',
    values: [
      {
        title: 'Warm Welcome',
        description: 'Amber gradients and soft neutrals that greet guests with sunrise energy.'
      },
      {
        title: 'Runway Radiance',
        description: 'Bold accent stripes inspired by early morning departures.'
      },
      {
        title: 'Golden Legacy',
        description: 'Honors Robyn Stewart’s earliest takeoffs with shimmering highlights.'
      }
    ],
    palette: {
      primary: '#ea580c',
      primarySoft: '#f97316',
      highlight: '#facc15',
      surface: '#fffbeb'
    },
    updatedAt: new Date().toISOString()
  }
};

function getThemeById(themeId) {
  return themeRegistry[themeId] || themeRegistry[env.defaultTheme] || themeRegistry['skyward-courage'];
}

function listThemes() {
  return Object.values(themeRegistry);
}

module.exports = {
  getThemeById,
  listThemes
};
