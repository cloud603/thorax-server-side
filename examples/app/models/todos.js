define(
	['thorax', 'underscore', 'module'],
	function(Thorax, _, module) {
		return Thorax.Model.extend({
			default:{
				title: null,
				done: false
			}
		});
	}
);