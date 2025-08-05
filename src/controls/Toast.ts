/**
 * Toast 通知组件
 * 自主控制HTML元素和样式的生成
 */
export class Toast {
    private static container: HTMLElement | null = null;
    private static initialized = false;

    /**
     * 初始化Toast容器
     */
    private static init() {
        if (this.initialized) return;

        // 创建容器元素
        this.container = document.createElement('div');
        this.container.id = 'toast-container';
        this.container.className = 'toast-container';
        
        // 添加样式
        this.addStyles();
        
        // 添加到页面
        document.body.appendChild(this.container);
        this.initialized = true;
    }

    /**
     * 添加Toast样式
     */
    private static addStyles() {
        const styleId = 'toast-styles';
        if (document.getElementById(styleId)) return;

        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = `
            .toast-container {
                position: fixed;
                top: 0;
                left: 50%;
                transform: translateX(-50%);
                z-index: 25000;
                pointer-events: none;
                display: flex;
                flex-direction: column;
                align-items: center;
            }

            .toast {
                background: #333;
                color: white;
                padding: 12px 20px;
                border-radius: 4px;
                margin-bottom: 10px;
                opacity: 0;
                transform: translateY(-100px);
                transition: all 0.3s ease;
                pointer-events: auto;
                font-family: 'Open Sans', sans-serif;
                font-size: 14px;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                max-width: 300px;
                word-wrap: break-word;
            }

            .toast.show {
                opacity: 1;
                transform: translateY(20px);
            }

            .toast.success {
                background: #4CAF50;
            }

            .toast.error {
                background: #f44336;
            }

            .toast.warning {
                background: #ff9800;
            }

            .toast.info {
                background: #2196F3;
            }
        `;
        document.head.appendChild(style);
    }

    /**
     * 显示Toast通知
     * @param message 消息内容
     * @param type 消息类型：'success' | 'error' | 'warning' | 'info'
     * @param duration 显示时长（毫秒），默认3000ms
     */
    public static show(message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info', duration: number = 3000) {
        this.init();
        
        if (!this.container) return;

        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;

        this.container.appendChild(toast);

        // 显示动画
        setTimeout(() => {
            toast.classList.add('show');
        }, 100);

        // 自动隐藏
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                if (this.container && this.container.contains(toast)) {
                    this.container.removeChild(toast);
                }
            }, 300);
        }, duration);
    }

    /**
     * 显示成功消息
     */
    public static success(message: string, duration?: number) {
        this.show(message, 'success', duration);
    }

    /**
     * 显示错误消息
     */
    public static error(message: string, duration?: number) {
        this.show(message, 'error', duration);
    }

    /**
     * 显示警告消息
     */
    public static warning(message: string, duration?: number) {
        this.show(message, 'warning', duration);
    }

    /**
     * 显示信息消息
     */
    public static info(message: string, duration?: number) {
        this.show(message, 'info', duration);
    }

    /**
     * 清除所有Toast
     */
    public static clear() {
        if (this.container) {
            this.container.innerHTML = '';
        }
    }

    /**
     * 销毁Toast组件
     */
    public static destroy() {
        if (this.container && this.container.parentNode) {
            this.container.parentNode.removeChild(this.container);
        }
        this.container = null;
        this.initialized = false;
        
        // 移除样式
        const style = document.getElementById('toast-styles');
        if (style && style.parentNode) {
            style.parentNode.removeChild(style);
        }
    }
}