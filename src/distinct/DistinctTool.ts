/**
 * 查重工具类
 */
export class DistinctTool {
    private data: any[] = [];

    /**设置数据*/
    setData(data: any[]) {
        this.data = data;
    }

    /**获取预览数据*/
    getPreview() {
        return this.data.slice(0, 10);
    }

    /**
     * 查找唯一数据
     * @param keys 要进行查重的列名数组
     * @returns 唯一的数据
     */
    findDistinct(keys: string[]): any[] {
        if (!this.data.length) {
            throw new Error('数据未准备就绪');
        }

        if (!keys || keys.length === 0) {
            throw new Error('请选择要查重的列');
        }

        const distinctData: any[] = [];
        const valueSet = new Set<string>();

        for (const item of this.data) {
            const key = keys.map(k => item[k]).join('-');
            if (!valueSet.has(key)) {
                valueSet.add(key);

                // 把唯一值数据添加到distinctData数组中（只添加keys中指定的列）
                const distinctItem: any = {};
                keys.forEach(k => {
                    distinctItem[k] = item[k];
                });
                distinctData.push(distinctItem);
            }
        }

        return distinctData;
    }
}