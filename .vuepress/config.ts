import { defineUserConfig } from "vuepress";
import recoTheme from "vuepress-theme-reco";
import { viteBundler } from '@vuepress/bundler-vite'
import { webpackBundler } from '@vuepress/bundler-webpack'
import { mdEnhancePlugin } from "vuepress-plugin-md-enhance";
import { markdownMathPlugin } from '@vuepress/plugin-markdown-math'


export default defineUserConfig({
  title: "Davidzhu001",
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
    author: "Davidzhu001",
    authorAvatar: "/head.png",
    docsRepo: "https://github.com/davidzhu001",
    docsBranch: "main",
    docsDir: "example",
    lastUpdatedText: "",
    autoSetSeries: true,

    navbar: [
      { text: "Home", link: "/" },
      { text: "GameDev", link: "/series/gamedev/" },
      { text: "Devlogs", link: "/series/devlogs/readme.md" },
      { text: "AI World", link: "/series/ais/" },

      { text: "Resources", link: "/series/resources/" },
    ],

  }),
  // debug: true,
});
