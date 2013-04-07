* 在/examples/app/component.json中加入thorax的项目依赖，只需要用最新的版本就可以了。代码：`"thorax": "*"`
* 初始化/examples/app的项目依赖，需要安装bower，然后用bower install安装
* 在app.js中加入对thorax的项目依赖
  1. 在path中加入thorax的项目依赖，代码：`thorax: 'components/thorax/thorax'`
  2. 加入shim中对Thorax的处理，代码：

  ```js
  'thorax': {
  				exports: 'Thorax',
  				deps: ['underscore', 'jquery', 'backbone'],
  				init: function(_, $, Backbone){
  					return this.Thorax;
  				}
  			},
  ```

* 尝试在thorax加入判断，如果在服务器端，则用require的方式引入backbone/undersocre/handlebars，代码：
```js
var isBrowser = typeof(window) !== 'undefined';
if(!isBrowser){
	if(!Backbone) var Backbone = require('backbone');
	if(!_) var _ = require('underscore');
	if(!Handlebars) var Handlebars = require('handlebars');
	if(!$) var $ = require("cheerio");
}
```

更改依赖，客户端与需要，requireJS是否可以从外围解决？
```js
//required some module on node.js
var isBrowser = typeof(window) !== 'undefined';
if(!Backbone) var Backbone = require('backbone');
if(!_) var _ = require('underscore');
if(!Handlebars) var Handlebars = require('handlebars');
if(!$){
  var $ = require(isBrowser ? 'jquery' : 'cheerio');
};
```
* 注释掉thorax下$.fn相关的代码，包括$.fn.each/$.fn.view/$.fn.collection（这部分应该要根据环境判断，目前暂时注释掉）
* 对$(document).ready部分的代码进行判断，如下：
```js
if(isBrowser){
	$(document).ready(function() {
		if (!Thorax._fastClickEventName) {
			registerClickHandler();
		}
	});
}
```

* 将view/*.html转移到templates/*.handlebars，参考thorax-seed-todos。更改views/*.js的加载依赖

* cheerio需要增加对off/on的支持，不需要实现，但需要加入空函数

* lib/backbone改为lib/thorax

* 将/examples下的模块依赖cheerio改为cloud603下的cheerio项目

* samples/view/*.js，基于ADM规范定义一个模块，返回实例化的Thorax.View

* 加入todos测试模块，分别在models/collections/views/template/css加入对应的模块

* cheerio中的node没有getAttribute方法，已经在cheerio项目中加上

* 服务器端出现**Cannot read property 'view6' of undefined**，Thorax中约1937行**Thorax.View.on('append'...** 处出错。发现this.children为undefined，继而发现与todoMVC相比，forEach中上下文不一至。定义context并将this.children改为context.children，问题解决，但出现新的问题**collection in View: todos requires an item template.**
  疑问：为什么与zepto的forEach中的context会不一致？

* thorax的两个小版本有差异，从bower上下载的版本为2.0.0b5，而从git上的clone的版本为2.0.0rc1，两个版都各有各的问题。以git上的最新版本为准。

＊git上的版本对IE的判断`var isIE = (/msie [\w.]+/).exec(navigator.userAgent.toLowerCase());`，因为server上没有navigator，所以需要加上环境的判断，改为：`var isIE = isBrowser && (/msie [\w.]+/).exec(navigator.userAgent.toLowerCase());`

＊ git上的版本改完navigator，出现·Cannot read property 'view8' of undefined·，但2.0.0b5版本没有这个问题，比较文件，两个版本在细节的地方差别较大。

* render时模板中的collection出现问题，如果将模板中的collection移除，则browser和server都正常。
  1. 如果不重载view.render，browser正常，但server无法正常渲染出collection，对于collection部分会被渲染为`[object Object]`
  2. 如果重载view.render，当使用`this.template(context);`时，browser出现`TypeError: parent is undefined`(827行)，而server端报`Cannot read property '_helperName' of undefined`。两边的代码一致，但出错的位置不一。b端是parent未定义，而server端是已经定义，但parent没有_helperName属性。