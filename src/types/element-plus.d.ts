// Element Plus 全局类型声明
declare global {
  interface Window {
    ElementPlus: any;
  }
}

// Element Plus 消息提示类型
interface MessageOptions {
  message: string;
  type?: 'success' | 'warning' | 'error' | 'info';
  duration?: number;
  showClose?: boolean;
  center?: boolean;
  dangerouslyUseHTMLString?: boolean;
  customClass?: string;
  iconClass?: string;
  onClose?: () => void;
}

interface MessageBoxOptions {
  title?: string;
  message?: string;
  type?: 'success' | 'warning' | 'error' | 'info';
  showCancelButton?: boolean;
  showConfirmButton?: boolean;
  cancelButtonText?: string;
  confirmButtonText?: string;
  beforeClose?: (action: string, instance: any, done: () => void) => void;
}

interface NotificationOptions {
  title?: string;
  message?: string;
  type?: 'success' | 'warning' | 'error' | 'info';
  duration?: number;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  showClose?: boolean;
  onClick?: () => void;
  onClose?: () => void;
}

interface LoadingOptions {
  target?: string | HTMLElement;
  body?: boolean;
  fullscreen?: boolean;
  lock?: boolean;
  text?: string;
  spinner?: string;
  background?: string;
  customClass?: string;
}

// Element Plus 组件类型声明
declare const ElMessage: {
  success(message: string): void;
  warning(message: string): void;
  error(message: string): void;
  info(message: string): void;
  (options: MessageOptions): void;
  closeAll(): void;
};

declare const ElMessageBox: {
  alert(message: string, title?: string, options?: MessageBoxOptions): Promise<any>;
  confirm(message: string, title?: string, options?: MessageBoxOptions): Promise<any>;
  prompt(message: string, title?: string, options?: MessageBoxOptions): Promise<any>;
  close(): void;
};

declare const ElNotification: {
  success(options: NotificationOptions | string): void;
  warning(options: NotificationOptions | string): void;
  error(options: NotificationOptions | string): void;
  info(options: NotificationOptions | string): void;
  (options: NotificationOptions): void;
  closeAll(): void;
};

declare const ElLoading: {
  service(options?: LoadingOptions): {
    close(): void;
  };
};

// 表单组件类型
declare const ElForm: any;
declare const ElFormItem: any;
declare const ElInput: any;
declare const ElButton: any;
declare const ElSelect: any;
declare const ElOption: any;
declare const ElDatePicker: any;
declare const ElTimePicker: any;
declare const ElUpload: any;
declare const ElTable: any;
declare const ElTableColumn: any;
declare const ElPagination: any;
declare const ElTree: any;
declare const ElCheckbox: any;
declare const ElRadio: any;
declare const ElSwitch: any;
declare const ElSlider: any;
declare const ElRate: any;
declare const ElColorPicker: any;
declare const ElTransfer: any;
declare const ElCascader: any;
declare const ElInputNumber: any;
declare const ElAutocomplete: any;

// 布局组件类型
declare const ElRow: any;
declare const ElCol: any;
declare const ElContainer: any;
declare const ElHeader: any;
declare const ElAside: any;
declare const ElMain: any;
declare const ElFooter: any;

// 导航组件类型
declare const ElMenu: any;
declare const ElMenuItem: any;
declare const ElMenuItemGroup: any;
declare const ElSubmenu: any;
declare const ElTabs: any;
declare const ElTabPane: any;
declare const ElBreadcrumb: any;
declare const ElBreadcrumbItem: any;
declare const ElPageHeader: any;
declare const ElDropdown: any;
declare const ElDropdownMenu: any;
declare const ElDropdownItem: any;
declare const ElSteps: any;
declare const ElStep: any;

// 数据展示组件类型
declare const ElTag: any;
declare const ElProgress: any;
declare const ElBadge: any;
declare const ElAvatar: any;
declare const ElEmpty: any;
declare const ElDescriptions: any;
declare const ElDescriptionsItem: any;
declare const ElResult: any;
declare const ElStatistic: any;

// 反馈组件类型
declare const ElAlert: any;
declare const ElDialog: any;
declare const ElDrawer: any;
declare const ElPopover: any;
declare const ElPopconfirm: any;
declare const ElTooltip: any;

// 其他组件类型
declare const ElCard: any;
declare const ElCollapse: any;
declare const ElCollapseItem: any;
declare const ElTimeline: any;
declare const ElTimelineItem: any;
declare const ElDivider: any;
declare const ElCalendar: any;
declare const ElImage: any;
declare const ElBacktop: any;
declare const ElInfiniteScroll: any;

// 导出类型以供其他文件使用
export {
  ElMessage,
  ElMessageBox,
  ElNotification,
  ElLoading,
  MessageOptions,
  MessageBoxOptions,
  NotificationOptions,
  LoadingOptions
};