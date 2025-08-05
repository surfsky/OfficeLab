创建一个网页版的离线 excel 文件比对工具， 用typescript 、ElementPlus 开发

- 创建在/src/comparer/ 目录下
- 选择两个 excel 文件：A 文件和 B 文件
- 选择要对比的sheet和关键字列，预览前10条数据。
- 对比两表格数据：先列出A表所有数据，再列出B表新增的行（该行的关键列值不存在于A表），并增加一列“对比结果”（更新、删除、新增）。
- 将对比结果保存下载到新为 excel 文件，

tip:
- 相关组件可用  /src/controls/ 和 /src/utils/
- 界面风格可参考 /src/stat/ 下的代码