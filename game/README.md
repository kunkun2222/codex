# 归宅 · 秋夜

无依赖的网页小游戏，当前入口为约两分钟的试玩：前院 → 奶奶的短信 → 菜园调查 → 客厅拿手电 → 停电与门外动静。首页为开始画面，点击“开始游戏”进入大场景；直接点击画面里的物体探索，无常驻标签和章节旁白；点击后显示简短反馈。底部手机、工具箱和备忘录图标可打开面板，手机支持读取短信，工具箱可查看和使用手电筒。客厅已替换为沙发视角独立图，左下向后箭头切换到无楼梯的大门口独立视角（再点返回客厅），厨房门关闭并位于楼梯右侧；菜园暂为外景局部放大。当前没有音效、存档或追逐，刷新会重新开始。

## 本地运行

在仓库根目录执行 `python3 -m http.server 8000 --directory game`，用浏览器访问本地服务。也可直接打开 game/index.html，无需构建或安装依赖。

## Netlify 发布

1. 登录 Netlify，选择 Add new project → Import an existing project → GitHub。
2. 授权访问并选择 kunkun2222/codex，部署分支选择 main。
3. Base directory 留空，Build command 留空，Publish directory 填 game。根目录 netlify.toml 已声明发布目录。
4. 点击 Deploy，完成后打开 Netlify 提供的网站地址。

也可将 game 文件夹拖到 Netlify Drop 发布。之后向 main 推送更改，可触发已连接站点的自动部署。

game.js 保留了之前的完整剧情草稿，当前网页只加载 demo.js。

## 图片画廊

打开 `game/gallery.html` 可查看七张场景图，支持放大和下载。GitHub 中可以直接打开根目录 `GALLERY.md`。当前试玩首页使用第五版写实恐怖夜景（外观已移除南瓜果实）；客厅和大门口已使用新写实图，其余室内仍是早期概念。

## 客厅开关与电视

初次进入客厅时灯与电视关闭。最左侧墙面开关控制客厅灯，厨房门左侧、楼梯旁开关独立控制楼梯灯。电视每点击一次按关机 → 新闻联播 → 电影频道 → 动画片 → 关机循环；当前节目为静态示意画面，无视频和音频。离开客厅再回来保留状态，刷新页面重置。上楼触发剧情停电后，灯和电视均不能再打开。

`demo.js` 中的 `mainLight`、`stairLight`、`tvMode` 控制初始状态，`toggleMainLight`、`toggleStairLight`、`cycleTv` 是操作函数。替换频道图片可修改 `tvImages`。
