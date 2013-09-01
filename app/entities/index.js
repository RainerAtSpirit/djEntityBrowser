define(['durandal/system', 'plugins/router', 'knockout', 'global'], function (system, router, ko, global) {

    var runOnce = true;
    var entities = ko.observableArray([]);

    var childRouter = router.createChildRouter()
        .makeRelative({
            moduleId: 'entities',
            fromParent: true
        }).map([
                // Home view
                { route: '', moduleId: 'home', title: 'Hello and welcome', nav: true },

                // Single entity view
                { route: 'browse/:entities', moduleId: 'entity', title: 'Entity browser' },

                // ... filtered by navigation parameter
                { route: 'browse/:entities/:relatedEntity/:relateId', moduleId: 'entity', title: 'Entity browser' },

                // Item view
                { route: 'item/:item/:entityId', moduleId: 'item', title: 'Item view' }
        ]).buildNavigationModel();

    return {
        entities: entities,
        router: childRouter,
        activate: activate
    };

    function activate() {
        if (runOnce) {
            runOnce = false;
            global.config.oDataURI.subscribe(function (value) {
                createEntityMap();
            });
        }

        // Enable JSONP if service doesn't support CORS
        OData.defaultHttpClient.enableJsonpCallback = !global.config.oDataURI().cors;

        return createEntityMap();
        
    }
    
    function createEntityMap() {
        var oDataURI = global.config.oDataURI();

        if (global.ctx[oDataURI.id]) {
            entities(global.entityMaps[oDataURI.id]);
            return;
        }

        return $data.initService(oDataURI.url)
        .then(function (context) {
            var entityMap = [];
            global.ctx[oDataURI.id] = context;


            //context.onReady({
            //    error: function (exception) {
            //        system.log('Context:Error', exception);
            //    }
            //});

            global.ctx[oDataURI.id].forEachEntitySet(function (entity) {
                entityMap.push({
                    hash: '#entities/browse/' + encodeURIComponent(entity.name),
                    title: entity.name,
                    isActive: ko.computed(function () {
                        var i = router.activeInstruction();
                        return i && ko.utils.arrayIndexOf(i.params, '/browse/' + entity.name) !== -1;
                    })
                });
            });

            global.entityMaps[oDataURI.id] = entityMap;
            entities(entityMap);
        });
    }

});