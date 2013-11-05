/**
 * Copyright 2011-2013 (C) Spirit-EDV-Beratung AG. All rights reserved.
 */
/*global define, ko */
define(['durandal/app', 'services/fn'], function( app, fn ) {

    var Column = function( config, properties ) {
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

        this.getColStyle = ko.computed(function() {
            var width;
            if ( typeof this.width() === 'number' ) {
                width = this.width() + 'px';
            }
            else if ( typeof this.width() === 'string' ) {
                if ( this.width().indexOf('px') > -1 || this.width().indexOf('%') > -1 ) {
                    width = this.width();
                }
            }
            return width ? 'width:' + width : '';
        }, this);

    };

    Column.prototype.init = function() {
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

            // remove settings that are dependent on column Type
            $.each(['sortable'], function( idx, prop ) {
                // new columns has a support columnsPerType entry
                /* if (gridConfig.columnsPerType[fields[self._field()].Type]) {

                 self[prop] = gridConfig.columnsPerType[fields[self._field()].Type][prop] || null;

                 }*/
            });

        });

        function checkIfSortable ( enableSort, properties ) {
            return (enableSort && ( (properties.originalType === 'Edm.String' && properties.maxLength !== Infinity) ||
                (properties.originalType === 'Edm.Int32') ||
                (properties.originalType === 'Edm.Decimal') ||
                (properties.originalType === 'Edm.Int16')));
        }

    };

    Column.prototype.getValue = fn.getValue;

    return Column;

});