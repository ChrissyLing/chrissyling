# 祝凌昀个人求职网站

## 网站结构
- 单文件网站：所有 HTML / CSS / JS 都内联在 `index.html` 里
- 图片：全部放在项目根目录 `portfolio_images/` 文件夹中，与 `index.html` 同级
- 选校决策页：`selection/`，可通过 `/selection/` 独立访问

## 主要模块
1. **Hero** - 重庆夜景全屏背景 + 打字机动效（策略运营 / 新媒体运营 / 内容创作 / 摄影）
2. **关于我** - 个人简介 + 教育背景卡片
3. **实习经历** - 垂直时间线（字节→美团→IPG→网易）品牌色节点
4. **作品集** - 摄影画廊 + 小红书 mockup + Dify AI Chatbot iframe
5. **技能** - 硬核技能 / AI效能 / 内容设计 三大模块
6. **联系方式**

## 本地预览

项目路径含空格，**不建议直接双击** `index.html`。请用本地服务器：

```bash
cd "/Users/bytedance/Desktop/cursor draft/personal_website_for_codex"
./start-local.sh
```

或手动：

```bash
python3 -m http.server 5500
# 浏览器打开 http://localhost:5500
```

只看选校决策页，也可以运行：

```bash
./selection/open-local.sh
```

## 版本说明
- 中英文双语切换（英文名：Chrissy）
- 打字机效果、lightbox 等交互动画
- 移动端自适应

## GitHub Pages 部署
- 仓库：[ChrissyLing/chrissyling](https://github.com/ChrissyLing/chrissyling)
- 站点：https://chrissyling.github.io/chrissyling/（或仓库 Settings → Pages 中配置的地址）
- 选校页：https://chrissyling.github.io/chrissyling/selection/
