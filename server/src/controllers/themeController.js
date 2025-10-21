const themeService = require('../services/themeService');
const asyncHandler = require('../middleware/asyncHandler');
const env = require('../config/env');

const getTheme = asyncHandler(async (req, res) => {
  const themeId = req.query.id || env.defaultTheme;
  const theme = themeService.getThemeById(themeId);
  return res.json({ data: theme });
});

const listThemes = asyncHandler(async (req, res) => {
  const themes = themeService.listThemes();
  return res.json({ data: themes });
});

module.exports = {
  getTheme,
  listThemes
};
