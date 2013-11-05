/**
 * Copyright 2011-2013 (C) Spirit-EDV-Beratung AG. All rights reserved.
 */
define(function (require) {
    'use strict';

    var global = require('global');
    
    return {
        oDataURI: global.config.oDataURI,
        oDataUris: global.config.oDataUris
    };
});