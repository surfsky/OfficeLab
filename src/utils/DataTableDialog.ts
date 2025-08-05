/**
 * 通用数据表格对话框
 */
export interface TableColumn {
    prop: string;
    label: string;
    width?: number;
    formatter?: (value: any) => string;
}

export interface DataTableDialogOptions {
    title: string;
    data: any[];
    columns: TableColumn[];
    width?: string;
    height?: string;
}

/**显示数据表格对话框 */
export function showDataTableDialog(options: DataTableDialogOptions): void {
    const { title, data, columns, width = '80%', height = '600px' } = options;
    
    // 创建对话框HTML
    const dialogHtml = `
        <div class="data-table-dialog-overlay" style="
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            z-index: 9999;
            display: flex;
            align-items: center;
            justify-content: center;
        ">
            <div class="data-table-dialog" style="
                background: white;
                border-radius: 8px;
                width: ${width};
                height: ${height};
                max-width: 95vw;
                max-height: 95vh;
                display: flex;
                flex-direction: column;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            ">
                <div class="dialog-header" style="
                    padding: 20px;
                    border-bottom: 1px solid #ebeef5;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                ">
                    <h3 style="margin: 0; color: #303133;">${title}</h3>
                    <button class="close-btn" style="
                        background: none;
                        border: none;
                        font-size: 20px;
                        cursor: pointer;
                        color: #909399;
                        padding: 0;
                        width: 24px;
                        height: 24px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                    ">×</button>
                </div>
                <div class="dialog-body" style="
                    flex: 1;
                    padding: 20px;
                    overflow: hidden;
                ">
                    <div id="data-table-container" style="height: 100%; overflow: auto;"></div>
                </div>
            </div>
        </div>
    `;
    
    // 添加到页面
    const dialogElement = document.createElement('div');
    dialogElement.innerHTML = dialogHtml;
    document.body.appendChild(dialogElement);
    
    // 创建表格
    const tableContainer = dialogElement.querySelector('#data-table-container');
    if (tableContainer) {
        createTable(tableContainer as HTMLElement, data, columns);
    }
    
    // 绑定关闭事件
    const closeBtn = dialogElement.querySelector('.close-btn');
    const overlay = dialogElement.querySelector('.data-table-dialog-overlay');
    
    const closeDialog = () => {
        document.body.removeChild(dialogElement);
    };
    
    closeBtn?.addEventListener('click', closeDialog);
    overlay?.addEventListener('click', (e) => {
        if (e.target === overlay) {
            closeDialog();
        }
    });
    
    // ESC键关闭
    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
            closeDialog();
            document.removeEventListener('keydown', handleKeyDown);
        }
    };
    document.addEventListener('keydown', handleKeyDown);
}

/**创建表格 */
function createTable(container: HTMLElement, data: any[], columns: TableColumn[]): void {
    if (data.length === 0) {
        container.innerHTML = '<div style="text-align: center; color: #909399; padding: 40px;">暂无数据</div>';
        return;
    }
    
    // 创建表格HTML
    let tableHtml = `
        <table style="
            width: 100%;
            border-collapse: collapse;
            border: 1px solid #ebeef5;
            font-size: 14px;
        ">
            <thead>
                <tr style="background: #f5f7fa;">
    `;
    
    // 表头
    columns.forEach(col => {
        const width = col.width ? `width: ${col.width}px;` : '';
        tableHtml += `
            <th style="
                padding: 12px;
                text-align: left;
                border-bottom: 1px solid #ebeef5;
                border-right: 1px solid #ebeef5;
                font-weight: 500;
                color: #303133;
                ${width}
            ">${col.label}</th>
        `;
    });
    
    tableHtml += `
                </tr>
            </thead>
            <tbody>
    `;
    
    // 表格数据
    data.forEach((row, index) => {
        const bgColor = index % 2 === 0 ? '#ffffff' : '#fafafa';
        tableHtml += `<tr style="background: ${bgColor};">`;
        
        columns.forEach(col => {
            let value = row[col.prop] || '';
            if (col.formatter) {
                value = col.formatter(value);
            }
            tableHtml += `
                <td style="
                    padding: 12px;
                    border-bottom: 1px solid #ebeef5;
                    border-right: 1px solid #ebeef5;
                    color: #606266;
                ">${value}</td>
            `;
        });
        
        tableHtml += '</tr>';
    });
    
    tableHtml += `
            </tbody>
        </table>
    `;
    
    container.innerHTML = tableHtml;
}