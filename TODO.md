# TODO / 技术债与优化项

轻量待办清单，记录暂不紧急但值得后续处理的技术改进。完成后从此处移除。

## 性能 / 打包

- [ ] **按课程动态拆包（code splitting）**
  - 现状：`src/data/index.js` 用静态 `import` 把所有 `{series}-{unit}.json` 一次性打进主 bundle，
    构建后主 JS 已约 1.29 MB（gzip ~435 KB），Vite 报 chunk >500 KB 警告。
  - 影响：课程越多，首屏加载的 JS 越大，即使用户只学其中一课也要下载全部词表。
  - 方向：改为按需 `import()`（如按 series/unit 懒加载 JSON），配合路由级代码分割；
    或用 `build.rollupOptions.output.manualChunks` 把课程数据拆成独立 chunk。
  - 触发时机：课程数量继续增长、或首屏加载变慢时优先处理。
