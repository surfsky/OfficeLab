/**
 * 比对工具类
 */
export class ComparerTool {
    private dataA: any[] = [];
    private dataB: any[] = [];

    /**设置A表数据*/
    setDataA(data: any[]) {
        this.dataA = data;
    }

    /**设置B表数据*/
    setDataB(data: any[]) {
        this.dataB = data;
    }

    /**获取A表预览数据*/
    getPreviewA() {
        return this.dataA.slice(0, 10);
    }

    /**获取B表预览数据*/
    getPreviewB() {
        return this.dataB.slice(0, 10);
    }

    /**
     * 比对数据（以A表为准）
     * @param keyA A表的关键字列
     * @param keyB B表的关键字列
     * @returns 比对结果
     */
    compareByA(keyA: string, keyB: string): any[] {
        if (!this.dataA.length || !this.dataB.length) {
            throw new Error('数据未准备就绪');
        }

        const keyASet = new Set(this.dataA.map(item => item[keyA]));

        // 初始化结果数组，默认A表数据为已存在
        const result = [...this.dataA.map(item => ({ ...item, '对比结果': '已存在' }))];

        // 如果A中存在B中不存在的数据， 则标记为删除
        for (const itemA of this.dataA) {
            if (!this.dataB.some(itemB => itemB[keyB] === itemA[keyA])) {
                const index = result.findIndex(item => item[keyA] === itemA[keyA]);
                if (index !== -1) {
                    result[index]['对比结果'] = '删除';
                }
            }
        }

        // 如果B中存在A中不存在的数据， 则标记为新增
        for (const itemB of this.dataB) {
            if (!keyASet.has(itemB[keyB])) {
                result.push({ ...itemB, '对比结果': '新增' });
            }
        }

        return result;
    }


    /**
     * 比对数据（以B表为准）
     * @param keyA A表的关键字列
     * @param keyB B表的关键字列
     * @returns 比对结果
     */
    compareByB(keyA: string, keyB: string): any[] {
        if (!this.dataA.length || !this.dataB.length) {
            throw new Error('数据未准备就绪');
        }

        const keyASet = new Set(this.dataA.map(item => item[keyA]));

        // 初始化结果数组
        const result = [];
        for (const itemB of this.dataB) {
            if (keyASet.has(itemB[keyB])) {
                // 如果B中存在A中存在的数据， 则标记为“更新”
                result.push({ ...itemB, '对比结果': '更新' });
            }
            else{
                // 如果B中存在A中不存在的数据， 则标记为新增
                result.push({ ...itemB, '对比结果': '新增' });
            }
        }

        // 如果A中存在B中不存在的数据， 则标记为删除
        for (const itemA of this.dataA) {
            if (!this.dataB.some(itemB => itemB[keyB] === itemA[keyA])) {
                result.push({ ...itemA, '对比结果': '删除' });
            }
        }

        return result;
    }
}