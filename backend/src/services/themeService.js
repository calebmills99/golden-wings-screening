const path = require('path');

const themes = require(path.resolve(__dirname, '../../..', 'src/_data/themes.json'));
const siteConfig = require(path.resolve(__dirname, '../../..', 'src/_data/siteConfig.json'));

const attachMetadata = (theme, resolvedId) => ({
  ...theme,
  id: resolvedId || theme.id,
  updatedAt: siteConfig.meta?.lastUpdated || new Date().toISOString()
});

function listThemes() {
  return themes.map((theme) => attachMetadata(theme));
}

function getThemeById(themeId) {
  const fallbackId = siteConfig.theme?.defaultStyle;
  const fallbackTheme = themes.find((theme) => theme.id === fallbackId) || themes[0];
  const resolvedTheme = themes.find((theme) => theme.id === themeId) || fallbackTheme;
  return attachMetadata(resolvedTheme, resolvedTheme.id);
}

module.exports = {
  listThemes,
  getThemeById
};
