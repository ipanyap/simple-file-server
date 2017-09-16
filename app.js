var express = require('express');
var router = require('./router');

var app = express();

app.use('/', router);
app.use(function(req, res, next) {
	console.error('URL not found');
	res.status(404).end();
});

app.set('port', (process.env.PORT || 8000));
app.listen(app.get('port'), function () {
	console.log('Express server is running on port', app.get('port'));
});