创建一个网页版的离线 excel 文件查重工具， 用typescript 、ElementPlus 开发

- 创建在/src/dictinct/ 目录下
- 选择一个 excel 文件
- 选择sheet和列（多选），可预览前10条数据。
- 找到数据唯一的数据，逻辑类似：select distinct 列1,列2,... from sheet1;
- 将唯一值数据列保存、下载为 excel 文件。


tip:
- 相关组件可用  /src/controls/ 和 /src/utils/
- 界面风格及表格控件配置可参考 /src/comparer/ 下的代码
- 可将网页设置为 PWA 应用。
- 支持手机端布局
