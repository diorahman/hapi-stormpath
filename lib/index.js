// Load modules

var Stormpath = require('stormpath');
var Hoek = require('hoek');


exports.register = function (server, options, next) {
   
    // Validate options
    Hoek.assert(options, 'Missing Stormpath settings');
    Hoek.assert(options.apiKey, 'Missing Stormpath apiKey');
    Hoek.assert(options.apiKey.id, 'Invalid Stormpath apiKey');
    Hoek.assert(options.apiKey.secret, 'Invalid Stormpath apiKey');
    Hoek.assert(options.appHref, 'Missing Stormpath app href');

    var settings = Hoek.clone(options);
    
    // Stormpath set keys
    var apiKey = new Stormpath.ApiKey(settings.apiKey.id, settings.apiKey.secret);
    settings.apiKey = apiKey;

    // Get client
    var client = new Stormpath.Client(settings);
    client.getApplication(settings.appHref, function (err, app) {

        if (process.env.TEST_GETAPP_FAIL) {
            err = new Error();
        }
        
        if (err) {
            return next(err);
        }

        server.expose('StormpathApplication', app);
        server.expose('StormpathClient', client);

        next();
    });
};

exports.register.attributes = {
    pkg: require('../package.json')
};


