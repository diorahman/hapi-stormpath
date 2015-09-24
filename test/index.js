// Load modules

var Hapi = require('hapi');
var Code = require('code');
var Lab = require('lab');
var Defaults = require('./config');


// Test shortcuts

var lab = exports.lab = Lab.script();
var describe = lab.describe;
var it = lab.it;
var expect = Code.expect;


describe('Stormpath plugin', function () {

    it('should load plugin', function (done) {

        var server = new Hapi.Server();
        server.register({
            register: require('../'),
            options: Defaults
        }, function (err) {
            expect(err).to.not.exist();
            done();
        });
    });

    it('should error on loading plugin', function (done) {
        
        process.env.TEST_GETAPP_FAIL = '1';
        var server = new Hapi.Server();
        server.register({
            register: require('../'),
            options: Defaults
        }, function (err) {
            expect(err).to.exist();
            process.env.TEST_GETAPP_FAIL = '';
            done();
        });
    });

    it('should return a valid reply', function (done) {

        var server = new Hapi.Server();
        server.connection();
        server.register({
            register: require('../'),
            options: Defaults
        }, function (err) {
            expect(err).to.not.exist();

            server.route({
                method: 'GET',
                path: '/stormpath',
                handler: function (request, reply) {
                    
                    var plugin = request.server.plugins['hapi-stormpath'];
                    expect(plugin.StormpathApplication).to.exist();
                    expect(plugin.StormpathClient).to.exist();
                    expect(plugin.StormpathApplication.authenticateAccount).to.exist();
                    reply(request.server.plugins['hapi-stormpath'] ? 'ok' : 'not ok');
                }
            });

            var request = {
                method: 'GET',
                url: 'http://example.com:8080/stormpath'
            };

            server.inject(request, function (res) {
                expect(res.statusCode).to.equal(200);
                done();
            });
        });
    });
});

