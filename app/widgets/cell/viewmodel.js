/**
 * Copyright 2011-2013 (C) Spirit-EDV-Beratung AG. All rights reserved.
 */
define(function( require ) {
    'use strict';

    var fn = require('services/fn'),
        dialog = require('plugins/dialog'),
        $ = require('jquery'),
        ko = require('knockout'),
        system = require('durandal/system'),
        ctor, lifecyle, instanceMethods;

    ctor = function() {
    };

    lifecyle = {
        activate: function( settings ) {
            this._settings = settings;
            this.ds = this._settings.ds;
            this.column = this._settings.column;
            this.item = this._settings.item;
        }
    };

    instanceMethods = {
        getValue: fn.getValue
    };

    $.extend(ctor.prototype, lifecyle, instanceMethods);

    return ctor;

});