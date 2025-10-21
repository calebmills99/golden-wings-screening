const respond = require('../utils/respond');
const themeService = require('../services/themeService');

const getTheme = async (_req, res, next) => {
  try {
    const theme = await themeService.getActiveTheme();
    return respond(res, 200, {
      success: true,
      ...theme,
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getTheme,
};
