/**
 * Minimal static file web server to test drive the site
 */
var express = require('express'),
		http = require('http'),
		path = require('path'),
		fs = require('fs'),
		url = require('url'),
		_ = require('underscore'),
		cheerio = require('cheerio'),
		requirejs = require('requirejs'),
		//thorax = require('./app/components/thorax/thorax'),
		adapters = require('../');

var server = express(),
		filePath = path.join(__dirname, 'components'),
		indexFile = path.join(__dirname, 'index.html'),
		index = fs.readFileSync(indexFile, 'utf8'),
		$html = cheerio.load(index);

server.configure(function() {
	server.set('port', process.env.PORT || 8080);
	server.use(express.logger('dev'));
	// Use 'app' suffix for all the static data
	server.use('/components', express.static(path.join(__dirname, 'components')));
	server.use('/views', express.static(path.join(__dirname, 'views')));
	server.use('/models', express.static(path.join(__dirname, 'models')));
	server.use('/collections', express.static(path.join(__dirname, 'collections')));
	server.use('/css', express.static(path.join(__dirname, 'css')));
	server.use('/templates', express.static(path.join(__dirname, 'templates')));
	//server.use('/', express.static(path.join(__dirname, '/')));
});

requirejs.config({
	nodeRequire: require,
	//baseUrl: '',
	// Require.js config parameters are a simple way of passing
	// information to the shims
	config: {
		jquery: {
			jquery: $html 
		}
	}
});


requirejs(['app', 'backbone'], function (app, Backbone, Thorax) {
	console.log('App initialized');

	server.get("/:file.js", function(req, res){
		var file = path.join(__dirname, req.path);
		var content = fs.readFileSync(file);
		res.send(content);
	});
	// URL Endpoint for the 'web pages'
	server.get('/', function(req, res) {
		// Remove preceeding '/'
		var path = req.path.substr(1, req.path.length);

		if (path === Backbone.history.path) {
			console.log('Serving response from cache');
			res.send($html.html());
		}

		app.router.once('done', function(router, status) {
			if (status === 'error') {
				res.send(500, 'Our framework blew it. Sorry.');
			};

			if (status === 'ready') {
				var $root = $html('#main');
				$root.attr('data-bootstrapped', true);
				res.send($html.html());
			}
		});

		// Then do the trick that would cause the state change
		Backbone.history.navigate(path, { trigger: true });
	});
});

http.createServer(server).listen(server.get('port'), function() {
	console.log('Express server listening on port', server.get('port'), 'serving files from', filePath);
});
