#!/usr/bin/env sh

# 确保脚本抛出遇到的错误
set -e

initDist(){
  echo $1 > base.js
}

#------------------------------------------

# url访问目录，这个是你 github 仓库的名字
initDist "module.exports = '/notes/'"

# 生成静态文件
npm run build

# 进入生成的文件夹
cd docs/.vuepress/dist

# deploy to github
if [ -z "$GITHUB_TOKEN" ]; then
  # 手动部署
  msg='deploy'
  githubUrl=git@github.com:Davidzhu001/davidzhu001.github.io.git
else
  # 自动部署
  msg='来自github actions的自动部署'
  githubUrl=https://Davidzhu001:${GITHUB_TOKEN}@github.com/Davidzhu001/davidzhu001.github.io.git
  git config --global user.name "Davidzhu001"
  git config --global user.email "weicheng.zhu@icloud.com"
fi

# 初始化一个新的Git仓库
git init
# 添加所有文件到Git
git add -A
# 提交更改
git commit -m "${msg}"

# 强制推送到指定的GitHub Pages分支
git push -f $githubUrl master:gh-pages

# 返回到之前的目录
cd -
# 删除生成的dist文件夹
rm -rf docs/.vuepress/dist

#------------------------------------------
