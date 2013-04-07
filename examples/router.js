define([
	'jquery', 'underscore', 'backbone',
	'./views/todos',
	'./collections/todos',
	'handlebars',
	'module'],
	function($, _, Backbone,TodosView, TodosCollection, Handlebars, module) {
		return Backbone.Router.extend({
			selector: "#main",
			routes: {
				'': 'index'
			},
			index: function(){
				var collection = new TodosCollection([{
					title: "Something",
					completed: true
				}, {
					title: "Unfinished",
					completed: false
				}]);

				var view = new TodosView({
					collection: collection
				});
				$(this.selector).append(view.$el);
				this.trigger('done', this, 'ready');
			}
		});
	}
);