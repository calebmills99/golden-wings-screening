const themeService = require('../services/themeService');

async function listThemes(req, res, next) {
  try {
    const themes = themeService.listThemes();
    return res.json({ data: themes });
  } catch (error) {
    return next(error);
  }
}

async function getTheme(req, res, next) {
  try {
    const theme = themeService.getThemeById(req.params.id);
    if (!theme) {
      return res.status(404).json({ message: 'Theme not found.' });
    }
    return res.json(theme);
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  listThemes,
  getTheme
};
