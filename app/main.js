/*globals, ko, jQuery, requirejs*/
(function() {
    'use strict';

    requirejs.config({
        paths: {
            'text': '../lib/require/text',
            'durandal': '../lib/durandal/js',
            'plugins': '../lib/durandal/js/plugins',
            'transitions': '../lib/durandal/js/transitions',
            'moment': '../lib/moment/moment',
            'stampit': '../lib/stampit/stampit'
        },
        shim: {
            'bootstrap': {
                deps: ['jquery'],
                exports: 'jQuery'
            }
        }
    });

    define('jquery', function() {
        return jQuery;
    });
    define('knockout', function() {
        return ko;
    });

    define(function( require ) {

        var viewLocator = require('durandal/viewLocator'),
            config = require('config'),
            app = require('durandal/app'),
            system = require('durandal/system');

        //>>excludeStart("build", true);
        system.debug(true);
        //>>excludeEnd("build");

        app.title = 'DJ OData Entity browser';

        app.configurePlugins({
            router: true,
            widget: true,
            dialog: true
        });

        app.start().then(function() {
            viewLocator.useConvention();
            app.setRoot('shell');
        });
    });
})();

