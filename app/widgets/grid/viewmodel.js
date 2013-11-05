/**
 * Copyright 2011-2013 (C) Spirit-EDV-Beratung AG. All rights reserved.
 */
define(function( require ) {
    'use strict';
      var dialog = require('plugins/dialog'),
          ko = require('knockout'),
          $ = require('jquery'),
          system = require('durandal/system'),
          Settings = require('./settings'),
          Column = require('./column'),
          ctor, instanceMethods, lifecyle;


    ctor = function() {
        this.columns = ko.observableArray([]);
        this._showFilter = ko.observable(false);
        this.showColumns = ko.computed(function() {
            return ko.utils.arrayFilter(this.columns(), function( column ) {
                return column.showColumn();
            });
        }, this);
    };

    lifecyle = {
        activate: function( settings ) {
            this._settings = settings;
            this.ds = this._settings.ds;
            this.properties = this.ds.properties;
            this.createColumns();
        }
    };

    instanceMethods = {
        openSettingsDialog: function() {
            var self = this;
            dialog.show(new Settings(this))
                .then(function( response ) {

                    var newViewFields = $.map(response.columns(), function( obj ) {
                        return obj.field;
                    });
                    self.ds.reset();
                    /* var deltaPlus = _.difference(newViewFields, self.viewFields);
                     var deltaMinus = _.difference(self.viewFields, newViewFields);

                     // Update viewFields if required and refresh the view to fetch the new data
                     if ( deltaPlus.length > 0 || deltaMinus.length > 0 ) {
                     self.viewFields = newViewFields;
                     self.refresh();
                     }*/

                    system.log('SettingsDialog:closed', response);
                });
        },
        toggleFilter: function() {
            this._showFilter(!this._showFilter());
        },
        sortByHeader: function( column ) {
            var dir = 'asc';
            if ( !column.sortable ) {
                return;
            }
            //toggle if same column
            if ( this.ds._sort()[0] && ( column.name === this.ds._sort()[0].field) ) {
                dir = (this.ds._sort()[0].dir === 'asc') ? 'desc' : 'asc';
            }

            // setting sorted to false for all columns
            $.each(this.columns(), function( idx, obj ) {
                if ( obj.sortable ) {
                    obj.sorted(false);
                    obj.sortAsc(false);
                }
            });

            column.sortAsc((dir === 'asc'));
            column.sorted(true);

            this.ds.sort({ field: column.name, dir: dir });

        },
        createColumns: function() {
            var self = this;
            var publicMappedProperties = self.properties;
            var related = [];

            this._columns = $.map(publicMappedProperties, function( properties, idx ) {
                if ( properties.inverseProperty ) {
                    related.push(properties);
                    return;
                }
                // todo: ensure valid config object
                var config = {
                    name: properties.name,
                    title: properties.name.toUpperCase(),
                    sortable: true
                };
                var newCol = new Column(config, properties);
                return newCol;

            });

            if ( related.length ) {
                var newCol = new Column({
                    sortable: false,
                    title: 'Related',
                    name: 'Related'
                }, {});
                $.extend(newCol, {
                    related: true,
                    properties: related
                });
                self._columns.unshift(newCol);

                /*self._columns.unshift({
                 sortable: false,
                 sorted: ko.observable(false),
                 sortAsc: ko.observable(false),
                 related: true,
                 name: 'Related',
                 title: 'Related',
                 properties: related
                 })*/
            }

            self.columns(self._columns);
        }
    };

    $.extend(ctor.prototype, lifecyle, instanceMethods);

    return ctor;

});