export class WebHelper{

    /** 下载文件 */
    static downFile(data: Blob, filename: string) {
        const url = URL.createObjectURL(data);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    /** 派发自定义事件 */
    static sendEvent(name: string, data?: any){
        const event = new CustomEvent(name, { detail: data });
        document.dispatchEvent(event);
    }

    /**获取导出文件名*/
    static getExportFileName(file: string) {
        var dt = new Date();
        var daytag = `${dt.getFullYear().toString().slice(2)}${(dt.getMonth() + 1).toString().padStart(2, '0')}${dt.getDate().toString().padStart(2, '0')}`;
        const fileName = `${daytag}-${file}`;
        return fileName;
    }

    /**转义HTML特殊字符*/
    static escapeHtml(text: string): string {
        return text
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }
}