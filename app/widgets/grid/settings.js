/**
 * Copyright 2011-2013 (C) Spirit-EDV-Beratung AG. All rights reserved.
 * Available via the MIT license.
 * see: https://github.com/RainerAtSpirit/djODataAPIExplorer for details.
 */
/*global  */
define(function( require ) {
    'use strict';

    var app = require('durandal/app'),
        dialog = require('plugins/dialog'),
        Column = require('./column'),
        ko = require('knockout'),
        $ = require('jquery'),
        ctor, instanceMethods, lifeCycle;

    ctor = function( options ) {
        var self = this;
        options = (options || {});

        this.columns = options.columns;
        this.selectedColumn = ko.observable();

        this.fields = options.properties;
        this.listInfoFields = options.properties;

        // Setting upper limit
        this.allowNewColumn = ko.computed(function() {
            return self.columns().length < 10;
        });

        // Todo check which field should be added
        this.addColumn = function() {
            var baseColumn = self.fields[0];
            var column = new Column({
                name: baseColumn.name,
                title: baseColumn.name,
                width: ''
            }, self.listInfoFields);

            self.selectedColumn(column);
            self.columns.push(column);
        };

        this.clearColumn = function( data, event ) {
            if ( data === self.selectedColumn() ) {
                self.selectedColumn(null);
            }

            if ( data.title() === "" ) {
                self.columns.remove(data);
            }
        };

        this.removeColumn = function( data, event ) {
            self.clearColumn(data);
            self.columns.remove(data);
        };

        this.isColumnSelected = function( column ) {
            return column === this.selectedColumn();
        };

    };


    instanceMethods = {
        close: function() {
            dialog.close(this, this);
        }
    };

    lifeCycle = {
        attached: function( view ) {
            $(view).draggable(
                { handle: ".draggable" }
            );
        }
    };

    $.extend(ctor.prototype, lifeCycle, instanceMethods);

    return ctor;
});