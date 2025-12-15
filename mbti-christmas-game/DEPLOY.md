# 部署到 GitHub 指南

## 方法一：使用 GitHub CLI (推薦)

1. 安裝 GitHub CLI（如果還沒安裝）：
```bash
brew install gh
```

2. 登入 GitHub：
```bash
gh auth login
```

3. 在專案目錄中建立 GitHub repository 並推送：
```bash
cd ~/Desktop/mbti-christmas-game
gh repo create mbti-christmas-game --public --source=. --remote=origin --push
```

## 方法二：使用 GitHub 網站

1. 前往 [GitHub](https://github.com/new) 建立新的 repository
   - Repository name: `mbti-christmas-game`
   - 選擇 Public 或 Private
   - **不要**勾選 "Initialize this repository with a README"

2. 在專案目錄執行以下命令：
```bash
cd ~/Desktop/mbti-christmas-game
git remote add origin https://github.com/YOUR_USERNAME/mbti-christmas-game.git
git branch -M main
git push -u origin main
```
（請將 `YOUR_USERNAME` 替換成你的 GitHub 用戶名）

## 部署到 GitHub Pages

### 使用 GitHub Actions 自動部署

1. 建立 `.github/workflows/deploy.yml` 檔案：

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches:
      - main

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v3

      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm install

      - name: Build
        run: npm run build

      - name: Deploy
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

2. 在 GitHub repository 設定中啟用 Pages：
   - 前往 Settings > Pages
   - Source 選擇 "GitHub Actions"

## 完成！

完成後，你的專案將會在以下網址可見：
`https://YOUR_USERNAME.github.io/mbti-christmas-game/`





