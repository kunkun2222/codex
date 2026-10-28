# 朋友试玩与手机预览

这个项目是纯静态网页，可发布到 GitHub Pages、Cloudflare Pages 或 Netlify。

## GitHub Pages（推荐）

1. 打开仓库 Settings → Pages。
2. Source 选择 Deploy from a branch。
3. Branch 选择 main，目录选择 / (root)，点击 Save。
4. 等 Pages 部署成功后，打开 https://kunkun2222.github.io/codex/ 。根页面自动进入 game/。

之后推送到 main 的更新会自动发布，无需朋友下载代码。网站地址以 Settings → Pages 实际显示为准。GitHub Pages 在部分地区可能连接较慢。

## Cloudflare Pages

连接 GitHub 仓库 kunkun2222/codex，生产分支 main，框架 None，构建命令留空，输出目录 game。使用平台提供的 pages.dev 地址分享。

## 手机

支持横竖屏，推荐横屏；支持的浏览器可点“全屏”。浏览器要求用户先点击页面才能播放声音。iPhone Safari 的网页全屏可能不可用，可横屏或添加到主屏幕。当前版本仍含“测试：断电”按钮，倒计时需手动开始。

备忘录与第二天进度只保存在当前设备浏览器，不会同步到朋友的设备。首次访问从第一晚开始。独立测试第二天可使用 game/?preview=day2。
