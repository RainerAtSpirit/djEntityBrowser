/**
 * Copyright 2011-2013 (C) Spirit-EDV-Beratung AG. All rights reserved.
 */
define(function( require ) {
    'use strict';

    var router = require('plugins/router'),
        global = require('global'),
        oDataURI = global.config.oDataURI;

    // Redirecting from /entities to current /entities/svcId
    router.guardRoute = function( routeInfo, params, instance ) {
        if ( params.fragment === 'entities' ) {
            return 'entities/' + oDataURI().id;
        }
        return true;
    };

    // on service selection go to entity view
    global.config.oDataURI.subscribe(function( value ) {
        router.navigate('entities/' + value.id + '?reload=true');
    });

    return {
        router: router,
        oDataURI: oDataURI,
        oDataUris: global.config.oDataUris,
        activate: function() {
            return router.map([
                    { route: ['', 'home'], moduleId: 'home/index', title: 'Home', nav: true },
                    { route: 'entities*details', moduleId: 'entities/index', title: 'API Explorer', nav: true, hash: '#entities' }
                ]).buildNavigationModel()
                .mapUnknownRoutes('home/index', 'not-found')
                .activate();
        }
    };
});