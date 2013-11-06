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
        system = require('durandal/system'),
        oDataURI = global.config.oDataURI,
        oDataUris = global.config.oDataUris,
        childRouter = router.createChildRouter()
            .makeRelative({
                moduleId: 'entities',
                route: 'entities'
            }),
        runOnce = true,
        ctor, lifeCycle, instanceMethods;

    global.on('svcChange', function( val ) {
        runOnce = true;
        router.navigate('entities/' + val.id);
        system.log('svcChanged', val);
    });

    ctor = function() {
        this.router = childRouter;
        this.entities = ko.observableArray([]);
    };

    lifeCycle = {

        activate: function( path ) {

            if ( runOnce ) {
                var pathSvcId = path ? path.split('/')[1] : null;

                // Deep linking support. Check if we got a svcId via Url
                if ( pathSvcId ) {
                    var obj = $.grep(oDataUris(), function( obj ) {
                        return obj.id === pathSvcId;
                    });

                    // check if we have a hit and the hit is not the actual svc
                    if (obj.length === 1 && obj[0] !== oDataURI() ) {
                        oDataURI(obj[0]);
                    }
                }
                this.init();
            }

            runOnce = false;

            return this.createEntityMap();
        },

        canDeactivate: function() {
            system.log('canDeactivate', arguments);
            return true;
        },

        deactivate: function() {
            system.log('deactivate', arguments);
            return true;
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
                svcId = oDataURI().id;

            // Enable JSONP if service doesn't support CORS
            OData.defaultHttpClient.enableJsonpCallback = !oDataURI().cors;

            if ( global.ctx[svcId] ) {
                this.entities(global.entityMaps[svcId]);
                return;
            }

            return $data.initService(oDataURI().url)
                .then(function( context ) {
                    var entityMap = [];
                    global.ctx[svcId] = context;

                    global.ctx[svcId].forEachEntitySet(function( entity ) {
                        entityMap.push({
                            hash: '#entities/' + svcId + '/browse/' + encodeURIComponent(entity.name),
                            title: entity.name,
                            isActive: ko.computed(function() {
                                var i = router.activeInstruction();
                                return i && ko.utils.arrayIndexOf(i.params, '/' + svcId + '/browse/' + entity.name) !== -1;
                            })
                        });
                    });

                    global.entityMaps[svcId] = entityMap;
                    self.entities(entityMap);
                });
        }

    };

    $.extend(ctor.prototype, lifeCycle, instanceMethods);

    return ctor;

});