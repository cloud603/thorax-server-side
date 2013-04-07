##部署

1. 从git上clone整个项目，后续的操作可能需要sudo提权
2. cd到thorax-server-side，npm install
3. cd到examples，npm install && bower install
4. cd到components/thorax，npm install && jake
5. 退回到examples目录，node-dev server.js
6. 浏览器端测试可以直接打开examples/index.html

## 模块化开发

创建新的模块，需要在collections, models, templates, views下分别创建同名模块，根据requireJS的规则，用define定义模块，请参考todos模块。