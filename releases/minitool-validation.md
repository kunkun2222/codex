# 暮光小镇 · 小红书小工具 ZIP 校验报告

- ZIP：`twilight-village-minitool.zip`
- 文件数：28
- 体积：2089618 bytes（1.993 MiB），低于建议 2 MiB 及硬上限 10 MiB。
- SHA-256：`2d5e692c3b0622f2b4fb44192dad41b259620ead1e4bbdc863accc9da0a126a2`
- Skill：minitool-zip-builder 1.8.0，原始下载地址 https://fe-static.xhscdn.com/minitool/20261015161653/minitool-zip-builder-1.8.0.skill
- Skill 压缩包 SHA-256：`05acf32fb278a0016e6c52a2449eb86784848b644c3c9256df45833cdad9384f`
- Skill 解压目录：`/workspace/codex/.codex/minitool-zip-builder/`

## 已完成的静态校验

- 目录审计：28 文件，0 错误、0 警告。
- ZIP 审计：28 文件，0 错误、0 警告；逐文件校验与审计目录字节一致，ZIP CRC 无错误。
- 根目录直接包含唯一 `index.html`，带中文语言、UTF-8、viewport-fit=cover；没有多套一层文件夹。
- 包内只含支持的 HTML/CSS/JS/WebP/WOFF2/JSON；不含 node_modules、Git 元数据、source map、构建配置或额外网页。
- 脚本为外置经典 IIFE，Vite 目标设为 ES2017 / Chrome 61；没有 module、运行时 import/export、inline script 或 HTML 行内事件。
- 资源路径全为包内相对路径；12 张结果图、10 张题图、首页图、字体与字体许可证均已打包，没有外部 CDN 依赖。
- 未检出网页网络请求、动态执行、Worker、WASM、外链跳转、下载逻辑等禁用项。未使用定位、剪贴板、音视频、WebGL、相机或传感器。
- Chrome 61 兼容修复：Object.fromEntries 改为局部 ES2017 实现；Canvas 圆角、图片加载与弹窗具备回退；Flex gap 使用实际布局检测与 margin 回退；Grid gap、媒体比例、inset、焦点、视口、安全区、字体权重与透明色具备基线处理。
- 图片副本最大 720px，WebP quality=52；原网站插画保留。无静态大型 Base64 / 内置数据库；文本体积未触发门禁。
- 相册保存依据随包公开 API：优先 `writeTempFile` 后 `saveImageToPhotosAlbum`，支持无临时文件接口时的数据 URI 路径；检查方法存在，处理失败并限制生成图片在 1 MiB 内。不包含网站的 a[download] / blob 下载实现。

## 代码测试与开发诊断（不等于容器验收）

- `npm test`：10 项通过；覆盖 64 条路线、旧分支移除、12 种结果、原生相册调用参数、缺失接口、权限失败和生成图片预算。
- `npm run build`：原网站生产构建通过，网站继续使用 PNG 下载。
- `npm run build:minitool`：独立小工具包构建通过。
- 普通 Chromium 仅用于研发诊断：在嵌套资源路径及严格 CSP 下检查完整 15 题、模拟 bridge / 无 bridge 两种路径；人为关闭新 Web API 检查局部回退，未出现 JS 错误或 CSP 违规。模拟 bridge 返回并不代表真正写入相册；这些结果不作为小工具功能、Chrome 61 兼容性或交付验收依据。

## 尚未完成，必须后续核验

1. 在线规范： https://miniapp-sandbox.xiaohongshu.com/minitool/doc 返回 HTTP 403，申请访问后仍不可用。本次按 skill 允许的本地基线回退实施（API 快照 2026-09-23）；没有发现或宣称任何在线新增能力，未确认当前线上契约。
2. 创服平台模拟器：待用户上传本 ZIP 并完成完整流程验证，包括答题、分支、返回改选、12 种结果和相册保存。
3. Android 真机扫码：待用户用同一 ZIP 验证；Android 8.1 / Chrome 61 JavaScript、CSS、图片显示、性能及相册权限未实测。
4. iOS 真机扫码：待用户用同一 ZIP 验证安全区、滚动、字体、分享卡与相册授权。真机性能未实测。

未登录创服平台、未上传 ZIP、未尝试真机验证，也未宣称已通过平台审核。

## 可重复构建

需要已有 npm 依赖、Python 3.9+ 与 ImageMagick。

```bash
npm test
npm run build:minitool
python3 scripts/validate-minitool.py
python3 .codex/minitool-zip-builder/scripts/audit_artifact.py dist-minitool
python3 .codex/minitool-zip-builder/scripts/audit_artifact.py artifacts/twilight-village-minitool.zip
```
