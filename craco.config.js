const HtmlWebpackPlugin = require('html-webpack-plugin');

/** Preload hashed main CSS/JS so the browser can start them early (after HTML parse). */
class PreloadMainChunksPlugin {
  apply(compiler) {
    compiler.hooks.compilation.tap('PreloadMainChunksPlugin', (compilation) => {
      HtmlWebpackPlugin.getHooks(compilation).alterAssetTagGroups.tap(
        'PreloadMainChunksPlugin',
        (data) => {
          const stylePreloads = [];
          const scriptPreloads = [];
          for (const tag of data.headTags) {
            if (
              tag.tagName === 'link' &&
              tag.attributes?.rel === 'stylesheet' &&
              tag.attributes?.href
            ) {
              stylePreloads.push({
                tagName: 'link',
                voidTag: true,
                meta: { plugin: 'preload-main' },
                attributes: {
                  rel: 'preload',
                  href: tag.attributes.href,
                  as: 'style',
                },
              });
            }
            if (tag.tagName === 'script' && tag.attributes?.src) {
              scriptPreloads.push({
                tagName: 'link',
                voidTag: true,
                meta: { plugin: 'preload-main' },
                attributes: {
                  rel: 'preload',
                  href: tag.attributes.src,
                  as: 'script',
                },
              });
            }
          }
          data.headTags = [...stylePreloads, ...scriptPreloads, ...data.headTags];
          return data;
        }
      );
    });
  }
}

module.exports = {
  webpack: {
    plugins: {
      add: [new PreloadMainChunksPlugin()],
    },
  },
};
