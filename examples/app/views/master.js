define(['thorax', 'underscore', 'handlebars', 'text!../templates/master.handlebars', 'module'],
	function(Thorax, _, Handlebars, template, module) {
	console.log('Loading master view');
	return Thorax.View.extend({
		template: Handlebars.compile(template),
		state: 'init',
		
		initialize: function(options) {
			// Bind to collection to monitor for changes
			this.collection.on('stateChange', _.bind(this.handleStateChange, this));
		},
		
		render: function() {
			// Render the template into a HTML
			console.log('Rendering master view');
			var context = { collection: this.collection.toJSON() },
				html = this.template(context);

			// Replace the element contents
			this.$el.html(html);
			
			return this;
		},
		
		handleStateChange: function(collection, newState, oldState) {
			switch(newState) {
				case 'ready': return this.toggleState('ready');
				case 'pending': return this.toggleState('pending');
				case 'error': return this.toggleState('error');
			}
		},
		
		toggleState: function(newState) {
			// Sanity check
			if (this.state === newState) {
				return;
			}
			
			// If we're ok, render the view
			if (newState === 'ready') {
				this.render();
			}
			
			console.log('Master state changed', this.state, newState);
			var oldState = this.state;
			this.state = newState;
			this.trigger('stateChange', this, newState, oldState);
		}
	});
});