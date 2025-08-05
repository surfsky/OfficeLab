import { Map } from 'mapbox-gl';

export interface PanelOptions {
    title?: string;
    position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center' | 'top' | 'bottom' | 'left' | 'right';
    animationType?: 'slide' | 'fade' | 'scale';
    animationDirection?: 'left' | 'right' | 'top' | 'bottom';
    showCloseButton?: boolean;
    showToolbar?: boolean;
    borderRadius?: string;
    draggable?: boolean;
    zIndex?: number;
    width?: string;
    height?: string;
    margin?: string;
}

export class Panel {
    protected parent: HTMLElement;
    protected container!: HTMLElement;
    protected content!: HTMLElement;
    protected toolbar?: HTMLElement;
    protected closeBtn?: HTMLElement;
    protected options: Required<PanelOptions>;
    protected isVisible: boolean = false;
    protected isDragging: boolean = false;
    protected dragOffset: { x: number; y: number } = { x: 0, y: 0 };

    constructor(parent: HTMLElement, options: PanelOptions = {}) {
        this.parent = parent;
        this.options = {
            title: 'Panel',
            position: 'top-right',
            animationType: 'slide',
            animationDirection: 'right',
            showCloseButton: true,
            showToolbar: false,
            borderRadius: '8px',
            draggable: false,
            zIndex: 1000,
            width: '300px',
            height: 'auto',
            margin: '10px',
            ...options
        };
        
        this.initContainer();
        this.initContent();
        this.initCloseButton();
        this.initDraggable();
        this.setPosition();
        this.setStyles();
    }

    //------------------------------------------------------
    // Initialization
    //------------------------------------------------------

    /**Initialize container */
    private initContainer(): void {
        this.container = document.createElement('div');
        this.container.className = 'panel-container';
        
        // 创建标题栏
        const header = document.createElement('div');
        header.className = 'panel-header';
        header.style.cssText = `
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 12px 16px;
            background: #f8f9fa;
            border-bottom: 1px solid #e9ecef;
            border-radius: ${this.options.borderRadius} ${this.options.borderRadius} 0 0;
            cursor: ${this.options.draggable ? 'move' : 'default'};
            user-select: none;
        `;
        
        const title = document.createElement('span');
        title.textContent = this.options.title;
        title.style.cssText = `
            font-weight: 600;
            color: #495057;
            font-size: 14px;
        `;
        header.appendChild(title);
        
        this.container.appendChild(header);
        
        // 创建工具栏（如果需要）
        if (this.options.showToolbar) {
            this.toolbar = document.createElement('div');
            this.toolbar.className = 'panel-toolbar';
            this.toolbar.style.cssText = `
                display: flex;
                align-items: center;
                gap: 8px;
                padding: 8px 16px;
                background: #ffffff;
                border-bottom: 1px solid #e9ecef;
                min-height: 40px;
            `;
            this.container.appendChild(this.toolbar);
        }
        
        this.parent.appendChild(this.container);
    }

    /**Initialize content area */
    private initContent(): void {
        this.content = document.createElement('div');
        this.content.className = 'panel-content';
        this.container.appendChild(this.content);
    }

    /**Initialize close button */
    private initCloseButton(): void {
        if (!this.options.showCloseButton) return;
        
        this.closeBtn = document.createElement('button');
        this.closeBtn.className = 'panel-close-btn';
        this.closeBtn.innerHTML = '×';
        this.closeBtn.style.cssText = `
            position: absolute;
            top: 8px;
            right: 8px;
            width: 24px;
            height: 24px;
            border: none;
            background: rgba(0, 0, 0, 0.1);
            border-radius: 50%;
            cursor: pointer;
            font-size: 16px;
            line-height: 1;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: background-color 0.2s;
        `;
        
        this.closeBtn.addEventListener('click', () => this.hide());
        this.closeBtn.addEventListener('mouseenter', () => {
            this.closeBtn!.style.background = 'rgba(0, 0, 0, 0.2)';
        });
        this.closeBtn.addEventListener('mouseleave', () => {
            this.closeBtn!.style.background = 'rgba(0, 0, 0, 0.1)';
        });
        
        this.container.appendChild(this.closeBtn);
    }

    /**Initialize draggable functionality */
    private initDraggable(): void {
        if (!this.options.draggable) return;
        
        this.container.style.cursor = 'move';
        
        this.container.addEventListener('mousedown', (e) => {
            if (e.target === this.closeBtn) return;
            this.startDrag(e);
        });
        
        document.addEventListener('mousemove', (e) => {
            if (this.isDragging) this.drag(e);
        });
        
        document.addEventListener('mouseup', () => {
            this.stopDrag();
        });
    }

    //------------------------------------------------------
    // Positioning and Styling
    //------------------------------------------------------

