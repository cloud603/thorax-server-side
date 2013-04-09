define(['thorax', 'handlebars', 'underscore',
	'text!../templates/todos.handlebars'],
	function(Thorax, Handlebars, _, template) {
		Thorax.templates['todos'] = Handlebars.compile(template);
		//返回对Thorax.View的扩展
		return Thorax.View.extend({
			//View的名称
			name: 'todos',
			//模板，这里也可以预先加载同名的模板
			template: Handlebars.compile(template),
			events: {
				'click .toggle': function(){
					//alert('a');
				}
			}
		});
	});