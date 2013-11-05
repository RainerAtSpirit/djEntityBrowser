/**
 * Copyright 2011-2013 (C) Spirit-EDV-Beratung AG. All rights reserved.
 */
define(function( require ) {


    var config = require('config'),
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

    // Expose global during developemnet
    //>>excludeStart("build", true);
    window.myApp = global;
    //>>excludeEnd("build");

    return global
});