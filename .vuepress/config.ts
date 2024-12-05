import { defineUserConfig } from "vuepress";
import recoTheme from "vuepress-theme-reco";
import { viteBundler } from '@vuepress/bundler-vite'
import { webpackBundler } from '@vuepress/bundler-webpack'
import { mdEnhancePlugin } from "vuepress-plugin-md-enhance";
import { markdownMathPlugin } from '@vuepress/plugin-markdown-math'


export default defineUserConfig({
  title: "vuepress-theme-reco",
  description: "Just playing around",
  bundler: viteBundler(),
  plugins: [
    mdEnhancePlugin({
      mermaid: true,

    }),
    markdownMathPlugin({
      // 选项
    }),
  ],
 
  // bundler: webpackBundler(),
  theme: recoTheme({
    logo: "/logo.png",
    author: "reco_luan",
    authorAvatar: "/head.png",
    docsRepo: "https://github.com/vuepress-reco/vuepress-theme-reco-next",
    docsBranch: "main",
    docsDir: "example",
    lastUpdatedText: "",
    autoSetSeries: true,

    navbar: [
      { text: "Home", link: "/" },
      { text: "GameDev", link: "/series/gamedev/gamedev.md" },
      { text: "Tags", link: "/tags/tag1/1.html" },
      {
        text: "Docs",
        children: [
          { text: "vuepress-reco", link: "/docs/theme-reco/theme" },
          { text: "vuepress-theme-reco", link: "/blogs/other/guide" },
        ],
      },
    ],

  }),
  // debug: true,
});
