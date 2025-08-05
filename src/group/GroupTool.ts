/**
 * 分组统计工具类
 */
export class GroupTool {
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
    calcGroupData(keys: string[]): any[] {
        if (!this.data.length) {
            throw new Error('数据未准备就绪');
        }
        if (!keys || keys.length === 0) {
            throw new Error('请选择要分组的列');
        }

        const resultData: any[] = [];
        const valueSet = new Set<string>();

        // 根据指定的列对 Excel 数据进行分组统计，快速获取分组后的统计结果。
        // 逻辑类似：select 列1,列2,count(*) from sheet1 group by 列1,列2
        for (const item of this.data) {
            const key = keys.map(k => item[k]).join('-');
            if (!valueSet.has(key)) {
                valueSet.add(key);

                // 把唯一值数据添加到distinctData数组中（只添加keys中指定的列）
                const distinctItem: any = {};
                keys.forEach(k => {
                    distinctItem[k] = item[k];
                });
                distinctItem['count'] = 1;
                resultData.push(distinctItem);
            } else {
                // 如果key已存在，说明有重复值，需要进行统计
                const existingItem = resultData.find(i => i[keys[0]] === item[keys[0]]);
                existingItem['count'] = (existingItem['count'] || 0) + 1;
            }
            
        }

        return resultData;
    }
}