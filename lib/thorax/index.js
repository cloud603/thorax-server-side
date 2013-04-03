var history = require('./history'),
	ajax = require('./ajax'),
	cheerio = require('cheerio');
	
var ThoraxAdapters = {
	history: history,
	ajax: ajax,
	$: cheerio
};

exports = module.exports = ThoraxAdapters;
