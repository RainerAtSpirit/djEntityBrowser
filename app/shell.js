/**
 * Copyright 2011-2013 (C) Spirit-EDV-Beratung AG. All rights reserved.
 */
define(function (require) {
    'use strict';

    var router = require('plugins/router');

    return {
        router: router,
        activate: function () {
            return router.map([
                { route: ['', 'home'], moduleId: 'home/index', title: 'Home', nav: true },
                { route: 'entities*details', moduleId: 'entities/index', title: 'Entity Browser', nav: true, hash: '#entities' }
            ]).buildNavigationModel()
              .mapUnknownRoutes('home/index', 'not-found')
              .activate();
        }
    };
});