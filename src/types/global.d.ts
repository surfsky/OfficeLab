// 全局类型声明文件
// 确保TypeScript能够识别Element Plus组件

/// <reference path="./element-plus.d.ts" />

// Vue 全局属性扩展
declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $message: typeof ElMessage;
    $msgbox: typeof ElMessageBox;
    $alert: typeof ElMessageBox.alert;
    $confirm: typeof ElMessageBox.confirm;
    $prompt: typeof ElMessageBox.prompt;
    $notify: typeof ElNotification;
    $loading: typeof ElLoading;
  }
}

// 全局变量声明
declare global {
  // Vue 相关
  const Vue: any;
  const createApp: any;
  
  // Element Plus 相关
  const ElementPlus: {
    ElMessage: typeof ElMessage;
    ElMessageBox: typeof ElMessageBox;
    ElNotification: typeof ElNotification;
    ElLoading: typeof ElLoading;
    [key: string]: any;
  };
  
  // Excel 相关
  const XLSX: any;
  
  // 浏览器 API 扩展
  interface Window {
    Vue: any;
    ElementPlus: any;
    XLSX: any;
  }
}

export {};