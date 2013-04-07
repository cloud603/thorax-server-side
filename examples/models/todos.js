define(
	['thorax'],
	function(Thorax) {
		return Thorax.Model.extend({
			defaults: {
				title: null,
				completed: false
			}
		});
	}
);