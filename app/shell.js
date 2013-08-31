define(['plugins/router'], function (router) {
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