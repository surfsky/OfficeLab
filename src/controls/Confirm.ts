export class Confirm {
    private static currentModal: HTMLElement | null = null;
    private static resolveCallback: ((result: boolean) => void) | null = null;

    /**
     * 显示确认对话框
     * @param message 确认消息
     * @returns Promise<boolean> 用户选择结果
     */
    static show(message: string, title:string='确认操作', showCancel: boolean = true): Promise<boolean> {
        return new Promise((resolve) => {
            // 如果已有弹窗，先关闭
            if (this.currentModal) {
                this.close();
            }

            this.resolveCallback = resolve;
            this.currentModal = this.createModal(message, title, showCancel);
            document.body.appendChild(this.currentModal);
        });
    }

    /**
     * 创建确认对话框DOM元素
     */
    private static createModal(message: string, title:string='确认操作', showCancel: boolean = true): HTMLElement {
        const modal = document.createElement('div');
        modal.className = 'confirm-modal show';
        modal.innerHTML = `
            <div class="confirm-modal-content">
                <h3>${title}</h3>
                <p class="confirm-message">${message}</p>
                <div class="confirm-buttons">
                    <button class="confirm-btn secondary" data-action="cancel" style='display:${showCancel?"inline-block":"none"};'>取消</button>
                    <button class="confirm-btn primary" data-action="confirm">确定</button>
                </div>
            </div>
        `;

        // 添加样式
        this.injectStyles();
        this.bindEvents(modal);
        return modal;
    }

    /**
     * 绑定事件监听器
     */
    private static bindEvents(modal: HTMLElement) {
        // 点击按钮事件
        modal.addEventListener('click', (e) => {
            const target = e.target as HTMLElement;
            const action = target.getAttribute('data-action');
            if (action === 'confirm') {
                this.resolve(true);
            } else if (action === 'cancel') {
                this.resolve(false);
            }
        });

        // 点击背景关闭
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.resolve(false);
            }
        });

        // 键盘事件处理
        const handleKeydown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                this.resolve(false);
                document.removeEventListener('keydown', handleKeydown);
            } else if (e.key === 'Enter') {
                this.resolve(true);
                document.removeEventListener('keydown', handleKeydown);
            }
        };
        document.addEventListener('keydown', handleKeydown);
    }

    /**
     * 处理用户选择并关闭弹窗
     */
    private static resolve(result: boolean) {
        this.close();
        if (this.resolveCallback) {
            this.resolveCallback(result);
            this.resolveCallback = null;
        }
    }

    /**
     * 关闭确认对话框
     */
    private static close() {
        if (this.currentModal) {
            this.currentModal.remove();
            this.currentModal = null;
        }
    }

    /**
     * 注入样式
     */
    private static injectStyles() {
        const styleId = 'confirm-modal-styles';
        if (document.getElementById(styleId)) {
            return; // 样式已存在
        }

        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = `
            .confirm-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.5);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 20000;
                opacity: 0;
                visibility: hidden;
                transition: all 0.3s ease;
            }

            .confirm-modal.show {
                opacity: 1;
                visibility: visible;
            }

            .confirm-modal-content {
                background: white;
                border-radius: 8px;
                padding: 24px;
                min-width: 320px;
                max-width: 480px;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
                transform: scale(0.9);
                transition: transform 0.3s ease;
            }

            .confirm-modal.show .confirm-modal-content {
                transform: scale(1);
            }

            .confirm-modal h3 {
                margin: 0 0 16px 0;
                font-size: 18px;
                font-weight: 600;
                color: #333;
                text-align: center;
            }

            .confirm-message {
                margin: 20px 0;
                text-align: center;
                color: #666;
                line-height: 1.5;
            }

            .confirm-buttons {
                display: flex;
                gap: 12px;
                justify-content: center;
                margin-top: 24px;
            }

            .confirm-btn {
                padding: 10px 24px;
                border: none;
                border-radius: 6px;
                font-size: 14px;
                font-weight: 500;
                cursor: pointer;
                transition: all 0.2s ease;
                min-width: 80px;
            }

            .confirm-btn.primary {
                background: #007bff;
                color: white;
            }

            .confirm-btn.primary:hover {
                background: #0056b3;
            }

            .confirm-btn.secondary {
                background: #f8f9fa;
                color: #6c757d;
                border: 1px solid #dee2e6;
            }

            .confirm-btn.secondary:hover {
                background: #e9ecef;
                color: #495057;
            }

            .confirm-btn:active {
                transform: translateY(1px);
            }
        `;
        document.head.appendChild(style);
    }
}