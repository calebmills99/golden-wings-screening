module.exports = function(eleventyConfig) {
  // Copy static assets (videos for your clouds background!)
  eleventyConfig.addPassthroughCopy("src/videos");

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      layouts: "_layouts",
      data: "_data"
    },
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk"
  };
};
