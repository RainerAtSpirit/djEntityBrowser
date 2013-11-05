/**
 * Copyright 2011-2013 (C) Spirit-EDV-Beratung AG. All rights reserved.
 */
define(function( require ) {
    'use strict';

    var fn = require('services/fn'),
        global = require('global'),
        ko = require('knockout'),
        $ = require('jquery'),
        system = require('durandal/system'),
        DataSource = require('services/ds'),
        ctor, lifeCycle, instanceMethods, paging;

    ctor = function() {
    };

    lifeCycle = {
        canActivate: function( entityName, entityId, params ) {

            if ( !entityName && !entityId ) {
                system.log('missing or wrong entityName or entity');
                return false;
            }
            return true;
        },
        activate: function( entityName, entityId, params ) {
            var oDataURI = global.config.oDataURI(),
                context = global.ctx[oDataURI.id];

            this.ds = new DataSource(context, entityName, {
                take: 1
            });

            return this.ds.filter({ field: this.ds.keyName, operator: "eq", value: entityId });
        },
        attached: function() {
            system.log('item|this.ds.items', this.ds.items());
        }
    };

    instanceMethods = {
        getValue: fn.getValue
    };

    // Extend ctor.prototype with lifecylce and instanceMethods
    $.extend(ctor.prototype, lifeCycle, instanceMethods);

    return ctor;
});