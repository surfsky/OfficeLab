import { createApp } from 'vue';
import ElementPlus, { ElMessage } from 'element-plus';
import 'element-plus/dist/index.css';
import { DistinctTool } from './DistinctTool';
import { ExcelTool } from '../utils/ExcelTool';
import { WebHelper } from '../utils/WebHelper';

const app = createApp({
    data() {
        return {
            distinctTool: new DistinctTool(),
            file: null as File | null,
            sheets: [] as string[],
            sheet: '',
            columns: [] as string[],
            keyColumns: [] as string[],
            previewList: [] as any[],
            previewColumns: [] as any[],
            distinctData: [] as any[],
            resultColumns: [] as any[],
            isProcessing: false,
            currentPage: 1,
            pageSize: 10,
        };
    },
    methods: {
        resetFile(this: any) {
            this.file = null;
            this.sheets = [];
            this.sheet = '';
            this.columns = [];
            this.keyColumns = [];
            this.distinctTool.setData([]);
            this.resetPreviewAndResult();
        },
        resetPreviewAndResult(this: any) {
            this.previewList = [];
            this.previewColumns = [];
            this.distinctData = [];
            this.resultColumns = [];
        },
        async handleFileChange(this: any, file: any) {
            this.resetFile();
            this.file = file.raw;
            if (!this.file) return;
            this.sheets = await ExcelTool.getSheetNames(this.file);
            if (this.sheets.length > 0) {
                this.sheet = this.sheets[0];
                await this.onSheetChange(this.sheet);
            }
        },
        async onSheetChange(this: any, sheetName: string) {
            if (!this.file) return;
            this.columns = [];
            this.keyColumns = [];
            this.resetPreviewAndResult();
            const data = await ExcelTool.readExcelFile(this.file, sheetName);
            if (data.length > 0) {
                this.columns = Object.keys(data[0]);
                this.distinctTool.setData(data);
            } else {
                this.distinctTool.setData([]);
            }
        },
        previewData(this: any){
            if (!this.sheet) {
                ElMessage.warning('请先选择Sheet');
                return;
            }
            const data = this.distinctTool.getPreview();
            this.previewList = data;
            this.previewColumns = data.length > 0 ? Object.keys(data[0]).map(key => ({ prop: key, label: key })) : [];
        },
        findDistinctData(this: any) {
            this.isProcessing = true;
            setTimeout(() => {
                try {
                    const result = this.distinctTool.findDistinct(this.keyColumns);
                    this.distinctData = result;
                    if (result.length > 0) {
                        this.resultColumns = Object.keys(result[0]).map(key => ({ prop: key, label: key }));
                    }
                    ElMessage.success('查重完成');
                } catch (error: any) {
                    ElMessage.error(`查重失败: ${error.message}`);
                }
                finally{
                    this.isProcessing = false;
                }
            }, 0);
        },
        exportResult(this: any){
            if(this.distinctData.length === 0) {
                ElMessage.warning('没有可导出的结果');
                return;
            }
            const fileName = WebHelper.getExportFileName('查重结果.xlsx');            
            ExcelTool.exportExcel(this.distinctData, fileName, true);
        },
        handleSizeChange(this: any, val: number) {
            this.pageSize = val;
            this.currentPage = 1;
        },
        handleCurrentChange(this: any, val: number) {
            this.currentPage = val;
        },
    },
    computed: {
        paginatedResult(this: any) {
            const start = (this.currentPage - 1) * this.pageSize;
            const end = start + this.pageSize;
            return this.distinctData.slice(start, end);
        }
    }
});

app.use(ElementPlus);
app.mount('#app');