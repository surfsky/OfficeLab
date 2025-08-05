// XLSX类型声明
export declare const XLSX: any;


/**
 * Excel工具类
 */
export class ExcelTool{

    /**读取Excel文件 */
    public static async readExcel(path: string) {
        const file = await fetch(path);
        const buffer = await file.arrayBuffer();
        const workbook = XLSX.read(buffer, { type: 'array' });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        var data = XLSX.utils.sheet_to_json(sheet);
        return data;
    }

    /**读取上传的 Excel文件 */
    public static async readExcelFile(file: File, sheetName?: string): Promise<any[]> {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const data = new Uint8Array(e.target?.result as ArrayBuffer);
                    const workbook = XLSX.read(data, { type: 'array' });
                    const finalSheetName = sheetName || workbook.SheetNames[0];
                    const worksheet = workbook.Sheets[finalSheetName];
                    const jsonData = XLSX.utils.sheet_to_json(worksheet);
                    resolve(jsonData);
                } catch (error) {
                    reject(error);
                }
            };
            reader.onerror = () => reject(new Error('文件读取失败'));
            reader.readAsArrayBuffer(file);
        });
    }

    /** 获取Excel的Sheet列表 */
    public static async getSheetNames(file: File): Promise<string[]> {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const data = new Uint8Array(e.target?.result as ArrayBuffer);
                    const workbook = XLSX.read(data, { type: 'array' });
                    resolve(workbook.SheetNames);
                } catch (error) {
                    reject(error);
                }
            };
            reader.onerror = () => reject(new Error('文件读取失败'));
            reader.readAsArrayBuffer(file);
        });
    }

    /** 导出Excel供下载 */
    public static exportExcel(data: any, fileName: string = 'export.xlsx', freezeHeader = false) {
        const worksheet = XLSX.utils.json_to_sheet(data);
        if (freezeHeader) {
            // 设置筛选（从A1到最后一列的第1行）
            const range = XLSX.utils.decode_range(worksheet['!ref']);
            const lastCol = XLSX.utils.encode_col(range.e.c);
            worksheet['!autofilter'] = { ref: `A1:${lastCol}1` };

            // 冻结首行
            worksheet['!freeze'] = { ySplit: 1 };
        }
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
        XLSX.writeFile(workbook, fileName);
    }

}