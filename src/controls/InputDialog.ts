export class InputDialog {
    private static currentModal: HTMLElement | null = null;
    private static resolveCallback: ((result: string | null) => void) | null = null;

    /**
     * 显示输入对话框
     * @param message 提示消息
     * @param title 对话框标题
     * @param placeholder 输入框占位符
     * @param defaultValue 默认值
     * @returns Promise<string | null> 用户输入的值，取消时返回null
     */
    static show(
        message: string, 
        title: string = '输入信息', 
        placeholder: string = '请输入...', 
        defaultValue: string = ''
    ): Promise<string | null> {
        return new Promise((resolve) => {
            // 如果已有弹窗，先关闭
            if (this.currentModal) {
                this.close();
            }

            this.resolveCallback = resolve;
            this.currentModal = this.createModal(message, title, placeholder, defaultValue);
            document.body.appendChild(this.currentModal);
            
            // 聚焦到输入框
            setTimeout(() => {
                const input = this.currentModal?.querySelector('input') as HTMLInputElement;
                if (input) {
                    input.focus();
                    input.select();
                }
            }, 100);
        });
    }

    /**
     * 创建输入对话框DOM元素
     */
    private static createModal(
        message: string, 
        title: string, 
        placeholder: string, 
        defaultValue: string
    ): HTMLElement {
        const modal = document.createElement('div');
        modal.className = 'input-modal show';
        modal.innerHTML = `
            <div class="input-modal-content">
                <h3>${title}</h3>
                <p class="input-message">${message}</p>
                <div class="input-container">
                    <input type="text" class="input-field" placeholder="${placeholder}" value="${defaultValue}">
                </div>
                <div class="input-buttons">
                    <button class="input-btn secondary" data-action="cancel">取消</button>
                    <button class="input-btn primary" data-action="confirm">确定</button>
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
        const input = modal.querySelector('input') as HTMLInputElement;
        
        // 点击按钮事件
        modal.addEventListener('click', (e) => {
            const target = e.target as HTMLElement;
            const action = target.getAttribute('data-action');
            if (action === 'confirm') {
                this.resolve(input.value.trim());
            } else if (action === 'cancel') {
                this.resolve(null);
            }
        });

        // 点击背景关闭
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.resolve(null);
            }
        });

        // 键盘事件处理
        const handleKeydown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                this.resolve(null);
                document.removeEventListener('keydown', handleKeydown);
            } else if (e.key === 'Enter') {
                e.preventDefault();
                this.resolve(input.value.trim());
                document.removeEventListener('keydown', handleKeydown);
            }
        };
        document.addEventListener('keydown', handleKeydown);

        // 输入框事件
        input.addEventListener('input', () => {
            const confirmBtn = modal.querySelector('[data-action="confirm"]') as HTMLButtonElement;
            if (confirmBtn) {
                confirmBtn.disabled = input.value.trim().length === 0;
            }
        });

        // 初始化确定按钮状态
        const confirmBtn = modal.querySelector('[data-action="confirm"]') as HTMLButtonElement;
        if (confirmBtn) {
            confirmBtn.disabled = input.value.trim().length === 0;
        }
    }

    /**
     * 处理用户输入并关闭弹窗
     */
    private static resolve(result: string | null) {
        if (this.resolveCallback) {
            this.resolveCallback(result);
            this.resolveCallback = null;
        }
        this.close();
    }

    /**
     * 关闭输入对话框
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
        const styleId = 'input-modal-styles';
        if (document.getElementById(styleId)) {
            return; // 样式已存在
        }

        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = `
            .input-modal {
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

            .input-modal.show {
                opacity: 1;
                visibility: visible;
            }

            .input-modal-content {
                background: white;
                border-radius: 8px;
                padding: 24px;
                min-width: 360px;
                max-width: 480px;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
                transform: scale(0.9);
                transition: transform 0.3s ease;
            }

            .input-modal.show .input-modal-content {
                transform: scale(1);
            }

            .input-modal h3 {
                margin: 0 0 16px 0;
                font-size: 18px;
                font-weight: 600;
                color: #333;
                text-align: center;
            }

            .input-message {
                margin: 0 0 20px 0;
                text-align: center;
                color: #666;
                line-height: 1.5;
            }

            .input-container {
                margin: 20px 0;
            }

            .input-field {
                width: 100%;
                padding: 12px 16px;
                border: 2px solid #e1e5e9;
                border-radius: 6px;
                font-size: 14px;
                transition: border-color 0.2s ease;
                box-sizing: border-box;
            }

            .input-field:focus {
                outline: none;
                border-color: #007bff;
                box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
            }

            .input-buttons {
                display: flex;
                gap: 12px;
                justify-content: center;
                margin-top: 24px;
            }

            .input-btn {
                padding: 10px 24px;
                border: none;
                border-radius: 6px;
                font-size: 14px;
                font-weight: 500;
                cursor: pointer;
                transition: all 0.2s ease;
                min-width: 80px;
            }

            .input-btn.primary {
                background: #007bff;
                color: white;
            }

            .input-btn.primary:hover:not(:disabled) {
                background: #0056b3;
            }

            .input-btn.primary:disabled {
                background: #6c757d;
                cursor: not-allowed;
                opacity: 0.6;
            }

            .input-btn.secondary {
                background: #f8f9fa;
                color: #6c757d;
                border: 1px solid #dee2e6;
            }

            .input-btn.secondary:hover {
                background: #e9ecef;
                color: #495057;
            }

            .input-btn:active:not(:disabled) {
                transform: translateY(1px);
            }
        `;
        document.head.appendChild(style);
    }
}