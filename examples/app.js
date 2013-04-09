(function() {
	// Compose RequireJS configuration run-time by determining the execution
	// context first. We may pass different values to browser and server.
	var isBrowser = typeof(window) !== 'undefined';
	
	// Execute this for RequireJS (client or server-side, no matter which)
	requirejs.config({
		paths: {
			text: 'components/requirejs-text/text',
			underscore: 'components/lodash/dist/lodash.underscore',
			backbone: 'components/backbone/backbone',
			thorax: 'components/thorax/build/dev/thorax',
			handlebars: 'components/handlebars/handlebars',
			jquery: isBrowser ? 'components/jquery/jquery' : 'emptyHack'
		},
		shim: {
			'jquery': {
				deps: ['module'],
				exports: 'jQuery',
				init: function (module) {
					console.log("init jQuery");
					// Fetch the jQuery adapter parameters from the server-app if avail.
					if (module && module.config) {
						return module.config().jquery;
					}
					
					// Fallback to browser specific thingy
					return this.jQuery.noConflict();
				}
			},
			'underscore': {
				exports: '_',
				init: function () {
					console.log('init underscore');
					return this._.noConflict();
				}
			},
			'backbone': {
				deps: ['underscore', 'jquery'],
				exports: 'Backbone',
				init: function (_, $) {
					// Inject adapters when in server
					if (!isBrowser) {
						var adapters = require('../');
						// Add the adapters we're going to be using
						_.extend(this.Backbone.history, adapters.thorax.history);
						this.Backbone.ajax = adapters.thorax.ajax;
						Backbone.$ = $;
					};
					return this.Backbone.noConflict();
				}
			},
			'thorax': {
				exports: 'Thorax',
				deps: ['underscore', 'jquery', 'backbone', 'handlebars'],
				init: function(_, $, Backbone, Handlebars){
					console.log('init thorax');
					return this.Thorax;
				}
			},
			'handlebars': {
				exports: 'Handlebars',
				init: function() {
					console.log('init handlebars');
					return this.Handlebars;
				}
			}
		},
		
		config: {
			isBowser: isBrowser,
			// The API endpoints can be passed via URLs
			'collections/items': {
				// TODO Use full path, as our adapter does not yet interpret relative URLs
				url: 'http://localhost:8080/api/items'
			}
		}
	});

	/* The main application itself */
	define(['router', 'backbone', 'thorax', 'module'],
		function(Router, Backbone, Thorax, module) {
			// Start the processing
		var router = new Router();
		Backbone.history.start({
			silent: true
		});

		// Pass the app state back, just in case somebody needed it
		var app = {
			Thorax: Thorax,
			router: router
		};
		return app;
	});
})();