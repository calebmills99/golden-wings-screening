module.exports = function(eleventyConfig) {
  // Copy assets and videos into _site
  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });
  eleventyConfig.addPassthroughCopy({ "src/videos": "videos" });
    
    // 🔥 FIX: ADD THIS LINE TO COPY THE IMAGES DIRECTORY
    eleventyConfig.addPassthroughCopy({ "src/images": "images" });

  return {
    dir: {
      input: "src",
      output: "docs",
      includes: "_includes",
      layouts: "_layouts",
      data: "_data",
    },
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
  };
};