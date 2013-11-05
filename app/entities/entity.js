/**
 * Copyright 2011-2013 (C) Spirit-EDV-Beratung AG. All rights reserved.
 */
define(function( require ) {
    'use strict';
    var fn = require('services/fn'),
        global = require('global'),
        $ = require('jquery'),
        ko = require('knockout'),
        system = require('durandal/system'),
        DataSource = require('services/ds'),
        ctor, lifeCycle;

    ctor = function() {
    };

    lifeCycle = {
        canActivate: function canActivate ( entityName, related, relatedId, params ) {
            var oDataURI = global.config.oDataURI();
            var context = global.ctx[oDataURI.id];

            if ( !entityName || !context[entityName] ) {
                system.log('missing or wrong entityName');
                return false;
            }

            return true;
        },
        activate: function activate ( entityName, related, relatedId, params ) {
            var oDataURI = global.config.oDataURI();
            var context = global.ctx[oDataURI.id];

            this.ds = new DataSource(context, entityName, {
                take: 10
            });

            /*this.ds = dsFactory({
             ctx: context,
             entityName: entityName,
             options: {
             take: 10
             }
             });*/

            global.TEST = global.TEST || {};
            global.TEST[entityName] = this.ds;

            // Apply filter if needed and return the promise
            //Todo Filter expression as binary search tree
            if ( related && relatedId ) {

                return this.ds.filter({ field: related, operator: "eq", value: relatedId });
                //return this.ds.query(expression, options);
            }
            else {
                return this.ds.query();
            }
        }
    };

    $.extend(true, ctor.prototype, lifeCycle);

    return ctor;

});