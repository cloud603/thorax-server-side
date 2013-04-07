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
			srender: function(){
				var context = { collection: this.collection.toJSON() };
				var html = this.template(context);
				this.$el.html(html);
				return this;
			}
		});
	});