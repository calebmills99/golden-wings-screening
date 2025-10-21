import { styleRepository } from '../repositories/styleRepository.js';
import { logger } from '../utils/logger.js';

const fallbackStyle = {
  variant: 'default',
  cssVariables: {
    '--scheme-background': '#ffffff',
    '--scheme-border': '#dbeafe',
    '--neutral-darkest': '#0f172a',
    '--primary-blue': '#1d4ed8',
    '--primary-blue-light': '#60a5fa',
  },
  mobileLayout: {
    hero: {
      overlayOpacity: 0.65,
      showVideo: false,
    },
  },
  heroCopy: {
    tagline: 'Connecting Hearts at 35,000 Feet',
    supporting: 'A compassionate journey through aviation history.',
  },
};

export const styleService = {
  async getStyle(variant) {
    try {
      const style = await styleRepository.findByVariant(variant);
      return style ?? fallbackStyle;
    } catch (error) {
      logger.error('Failed to fetch style from database', { error: error.message });
      return fallbackStyle;
    }
  },

  async listStyles() {
    try {
      return await styleRepository.list();
    } catch (error) {
      logger.error('Failed to list styles', { error: error.message });
      return [fallbackStyle];
    }
  },

  async upsertStyle(payload) {
    try {
      return await styleRepository.upsert(payload);
    } catch (error) {
      logger.error('Failed to upsert style', { error: error.message });
      throw error;
    }
  }
};
