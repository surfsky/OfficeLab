/**
 * 数据表格对话框组件
 * 用于显示详细数据清单
 */

import { ElDialog, ElTable, ElTableColumn, ElButton, ElPagination, ElIcon } from 'element-plus';
import { createApp, h, ref, computed } from 'vue';
import { FullScreen, CopyDocument } from '@element-plus/icons-vue';

// 表格列定义接口
export interface TableColumn {
    prop: string;
    label: string;
    width?: number;
    formatter?: (value: any) => string;
}

// 对话框选项接口
export interface DataTableDialogOptions {
    title: string;
    data: any[];
    columns?: TableColumn[];
    width?: string;
    height?: string;
    showIndex?: boolean; // 是否显示自动编号列
}

/**
 * 显示数据表格对话框
 * @param options 对话框选项
 */
export function showDataTableDialog(options: DataTableDialogOptions): void {
    const { title, data, width = '80%', height = '600px', showIndex = true } = options;
    
    // 如果没有传递columns，则自动生成
    let columns = options.columns;
    if (!columns && data.length > 0) {
        columns = generateColumnsFromData(data[0]);
    }
    
    // 如果需要显示编号列，则添加到列配置的开头
    const finalColumns = showIndex ? [
        { prop: '_index', label: '序号', width: 80 },
        ...(columns || [])
    ] : (columns || []);
    
    // 为数据添加序号
    const tableData = showIndex ? data.map((item, index) => ({
        _index: index + 1,
        ...item
    })) : data;
    
    // 创建对话框容器
    const container = document.createElement('div');
    document.body.appendChild(container);
    
    // 创建Vue应用
    const app = createApp({
        setup() {
            const visible = ref(true);
            const currentPage = ref(1);
            const pageSize = ref(20);
            const sortProp = ref('');
            const sortOrder = ref('');
            const isMaximized = ref(false);
            
            // 排序后的数据
            const sortedData = computed(() => {
                if (!sortProp.value) return tableData;
                
                const sorted = [...tableData].sort((a, b) => {
                    const aVal = a[sortProp.value];
                    const bVal = b[sortProp.value];
                    
                    if (typeof aVal === 'number' && typeof bVal === 'number') {
                        return sortOrder.value === 'ascending' ? aVal - bVal : bVal - aVal;
                    }
                    
                    const aStr = String(aVal || '').toLowerCase();
                    const bStr = String(bVal || '').toLowerCase();
                    
                    if (sortOrder.value === 'ascending') {
                        return aStr.localeCompare(bStr);
                    } else {
                        return bStr.localeCompare(aStr);
                    }
                });
                
                return sorted;
            });
            
            // 分页后的数据
            const paginatedData = computed(() => {
                const start = (currentPage.value - 1) * pageSize.value;
                const end = start + pageSize.value;
                return sortedData.value.slice(start, end);
            });
            
            const handleClose = () => {
                visible.value = false;
                setTimeout(() => {
                    app.unmount();
                    document.body.removeChild(container);
                }, 300);
            };
            
            const handleSortChange = ({ prop, order }: { prop: string; order: string }) => {
                sortProp.value = prop;
                sortOrder.value = order;
                currentPage.value = 1; // 排序后回到第一页
            };
            
            const handlePageChange = (page: number) => {
                currentPage.value = page;
            };
            
            const handleSizeChange = (size: number) => {
                pageSize.value = size;
                currentPage.value = 1;
            };
            
            const toggleMaximize = () => {
                isMaximized.value = !isMaximized.value;
            };
            
            return {
                visible,
                currentPage,
                pageSize,
                paginatedData,
                sortedData,
                isMaximized,
                handleClose,
                handleSortChange,
                handlePageChange,
                handleSizeChange,
                toggleMaximize
            };
        },
        
        render() {
            const dialogWidth = this.isMaximized ? '98vw' : width;
            const dialogHeight = this.isMaximized ? '95vh' : '700px';
            
            return h(ElDialog, {
                modelValue: this.visible,
                title: title,
                width: dialogWidth,
                draggable: !this.isMaximized,
                fullscreen: this.isMaximized,
                'onUpdate:modelValue': (val: boolean) => {
                    if (!val) this.handleClose();
                },
                onClose: this.handleClose
            }, {
                header: () => h('div', { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' } }, [
                    h('span', { style: { flex: 1 } }, title),
                    h('div', { style: { display: 'flex', alignItems: 'center', gap: '0px' } }, [
                        h(ElButton, {
                            type: 'text',
                            icon: this.isMaximized ? CopyDocument : FullScreen,
                            onClick: this.toggleMaximize,
                            style: { padding: '0px', fontSize: '16px' },
                            title: this.isMaximized ? '恢复' : '最大化'
                        })
                    ])
                ]),
                default: () => [
                    h('div', { style: { height: this.isMaximized ? 'calc(100vh - 120px)' : 'calc(700px - 80px)', display: 'flex', flexDirection: 'column' } }, [
                        h('div', { style: { flex: '1', overflow: 'hidden', minHeight: '0' } }, [
                            h(ElTable, {
                                data: this.paginatedData,
                                border: true,
                                stripe: true,
                                style: { width: '100%', height: '100%' },
                                height: this.isMaximized ? 'calc(100vh - 180px)' : 'calc(700px - 140px)',
                                onSortChange: this.handleSortChange,
                                rowStyle: { height: '40px' },
                                cellStyle: { 
                                    padding: '8px',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap'
                                }
                            }, {
                                default: () => finalColumns.map((col: TableColumn) => 
                                    h(ElTableColumn, {
                                        prop: col.prop,
                                        label: col.label,
                                        width: col.width,
                                        formatter: col.formatter,
                                        sortable: col.prop !== '_index' ? 'custom' : false,
                                        showOverflowTooltip: true
                                    })
                                )
                            })
                        ]),
                        h('div', { style: { padding: '12px 16px', textAlign: 'center', borderTop: '1px solid #ebeef5', backgroundColor: '#fafafa', flexShrink: 0 } }, [
                            h(ElPagination, {
                                currentPage: this.currentPage,
                                pageSize: this.pageSize,
                                pageSizes: [10, 20, 50, 100],
                                total: this.sortedData.length,
                                layout: 'total, sizes, prev, pager, next, jumper',
                                onCurrentChange: this.handlePageChange,
                                onSizeChange: this.handleSizeChange,
                                small: true
                            })
                        ])
                    ])
                ]
            });
        }
    });
    
    // 挂载应用
    app.mount(container);
}

/**
 * 从数据对象自动生成列配置
 * @param dataItem 数据对象示例
 * @returns 列配置数组
 */
function generateColumnsFromData(dataItem: any): TableColumn[] {
    const columns: TableColumn[] = [];
    
    for (const key in dataItem) {
        // key 是否英文字母开头
        var reg = /^[a-zA-Z]/;
        if (reg.test(key)) continue;

        if (dataItem.hasOwnProperty(key) && key !== '_index') {
            columns.push({
                prop: key,
                label: key,
                width: 120,
            });
        }
    }
    
    return columns;
}

/**
 * 创建表格列配置的辅助函数
 * @param columns 列配置数组
 * @returns 标准化的列配置
 */
export function createTableColumns(columns: (string | TableColumn)[]): TableColumn[] {
    return columns.map(col => {
        if (typeof col === 'string') {
            return {
                prop: col,
                label: col
            };
        }
        return col;
    });
}