var language = navigator.browserLanguage?navigator.browserLanguage:navigator.language; 
var locale = require('../locale/cn');
if (language.toLowerCase().indexOf('tw') != -1)
{
	locale = require('../locale/tw');
}

module.exports = locale;