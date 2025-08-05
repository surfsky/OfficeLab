import { defineConfig } from 'vite';
import { resolve } from 'path';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
  // 项目根目录 - 设置为 src 目录
  root: './src',
  base: './', // 设置基础路径为相对路径
  
  // 开发服务器配置
  server: {
    port: 3000,
    open: true, // 自动打开浏览器
    hmr: true,  // 启用热更新
  },
  
  // 构建配置
  build: {
    outDir: '../dist', // 输出到项目根目录的 dist 文件夹
    sourcemap: false, // 生产环境不生成 sourcemap
    minify: 'terser', // 使用 terser 进行代码混淆和压缩
    terserOptions: {
      compress: {
        drop_console: true, // 移除 console.log
        drop_debugger: true, // 移除 debugger
      },
      mangle: {
        toplevel: true, // 混淆顶级作用域的变量名
      },
    },
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'src/index.html'),
        distinct: resolve(__dirname, 'src/distinct/index.html'),
        comparer: resolve(__dirname, 'src/comparer/index.html'),
        group: resolve(__dirname, 'src/group/index.html'),
      },
      output: {
        manualChunks: undefined,
      },
    },
    // 确保静态资源被复制到dist目录
    copyPublicDir: true,
    emptyOutDir: true, // 清空输出目录
  },
  
  // 解析配置
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      'vue': 'vue/dist/vue.esm-bundler.js', // an alias for vue to use the full build
    },
    extensions: ['.ts', '.js', '.vue', '.json'],
  },
  
  // 静态资源处理 - 修正public目录路径
  publicDir: '../public',
});