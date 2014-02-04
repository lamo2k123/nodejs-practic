module.exports = function(app) {

    app.get('/', function(req, res) {

        res.render('index.html', {
    		script : app.get('resource').script()
		});
    });

};