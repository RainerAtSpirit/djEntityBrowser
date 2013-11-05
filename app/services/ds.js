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
        ctor, instanceMethods, paging;


    ctor = function( ctx, entityName, options ) {
        this._sort = ko.observableArray();
        this._filter = ko.observable();
        this.isFetching = ko.observable(false);
        this.items = ko.observableArray([]);
        this.page = ko.observable();

        this.init(ctx, entityName, options);
    };


    instanceMethods = {
        sort: function( options ) {
            var self = this;

            //Todo: Consider command pattern http://www.johnpapa.net/kolite1-1/
            if ( this.isFetching() ) {
                return false;
            }

            // If called empty return current sort as JSON
            if ( !options ) {
                return ko.toJSON(this._sort());
            }

            // wrap objects in an array
            options = $.isArray(options) ? options : [options];

            this._sort(options);

        },
        filter: function( options ) {
            // If called empty return current sort as JSON
            if ( !options ) {
                return ko.toJSON(this._filter);
            }

            if ( this.isFetching() ) {
                return 'fetch in progress. filter not allowed.';
            }

            //Todo: Better normalizing
            // Simple filter object
            if ( $.isPlainObject(options) && !options.filters ) {
                this._filter({
                    logic: 'and',
                    filters: [options]
                });
            }
            // filter builder object
            else if ( $.isPlainObject(options) && options.filters ) {
                this._filter(options);
            }
            // storing simple filter as array
            else {
                system.log('Unknown filter, expand ctor.prototype.filter');
            }
        },
        reset: function() {
            this.page(1);
            this.skip(0);
        },
        fetch: function() {
            var self = this;
            this.isFetching(true);
            this.query().then(function() {
                self.isFetching(false);
            });
        },
        query: function() {
            var self = this;
            var items = [];
            var query = this.context;

            if ( this.withInlineCount() && query.entityContext.storageProvider.supportedSetOperations.withInlineCount ) {
                // $.extend(true, query, this.context.withInlineCount());
                query = query.withInlineCount();
            }

            if ( this._filter() ) {
                query = executeFilter(query, this._filter());
            }

            if ( this._sort().length > 0 ) {
                system.log('ds:query:sortArgs', ko.toJSON(this._sort()));
                $.each(ko.toJS(this._sort()), function( idx, sort ) {
                    query = query.order((sort.dir === 'desc' ? "-" : "") + sort.field);
                });
            }

            if ( this.skip() !== 0 ) {
                query = query.skip(this.skip());
            }

            return query.take(this.take())
                .toArray(function( response ) {
                    if ( typeof response.totalCount === 'number' ) {
                        self.totalCount(response.totalCount);
                    }
                    // Return item as ko.observables
                    var resp = $.map(response, function( item, prop ) {
                        return item.asKoObservable();
                    });

                    self.items(resp);
                });

            // Credit to https://github.com/jaydata/jaydata/pull/123

            function executeFilter ( q, filter ) {
                var result = {
                    expression: "",
                    index: 0,
                    values: {}
                };

                createFilterExpression(filter, result);

                //console.log(result.expression);

                return q.filter(result.expression, result.values);
            }

            function createFilterExpression ( filter, result ) {
                filter.filters.forEach(function( subFilter, index ) {
                    if ( index > 0 ) {
                        result.expression += filter.logic === "or" ? " || " : " && ";
                    }

                    if ( subFilter.field !== undefined ) {
                        createFieldExpression(subFilter, result);
                    }
                    else {
                        result.expression += " ( ";
                        createFilterExpression(subFilter, result);
                        result.expression += " ) ";
                    }
                });
            }

            function createFieldExpression ( filter, result ) {
                var field = "it." + filter.field;
                var valueId = "value" + result.index;
                var value = "this." + valueId;

                switch ( filter.operator ) {
                    case 'eq':
                        result.expression += field + " == " + value;
                        break;
                    case 'neq':
                        result.expression += field + " != " + value;
                        break;
                    case 'startswith':
                        result.expression += field + ".startsWith(" + value + ")";
                        break;
                    case 'contains':
                        result.expression += field + ".contains(" + value + ")";
                        break;
                    case 'doesnotcontain':
                        result.expression += "!" + field + ".contains(" + value + ")";
                        break;
                    case 'endswith':
                        result.expression += field + ".endsWith(" + value + ")";
                        break;
                    case 'gte':
                        result.expression += field + " >= " + value;
                        break;
                    case 'gt':
                        result.expression += field + " > " + value;
                        break;
                    case 'lte':
                        result.expression += field + " <= " + value;
                        break;
                    case 'lt':
                        result.expression += field + " < " + value;
                        break;
                    default:
                        system.log('unknown operator', filter.operator);
                        break;
                }

                result.values[valueId] = filter.value;
                result.index++;
            }

        },
        init: function( ctx, entityName, options ) {
            var self = this,
                defaults = {
                    take: 10,
                    skip: 0,
                    page: 1,
                    totalCount: null,
                    withInlineCount: true
                };
            options = options || {};

            this._ctx = ctx;
            this._options = options;
            this._entityName = entityName;
            this._type = fn.getTypeByParam(entityName);
            this.ItemName = this._type.ItemName;
            this.context = this._ctx[this.ItemName];
            this.model = this.context[this._type.LogicalTypeName];
            this.properties = this.model.memberDefinitions.getPublicMappedProperties();
            //Todo: Check if multiple keys are allowed in Odata?
            this.keyName = this.model.memberDefinitions.getKeyProperties()[0].name;
            this.assocations = this.context.expression.storageModel.Associations;

            // Whitelist
            $.each(defaults, function( name, value ) {
                if ( ko.isObservable(value) ) {
                    return;
                }

                if ( ko.isObservable(self[name]) ) {
                    self[name](options[name] || value);
                }
                else {
                    self[name] = ko.observable(options[name] || value);
                }
                self['_' + name] = options[name] || value;
                self[name].subscribe(function( newValue ) {
                    self['_' + name] = newValue;
                });
            });

            // updating _sort|_filter|_take resets ds ->
            // todo: combine ds default options with changed value
            $.each(['_sort', '_filter', 'take'], function( idx, prop ) {
                self[prop].subscribe(function( value ) {
                    system.log('ds:reset:', value);
                    self.reset();
                    self.fetch();
                });
            });

            self.hasNext = ko.computed(function() {
                //Todo:
                return true;
            });

            self.hasPrevious = ko.computed(function() {
                return (this.page() > 1);
            }, this);

            //todo: pager module?
            // Make sure to set up ko.computed after all observable have been defined
            self.hasPrevious = ko.computed(function() {
                return (this.page() > 1);
            }, this);
            self.hasNext = ko.computed(function() {
                return (this.totalCount() > this.skip() + this.take() );
            }, this);
            self.paging = ko.computed(function() {
                var from = 1;
                var to = 0;
                var isEmpty = this.totalCount() === 0;

                if ( isEmpty ) {
                    from = 0;
                    to = 0;
                }
                else {
                    from = ((this.page() - 1) * this.take()) + 1;
                    to = this.page() * this.take();

                    // last page
                    if ( !this.hasNext() ) {
                        to = this.totalCount();
                    }
                }

                return {
                    page: this.page(),
                    totalCount: this.totalCount(),
                    from: from,
                    to: to,
                    hasNext: this.hasNext(),
                    hasPrevious: this.hasPrevious(),
                    isEmpty: isEmpty
                };

            }, this);

        }
    };


    paging = {
        next: function() {
            if ( !this.hasNext() || this.isFetching() ) {
                return false;
            }
            this.skip(this.page() * this.take());
            this.page(this.page() + 1);

            this.fetch();
        },
        previous: function() {
            if ( !this.hasPrevious() || this.isFetching() ) {
                return false;
            }

            this.page(this.page() - 1);
            this.skip((this.page() - 1) * this.take());
            this.fetch();
        }
    };

    $.extend(ctor.prototype, instanceMethods, paging);

    return ctor;

});