    /**Set panel position */
    private setPosition(): void {
        const margin = this.options.margin;
        
        // 停驻模式：面板停靠在窗体边缘
        if (this.options.position === 'right') {
            // 右侧停驻：高度为窗体高度减去上下边距，考虑工具栏高度
            const toolbarHeight = this.options.showToolbar ? '40px' : '0px';
            Object.assign(this.container.style, {
                top: margin,
                right: margin,
                height: `calc(100vh - ${margin} - ${margin})`,
                maxHeight: `calc(100vh - ${margin} - ${margin})`,
                transform: 'none'
            });
            return;
        }
        
        if (this.options.position === 'left') {
            // 左侧停驻：高度为窗体高度减去上下边距
            Object.assign(this.container.style, {
                top: margin,
                left: margin,
                height: `calc(100vh - ${margin} - ${margin})`,
                transform: 'none'
            });
            return;
        }
        
        if (this.options.position === 'top') {
            // 顶部停驻：宽度为窗体宽度减去左右边距
            Object.assign(this.container.style, {
                top: margin,
                left: margin,
                width: `calc(100vw - ${margin} - ${margin})`,
                transform: 'none'
            });
            return;
        }
        
        if (this.options.position === 'bottom') {
            // 底部停驻：宽度为窗体宽度减去左右边距
            Object.assign(this.container.style, {
                bottom: margin,
                left: margin,
                width: `calc(100vw - ${margin} - ${margin})`,
                transform: 'none'
            });
            return;
        }
        
        // 非停驻模式：使用原有的定位逻辑
        const positions = {
            'top-left': { top: margin, left: margin },
            'top-right': { top: margin, right: margin },
            'bottom-left': { bottom: margin, left: margin },
            'bottom-right': { bottom: margin, right: margin },
            'center': { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }
        };
        
        const pos = positions[this.options.position];
        if (pos) {
            Object.assign(this.container.style, pos);
        }
    }

    /**Set panel styles */
    private setStyles(): void {
        this.container.style.cssText += `
            position: absolute;
            background: white;
            border-radius: ${this.options.borderRadius};
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
            z-index: ${this.options.zIndex};
            width: ${this.options.width};
            height: ${this.options.height};
            display: none;
            transition: all 0.3s ease;
            overflow: hidden;
        `;
        
        this.content.style.cssText = `
            padding: ${this.options.showCloseButton ? '40px 20px 20px' : '20px'};
            height: 100%;
            box-sizing: border-box;
            overflow-y: auto;
            overflow-x: hidden;
        `;
    }

    //------------------------------------------------------
    // Animation
    //------------------------------------------------------

    /**Get animation transform */
    private getAnimationTransform(show: boolean): string {
        if (this.options.animationType === 'fade') {
            return show ? 'scale(1)' : 'scale(0.9)';
        }
        
        if (this.options.animationType === 'scale') {
            return show ? 'scale(1)' : 'scale(0)';
        }
        
        // slide animation
        const direction = this.options.animationDirection;
        const distance = '100%';
        
        if (!show) {
            switch (direction) {
                case 'left': return `translateX(-${distance})`;
                case 'right': return `translateX(${distance})`;
                case 'top': return `translateY(-${distance})`;
                case 'bottom': return `translateY(${distance})`;
            }
        }
        
        return 'translate(0, 0)';
    }

    /**Apply animation */
    private animate(show: boolean): void {
        const transform = this.getAnimationTransform(show);
        const opacity = show ? '1' : '0';
        
        this.container.style.transform = transform;
        this.container.style.opacity = opacity;
    }

    //------------------------------------------------------
    // Drag functionality
    //------------------------------------------------------

    /**Start dragging */
    private startDrag(e: MouseEvent): void {
        this.isDragging = true;
        const rect = this.container.getBoundingClientRect();
        this.dragOffset = {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
        this.container.style.transition = 'none';
    }

    /**Handle drag */
    private drag(e: MouseEvent): void {
        const x = e.clientX - this.dragOffset.x;
        const y = e.clientY - this.dragOffset.y;
        
        this.container.style.left = `${x}px`;
        this.container.style.top = `${y}px`;
        this.container.style.right = 'auto';
        this.container.style.bottom = 'auto';
    }

    /**Stop dragging */
    private stopDrag(): void {
        this.isDragging = false;
        this.container.style.transition = 'all 0.3s ease';
    }

    //------------------------------------------------------
    // Public methods
    //------------------------------------------------------

    /**Show panel */
    show(): void {
        if (this.isVisible) return;
        
        this.isVisible = true;
        this.container.style.display = 'block';
        
        // Force reflow
        this.container.offsetHeight;
        
        this.animate(true);
    }

    /**Hide panel */
    hide(): void {
        if (!this.isVisible) return;
        
        this.isVisible = false;
        this.animate(false);
        
        setTimeout(() => {
            if (!this.isVisible) {
                this.container.style.display = 'none';
            }
        }, 300);
    }

    /**Toggle panel visibility */
    toggle(): void {
        this.isVisible ? this.hide() : this.show();
    }

    /**Set panel content */
    setContent(content: string | HTMLElement): void {
        if (typeof content === 'string') {
            this.content.innerHTML = content;
        } else {
            this.content.innerHTML = '';
            this.content.appendChild(content);
        }
    }

    /**Get content container */
    getContent(): HTMLElement {
        return this.content;
    }

    /**Get toolbar container */
    getToolbar(): HTMLElement | undefined {
        return this.toolbar;
    }

    /**Destroy panel */
    destroy(): void {
        if (this.container.parentNode) {
            this.container.parentNode.removeChild(this.container);
        }
    }

    /**Check if panel is visible */
    get visible(): boolean {
        return this.isVisible;
    }
}