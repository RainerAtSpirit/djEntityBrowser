/**
 * Copyright 2011-2013 (C) Spirit-EDV-Beratung AG. All rights reserved.
 */
define(function( require ) {
    'use strict';

    var config = require('config'),
        ko = require('knockout'),
        oDataUris = ko.observable(config.oDataUris),
        oDataURI = ko.observable(config.oDataUris[0]),
        enableJsonpCallback = ko.observable(false),

        global = {
            entityMaps: {},
            ctx: {},
            config: {
                oDataUris: oDataUris,
                oDataURI: oDataURI,
                enableJsonpCallback: enableJsonpCallback
            }
        };

    // to ease debugging global is expose as "djOData" when in development mode
    //>>excludeStart("build", true);
    window.djOData = global;
    //>>excludeEnd("build");

    return global;
});