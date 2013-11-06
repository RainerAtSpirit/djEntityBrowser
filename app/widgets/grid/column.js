/**
 * Copyright 2011-2013 (C) Spirit-EDV-Beratung AG. All rights reserved.
 * Available via the MIT license.
 * see: https://github.com/RainerAtSpirit/djODataAPIExplorer for details.
 */
define(function( require ) {
    'use strict';

    var app = require('durandal/app'),
        fn = require('services/fn'),
        $ = require('jquery'),
        ko = require('knockout'),
        Column;

    Column = function( config, properties ) {
        var self = this;
        this.config = (config || {});
        this.properties = (properties || {});

        this.sorted = ko.observable(false);
        this.sortAsc = ko.observable(false);
        this.width = ko.observable('');
        this.title = ko.observable('');
        this._field = ko.observable('');
        this.showColumn = ko.observable(true);
        this.format = ko.observable();
        this.sortable = false;
        this.name = '';

        this.init();

    };

    $.extend(Column.prototype, {
        init: function() {
            var self = this;
            // whitelist
            $.each(['name', 'sortable', 'width', 'title', 'format'], function( idx, prop ) {
                if ( self.config[prop] ) {

                    // Use ko.observable() syntax if required.
                    if ( ko.isObservable(self[prop]) ) {
                        self[prop]((self.config[prop]));
                    }
                    else {
                        self[prop] = (self.config[prop]);
                    }
                }
            });

            this.sortable = checkIfSortable(this.sortable, this.properties);

            this._field(this.name);

            this._field.subscribe(function( val ) {
                // Updating static this.field
                self.name = val;
            });

            function checkIfSortable ( enableSort, properties ) {
                return (enableSort && ( (properties.originalType === 'Edm.String' && properties.maxLength !== Infinity) ||
                    (properties.originalType === 'Edm.Int32') ||
                    (properties.originalType === 'Edm.Decimal') ||
                    (properties.originalType === 'Edm.Int16')));
            }
        },
        getValue : fn.getValue
    });

    return Column;
});