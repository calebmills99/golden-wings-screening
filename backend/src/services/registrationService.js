import { registrationRepository } from '../repositories/registrationRepository.js';
import { logger } from '../utils/logger.js';

export const registrationService = {
  async createRegistration(payload) {
    try {
      return await registrationRepository.create(payload);
    } catch (error) {
      logger.error('Failed to create registration', { error: error.message });
      throw error;
    }
  },

  async listRegistrations(options) {
    try {
      return await registrationRepository.list(options);
    } catch (error) {
      logger.error('Failed to list registrations', { error: error.message });
      throw error;
    }
  }
};
