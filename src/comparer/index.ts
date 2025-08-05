import { createApp } from 'vue';
import ElementPlus, { ElMessage } from 'element-plus';
import 'element-plus/dist/index.css';
import { ComparerTool } from './ComparerTool';
import { ExcelTool } from '../utils/ExcelTool';
import { WebHelper } from '../utils/WebHelper';



const app = createApp({
    data() {
        return {
            comparerTool: new ComparerTool(),
            fileA: null as File | null,
            fileB: null as File | null,
            sheetsA: [] as string[],
            sheetsB: [] as string[],
            sheetA: '',
            sheetB: '',
            columnsA: [] as string[],
            columnsB: [] as string[],
            keyColumnA: '',
            keyColumnB: '',
            previewDataA: [] as any[],
            previewDataB: [] as any[],
            previewColumnsA: [] as any[],
            previewColumnsB: [] as any[],
            compareResult: [] as any[],
            resultColumns: [] as any[],
            isComparing: false,
            currentPage: 1,
            pageSize: 10,
        };
    },
    methods: {
        resetFileA(this: any) {
            this.fileA = null;
            this.sheetsA = [];
            this.sheetA = '';
            this.columnsA = [];
            this.keyColumnA = '';
            this.comparerTool.setDataA([]);
            this.resetPreviewAndResult();
        },
        resetFileB(this: any) {
            this.fileB = null;
            this.sheetsB = [];
            this.sheetB = '';
            this.columnsB = [];
            this.keyColumnB = '';
            this.comparerTool.setDataB([]);
            this.resetPreviewAndResult();
        },
        resetPreviewAndResult(this: any) {
            this.previewDataA = [];
            this.previewDataB = [];
            this.previewColumnsA = [];
            this.previewColumnsB = [];
            this.compareResult = [];
            this.resultColumns = [];
        },
        async handleFileAChange(this: any, file: any) {
            this.resetFileA();
            this.fileA = file.raw;
            if (!this.fileA) return;
            this.sheetsA = await ExcelTool.getSheetNames(this.fileA);
            if (this.sheetsA.length > 0) {
                this.sheetA = this.sheetsA[0];
                await this.onSheetAChange(this.sheetA);
            }
        },
        async handleFileBChange(this: any, file: any) {
            this.resetFileB();
            this.fileB = file.raw;
            if (!this.fileB) return;
            this.sheetsB = await ExcelTool.getSheetNames(this.fileB);
            if (this.sheetsB.length > 0) {
                this.sheetB = this.sheetsB[0];
                await this.onSheetBChange(this.sheetB);
            }
        },
        async onSheetAChange(this: any, sheetName: string) {
            if (!this.fileA) return;
            this.columnsA = [];
            this.keyColumnA = '';
            this.resetPreviewAndResult();
            const data = await ExcelTool.readExcelFile(this.fileA, sheetName);
            if (data.length > 0) {
                this.columnsA = Object.keys(data[0]);
                this.keyColumnA = this.columnsA[0];
                this.comparerTool.setDataA(data);
            } else {
                this.comparerTool.setDataA([]);
            }
        },
        async onSheetBChange(this: any, sheetName: string) {
            if (!this.fileB) return;
            this.columnsB = [];
            this.keyColumnB = '';
            this.resetPreviewAndResult();
            const data = await ExcelTool.readExcelFile(this.fileB, sheetName);
            if (data.length > 0) {
                this.columnsB = Object.keys(data[0]);
                this.keyColumnB = this.columnsB[0];
                this.comparerTool.setDataB(data);
            } else {
                this.comparerTool.setDataB([]);
            }
        },
        previewData(this: any){
            this.previewDataA = this.comparerTool.getPreviewA();
            this.previewDataB = this.comparerTool.getPreviewB();
            this.previewColumnsA = this.previewDataA.length > 0 ? Object.keys(this.previewDataA[0]).map(key => ({ prop: key, label: key })) : [];
            this.previewColumnsB = this.previewDataB.length > 0 ? Object.keys(this.previewDataB[0]).map(key => ({ prop: key, label: key })) : [];
        },
        compareData(this: any) {
            this.isComparing = true;
            setTimeout(() => {
                try {
                    const result = this.comparerTool.compareByB(this.keyColumnA, this.keyColumnB);
                    this.compareResult = result;
                    if (result.length > 0) {
                        this.resultColumns = Object.keys(result[0]).map(key => ({ prop: key, label: key }));
                    }
                    ElMessage.success('比对完成');
                } catch (error: any) {
                    ElMessage.error(`比对失败: ${error.message}`);
                }
                finally{
                    this.isComparing = false;
                }
            }, 0);
        },
        exportResult(this: any){
            if(this.compareResult.length === 0) {
                ElMessage.warning('没有可导出的结果');
                return;
            }
            // 修改导出文本格式如：250805-比对结果.xlsx
            const fileName = WebHelper.getExportFileName('比对结果.xlsx');            
            ExcelTool.exportExcel(this.compareResult, fileName, true);
        },
        handleSizeChange(this: any, val: number) {
            this.pageSize = val;
            this.currentPage = 1;
        },
        handleCurrentChange(this: any, val: number) {
            this.currentPage = val;
        },
        handleSortChange(this: any, { column, prop, order }: any) {
            if (order) {
                this.compareResult.sort((a: any, b: any) => {
                    const valA = a[prop];
                    const valB = b[prop];
                    if (order === 'ascending') {
                        if (valA > valB) return 1;
                        if (valA < valB) return -1;
                        return 0;
                    } else {
                        if (valA < valB) return 1;
                        if (valA > valB) return -1;
                        return 0;
                    }
                });
            } else {
                // Restore original order if needed, or do nothing
            }
        }
    },
    computed: {
        paginatedResult(this: any) {
            const start = (this.currentPage - 1) * this.pageSize;
            const end = start + this.pageSize;
            return this.compareResult.slice(start, end);
        }
    }
});

app.use(ElementPlus);
app.mount('#app');

