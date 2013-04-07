define(
	['../models/todos', 'thorax'],
	function(model, Thorax) {
		return Thorax.Collection.extend({
			model: model
		});
	}
);