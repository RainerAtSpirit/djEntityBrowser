/**
 * Copyright 2011-2013 (C) Spirit-EDV-Beratung AG. All rights reserved.
 */
/* globals $data, OData*/
define(function( require ) {

    'use strict';
    var global = require('global'),
        ko = require('knockout'),
        router = require('plugins/router'),
        system = require('durandal/system'),
        runOnce = true,
        entities = ko.observableArray([]),
        childRouter = router.createChildRouter()
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

    function activate () {
        if ( runOnce ) {
            runOnce = false;

            global.config.oDataURI.subscribe(function( value ) {
                createEntityMap();
            });
        }

        //childRouter.navigate('entities/' + global.config.oDataURI().id);
        return createEntityMap();

    }

    return {
        entities: entities,
        router: childRouter,
        activate: activate
    };

    function createEntityMap () {
        var oDataURI = global.config.oDataURI();

        // Enable JSONP if service doesn't support CORS
        OData.defaultHttpClient.enableJsonpCallback = !oDataURI.cors;

        if ( global.ctx[oDataURI.id] ) {
            entities(global.entityMaps[oDataURI.id]);
            return;
        }

        return $data.initService(oDataURI.url)
            .then(function( context ) {
                var entityMap = [];
                global.ctx[oDataURI.id] = context;

                //context.onReady({
                //    error: function (exception) {
                //        system.log('Context:Error', exception);
                //    }
                //});

                global.ctx[oDataURI.id].forEachEntitySet(function( entity ) {
                    entityMap.push({
                        hash: '#entities/browse/' + encodeURIComponent(entity.name),
                        title: entity.name,
                        isActive: ko.computed(function() {
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