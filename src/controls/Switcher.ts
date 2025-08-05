/**
 * Switcher 控件
 */
export class Switcher {
    private element: HTMLElement;
    private isChecked: boolean;
    private onChange?: (checked: boolean) => void;

    constructor(checked: boolean = false, onChange?: (checked: boolean) => void) {
        this.isChecked = checked;
        this.onChange = onChange;
        this.element = this.createElement();
    }

    private createElement(): HTMLElement {
        const switchContainer = document.createElement('div');
        switchContainer.className = 'switch-container';
        
        const switchElement = document.createElement('div');
        switchElement.className = `switch ${this.isChecked ? 'checked' : ''}`;
        
        const slider = document.createElement('div');
        slider.className = 'switch-slider';
        
        switchElement.appendChild(slider);
        switchContainer.appendChild(switchElement);
        
        // 添加点击事件
        switchElement.addEventListener('click', () => {
            this.toggle();
        });
        
        return switchContainer;
    }

    public toggle(): void {
        this.isChecked = !this.isChecked;
        this.updateUI();
        if (this.onChange) {
            this.onChange(this.isChecked);
        }
    }

    public setChecked(checked: boolean): void {
        this.isChecked = checked;
        this.updateUI();
    }

    public getChecked(): boolean {
        return this.isChecked;
    }

    private updateUI(): void {
        const switchElement = this.element.querySelector('.switch');
        if (switchElement) {
            if (this.isChecked) {
                switchElement.classList.add('checked');
            } else {
                switchElement.classList.remove('checked');
            }
        }
    }

    public getElement(): HTMLElement {
        return this.element;
    }
}
