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