# Editorial Design — 智能体技能与出版引擎

**v0.2.0**：用于投资者演示文稿、金融分析和编辑式报告的自主排版技能。智能体为每一页编写独立的 HTML/CSS/SVG，不再被九种固定幻灯片模板限制。

输出包括高质量 PDF、浏览器预览和**混合可编辑 PPTX**：所有复杂视觉元素由单张背景图保存，文字和数字为 PowerPoint 原生可编辑文本框。

## 快速开始

```bash
pip install -r requirements.txt
npm install
npm run setup:hallmark
python examples/editorial-reference/build_example.py
node bin/editorial.mjs build-html examples/editorial-reference --out outputs/arctic-case --allow-unverified
node bin/editorial.mjs verify outputs/arctic-case
npm run check
```

默认配色为克制的白、冰蓝、深蓝和淡紫色（Arctic Editorial），默认字体为 Geologica Roman；也可选 Geist、IBM Plex Sans、Onest、Manrope。创建新项目之前，技能会询问字体和配色，用户可以直接使用默认值。

Hallmark 设计审查和 Playwright 浏览器检查是正式交付的必要条件。进行两轮实际视觉审查；如果发现严重问题才进行第三轮。缺少依赖或审查证据时，发布状态为 `NOT_READY`。

## PDF 与 PPTX 一致性

先把 PPTX 重新渲染为图片，与 HTML 参考图逐页比较；通过检查后，从同一个 LibreOffice 渲染结果生成最终 PDF，从而让**已验证环境中的 PDF 和 PPTX**共享相同版面。其他设备若缺少字体或使用不同版本的 Microsoft PowerPoint，原生文字仍可能出现差异，无法保证所有设备逐像素相同。编辑数字也不会自动更新背景中的静态图表。

详细使用说明请参阅 [英文文档](README.md)、[SKILL.md](SKILL.md) 和 [docs/](docs/)。
