/**
 * Copyright 2011-2013 (C) Spirit-EDV-Beratung AG. All rights reserved.
 */
/* globals $data, OData*/
define(function( require ) {
    'use strict';
    var global = require('global'),
        ko = require('knockout'),
        $ = require('jquery'),
        router = require('plugins/router'),
        childRouter = router.createChildRouter()
            .makeRelative({
                moduleId: 'entities',
                route: 'entities'
            }),
        system = require('durandal/system'),
        runOnce = true,
        ctor, lifeCycle, instanceMethods;

    ctor = function() {
        this.router = childRouter;
        this.entities = ko.observableArray([]);
    };

    lifeCycle = {

        // Passing in ?reload=true when switching between services
        activate: function( path, params ) {

            if ( arguments[0] === null ) {
                // Navigate to default svcId
                childRouter.navigate('entities/' + global.config.oDataURI().id);
            }

            if ( runOnce || (params && params.reload) ) {
                runOnce = false;
                this.init();
            }

            return this.createEntityMap();
        }
    };

    instanceMethods = {
        init: function() {
            var svcId = global.config.oDataURI().id;
            this.router.map([
                // Home view
                { route: svcId, moduleId: 'home', title: 'Hello and welcome', nav: true },

                // Single entity view
                { route: svcId + '/browse/:entities', moduleId: 'entity', title: 'Entity browser' },

                // ... filtered by navigation parameter
                { route: svcId + '/browse/:entities/:relatedEntity/:relateId', moduleId: 'entity', title: 'Entity browser' },

                // Item view
                { route: svcId + '/item/:item/:entityId', moduleId: 'item', title: 'Item view' }
            ]).buildNavigationModel();
        },
        createEntityMap: function() {
            var self = this,
                oDataURI = global.config.oDataURI(),
                svcId = oDataURI.id;

            // Enable JSONP if service doesn't support CORS
            OData.defaultHttpClient.enableJsonpCallback = !oDataURI.cors;

            if ( global.ctx[oDataURI.id] ) {
                this.entities(global.entityMaps[oDataURI.id]);
                return;
            }

            return $data.initService(oDataURI.url)
                .then(function( context ) {
                    var entityMap = [];
                    global.ctx[oDataURI.id] = context;

                    global.ctx[oDataURI.id].forEachEntitySet(function( entity ) {
                        entityMap.push({
                            hash: '#entities/' + svcId + '/browse/' + encodeURIComponent(entity.name),
                            title: entity.name,
                            isActive: ko.computed(function() {
                                var i = router.activeInstruction();
                                return i && ko.utils.arrayIndexOf(i.params, '/browse/' + entity.name) !== -1;
                            })
                        });
                    });

                    global.entityMaps[oDataURI.id] = entityMap;
                    self.entities(entityMap);
                });
        }

    };

    $.extend(ctor.prototype, lifeCycle, instanceMethods);

    return ctor;

});