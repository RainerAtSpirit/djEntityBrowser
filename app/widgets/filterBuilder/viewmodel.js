/**
 * Copyright 2011-2013 (C) Spirit-EDV-Beratung AG. All rights reserved.
 * Based on algorithm by Ryan Niemeyer http://jsfiddle.net/rniemeyer/UkGTF/
 */
define(function( require ) {
    'use strict';

    var widget = require('plugins/widget'),
        ko = require('knockout'),
        $ = require('jquery'),
        Filter, FilterGroup, ctor, lifeCycle, instanceMethods;

    // Filter constructor function
    Filter = function( parent ) {
        this.field = ko.observable();
        this.operator = ko.observable();
        this.value = ko.observable('');

        this.remove = (function( parent ) {
            return function( data, event ) {
                parent.filters.remove(this);
            };
        })(parent);
    };

    // FilterGroup constructor function
    FilterGroup = function( parent ) {
        var self = this;

        this.logic = ko.observable('and');
        // Include a blank filter in every group.
        this.filters = ko.observableArray([new Filter(self)]);

        this.addFilter = function() {
            var filter = new Filter(self);
            self.filters().push(filter);
            self.filters.valueHasMutated();
        };

        this.addGroup = function() {
            var group = new FilterGroup(self);
            self.filters().push(group);
            self.filters.valueHasMutated();
        };

        this.remove = (function( parent ) {
            return function() {
                parent.filters.remove(self);
            };
        })(parent);

    };

    ctor = function() {
        this.lookups = {
            logic: ['and', 'or'],
            opmap: [
                { name: 'equals', value: 'eq' },
                { name: 'not equal to', value: 'neq' },
                { name: 'less than', value: 'lt' },
                { name: 'less than or equal to', value: 'lte' },
                { name: 'greater than', value: 'gt' },
                { name: 'greater than or equal', value: 'gte' },
                { name: 'starts with', value: 'startswith' },
                { name: 'contains', value: 'contains' }
            ]
        };
    };

    lifeCycle = {
        activate: function( settings ) {
            this._settings = settings;
            this.init();
        }
    };

    instanceMethods = {
        init: function() {
            var self = this;

            if ( !this._settings.ds || !this._settings.fields ) {
                return 'Missing ds or filter param';
            }

            this.ds = this._settings.ds;
            this.fields = this._settings.fields;

            $.extend(this.lookups, {fields: this.fields});

            this.filters = new FilterGroup();

            // Todo: Pass close in via settings
            this.close = function() {
                this._settings.bindingContext.$data.toggleFilter();
            };
            this.applyFilter = function() {
                this.ds.filter(JSON.parse(self.toJsonFilter()));
            };
            this.removeFilter = function() {
                //Todo: Enhance to support permanent filter
                // Scenario: User filter enhances preset system filter
                this.ds._filter('');
            };

        },
        viewTemplate: function( ctx ) {
            var self = this;
            var template = 'filterBuilder/filter';
            if ( typeof ctx.field === 'undefined' ) {
                template = 'filterBuilder/filterGroup';
            }
            return template;
        },
        toJsonFilter: function() {
            return ko.toJSON(this.filters);
        }
    };

    $.extend(ctor.prototype, lifeCycle, instanceMethods);

    return ctor;

});