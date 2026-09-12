# 合租管家 · Roomie Home

一个面向年轻合租人群的多人生活协作原型，包含：

- 费用 AA 分摊
- 清洁值日排班
- 公共物品登记与补货认领
- 室友公约共同确认
- 最近动态
- 创建 / 加入合租空间
- 邀请室友

## 本地运行

无需安装任何依赖，直接双击 `index.html` 即可。

也可以使用任意本地静态服务器，例如：

```bash
python -m http.server 8000
```

然后打开 `http://localhost:8000`。

## 部署到 Vercel

1. 新建 GitHub 仓库。
2. 上传本项目全部文件到仓库根目录。
3. 在 Vercel 中点击 `Add New -> Project`。
4. Import 这个 GitHub 仓库。
5. Framework Preset 选择 `Other`（通常会自动识别为静态站点）。
6. 不需要填写 Build Command。
7. 点击 Deploy。
8. 部署完成后，用无痕窗口打开 Production URL，确认无需登录即可访问。

后续修改时继续 push 到同一个 GitHub 仓库，Vercel 会自动更新同一个 Production Domain。
