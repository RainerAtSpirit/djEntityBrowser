/**
 * Copyright 2011-2013 (C) Spirit-EDV-Beratung AG. All rights reserved.
 */
define(function( require ) {
    'use strict';

    var global = require('global'),
        moment = require('moment'),
        $ = require('jquery'),
        ko = require('knockout');

    function getTypeByParam ( entityName ) {
        var ctx = global.ctx[global.config.oDataURI().id];
        if ( !ctx ) {
            return false;
        }
        var obj = {};
        var result = $.grep(ctx._storageModel, function( n, i ) {
            return n.ItemName === entityName || n.LogicalTypeName === entityName;
        });

        $.each(result[0], function( prop, value ) {
            obj[prop] = value;
        });

        return obj;
    }

    function getValue ( ds, column, item ) {
        var cell = item,
            svcId = global.config.oDataURI().id,
            ctx = global.ctx[svcId],
            value, properties;

        if ( !ctx ) {
            return false;
        }
        value = cell[column.name] || '';
        properties = column.properties;

        // Todo : dataTypeMap to default format, overwritable by config
        if ( properties && properties.dataType && properties.dataType.name === 'Date' ) {
            value = moment(ko.unwrap(cell[column.name])).format(ko.unwrap(column.config.format) || 'YYYY-MM-DD');
        }

        // adding detail link to key fields
        if ( column.key || (column.properties && column.properties.key) ) {
            value = format('<a type="button" class="" title="Detail view" href="#entities/{3}/item/{0}/{1}">' +
                '<i class="icon-expand-alt"></i> {2}</a>',
                ds._type.LogicalTypeName,
                ko.unwrap(cell[ds.keyName]),
                ko.unwrap(cell[column.name]),
                svcId
            );
        }

        // item view has no properties prop
        if ( column.inverseProperty && !column.properties ) {
            value = createRelatedLink(column);
        }

        if ( column.related ) {
            value = [];

            //Todo: Refactor once multiplicity issue in jaydata has been fixed
            $.each(column.properties, function( idx, property ) {
                value.push(createRelatedLink(property));
            });
            value = value.join('</br>');
        }

        return value;

        function createRelatedLink ( property ) {
            var value = '',
                association = ds.assocations[property.name],
                relation = format('{0}({2}) : {1}({3})',
                    association.From,
                    association.To,
                    association.FromMultiplicity,
                    association.ToMultiplicity
                ),
                rModel, rKeyName;

            if ( association && association.FromMultiplicity === '0..1' ) {
                value = format('<a title="{0}" href="#entities/{4}/browse/{1}/{2}/{3}">{1}</a>',
                    relation,
                    property.name,
                    association.From + '.' + ds.keyName,
                    ko.unwrap(cell[ds.keyName]),
                    svcId
                );
            }
            else {
                rModel = ds.context.entityContext._storageModel[association.ToType.fullName];
                rKeyName = ctx[rModel.ItemName][rModel.LogicalTypeName].memberDefinitions.getKeyProperties()[0].name;
                if ( cell[rKeyName] ) {
                    value = format('<a title="{0}" href="#entities/{4}/item/{1}/{2}">{3}</a>',
                        relation,
                        rModel.LogicalTypeName,
                        ko.unwrap(cell[rKeyName]),
                        property.name,
                        svcId
                    );
                }
                else {
                    value = rKeyName;
                }
            }
            return value;
        }
    }

    /**
     * var input = '{0} and {1}';
     * var output = input.format('you', 'I') = 'you and I'
     * http://stackoverflow.com/questions/1038746/equivalent-of-string-format-in-jquery
     * @param str
     * @param col
     * @returns {XML|string|.supportedFieldOperations.value.replace|*|replace|void}
     */
    function format ( str, col ) {
        col = typeof col === 'object' ? col : Array.prototype.slice.call(arguments, 1);

        return str.replace(/\{\{|\}\}|\{(\w+)\}/g, function( m, n ) {
            if ( m === "{{" ) {
                return "{";
            }
            if ( m === "}}" ) {
                return "}";
            }
            return col[n];
        });
    }

    return {
        getTypeByParam: getTypeByParam,
        getValue: getValue,
        format: format
    };

});