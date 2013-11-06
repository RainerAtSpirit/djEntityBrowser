/*globals, ko, jQuery, requirejs*/
(function() {
    'use strict';

    requirejs.config({
        paths: {
            'text': '../lib/require/text',
            'durandal': '../lib/durandal/js',
            'plugins': '../lib/durandal/js/plugins',
            'transitions': '../lib/durandal/js/transitions',
            'moment': '../lib/moment/moment'
        }
    });

    /* core libs are loaded via script tags. Make requirejs aware of them by defining them here*/
    define('jquery', function() {
        return jQuery;
    });
    define('knockout', function() {
        return ko;
    });

    define(function( require ) {

        var viewLocator = require('durandal/viewLocator'),
            app = require('durandal/app'),
            system = require('durandal/system');

        //>>excludeStart("build", true);
        system.debug(true);
        //>>excludeEnd("build");

        app.title = 'dj OData API explorer';

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

