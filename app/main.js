/**
 * Copyright 2011-2013 (C) Spirit-EDV-Beratung AG. All rights reserved.
 * Available via the MIT license.
 * see: https://github.com/RainerAtSpirit/djODataAPIExplorer for details.
 */
/*globals, ko, jQuery, moment, requirejs*/
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
    define('moment', function() {
           return moment;
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

