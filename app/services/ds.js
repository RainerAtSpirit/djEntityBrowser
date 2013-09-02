define(['services/fn', 'global', 'knockout', 'durandal/system'], function( fn, global, ko, system ) {

    var Sort = function( options ) {
        options = (options || {});
        this.field = ko.observable(options.field);
        this.dir = ko.observable(options.dir);
    };

    var ctor = function( ctx, entityName, options ) {
        if ( typeof ctx === 'undefined' || typeof entityName === 'undefined' ) {
            return;
        }

        this._ctx = ctx;
        this._entityName = entityName;
        this._type = fn.getTypeByParam(entityName);
        this._options = options || {};

        this._sort = ko.observableArray();

        this.isFetching = ko.observable(false);
        this.items = ko.observableArray([]);
        this.ItemName = this._type.ItemName;
        this.context = this._ctx[this.ItemName];
        this.model = this.context[this._type.LogicalTypeName];

        //Todo: Check if multiple keys are allowed in Odata?
        this.keyName = this.model.memberDefinitions.getKeyProperties()[0].name;

        //this.properties = ko.observableArray(this.model.memberDefinitions.getPublicMappedProperties());
        this.properties = ko.observableArray($.map(this.model.memberDefinitions.getPublicMappedProperties(),
            function( column, idx ) {
                //Todo: Check with JayData type/restriction can be sorted
                checkIfSortable = function() {
                    return isSortable = ( (column.originalType === 'Edm.String' && column.maxLength !== Infinity) ||
                        (column.originalType === 'Edm.Int32') ||
                        (column.originalType === 'Edm.Decimal') ||
                        (column.originalType ==='Edm.Int16'));
                };

                column._djsSortable = checkIfSortable();
                column._djsSorted = ko.observable(false);
                column._djsSortAsc = ko.observable(false);

                return column;
            })
        );

        this.assocations = this.context.expression.storageModel.Associations;

        // Process options
        this.init();

        //todo: extract as pager widget
        // Make sure to set up ko.computed after all observable have been defined
        this.hasPrevious = ko.computed(function() {
            return (this.page() > 1);
        }, this);

        this.hasNext = ko.computed(function() {
            return (this.totalCount() > this.skip() + this.take() );
        }, this);

        this.paging = ko.computed(function() {
            var from = 1;
            var to = 0;
            var isEmpty = this.totalCount() === 0;

            if ( isEmpty ) {
                from = 0;
                to = 0
            }
            else {
                from = ((this.page() - 1) * this.take()) + 1;
                to = this.page() * this.take();

                // Edge case last page
                if ( !this.hasNext() ) {
                    to = from + this.totalCount() - 1;
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
            }

        }, this);
    };

    // Todo: Multiple sort support via header
    ctor.prototype.sortByHeader = function( column ) {
        var dir = 'asc';
        if( !column._djsSortable){return;}
        //toggle if same column
        if ( this._sort()[0] && ( column.name === this._sort()[0].field()) ) {
            dir = (this._sort()[0].dir() === 'asc') ? 'desc' : 'asc';
        }

        column._djsSorted(true);
        column._djsSortAsc((dir === 'asc'));

        this.sort({ field: column.name, dir: dir });
    };

    ctor.prototype.sort = function( options ) {
        var self = this;
        var sortArray = [];

        //Todo: Consider command pattern http://www.johnpapa.net/kolite1-1/
        if ( this.isFetching() ) {
            return false;
        }

        // If called empty return current sort as JSON
        if ( !options ) {
            return ko.toJSON(this._sort());
        }

        //wrap objects in am array
        options = $.isArray(options) ? options : [options];

        resetColumns();

        $.each(options, function( idx, obj ) {
            var sort = new Sort(obj);

            setColumn(obj);

            // Setting up change event
            $.each(['field', 'dir'], function( idx, obj ) {
                sort[obj].subscribe(function( val ) {
                    self.sort(ko.toJS(self.sort()));
                });
            });

            sortArray.push(sort);
        });

        this._sort(sortArray);

        // internal
        function resetColumns () {
            // Setting sorted to false for all columns
            $.each(self.properties(), function( idx, obj ) {
                if ( obj._djsSortable ) {
                    obj._djsSorted(false);
                    obj._djsSortAsc(false);
                }
            });
        }

        function setColumn ( obj ) {
            // Check if there's a self.columns with sort field
            $.grep(self.properties(), function( e ) {
                if ( e.name === obj.field ) {
                    e._djsSorted(true);
                    e._djsSortAsc((obj.dir === 'asc'));
                }
            });
        }
    };

    ctor.prototype.fetch = function() {
        var self = this;
        this.isFetching(true);
        this.query().then(function() {
            self.isFetching(false);
        })
    };

    ctor.prototype.query = function( expression, options ) {
        var self = this;
        var query = {};
        var items = [];

        this.isFetching(true);

        if ( expression && options ) {
            $.extend(true, query, this.context.filter(expression, options));
        }
        else {
            $.extend(true, query, this.context);
        }

        if ( this.withInlineCount() ) {
            $.extend(true, query, this.context.withInlineCount());
        }

        if ( this._sort().length > 0 ) {
            console.log('sort', ko.toJSON(this._sort()));
            $.each(ko.toJS(this._sort()), function( idx, sort ) {
                query = query.order((sort.dir == 'desc' ? "-" : "") + sort.field);
            })
        }

        return query.take(this.take())
            .skip(this.skip())
            .toArray(function( response ) {
                if ( response.totalCount ) {
                    self.totalCount(response.totalCount);
                }
                var resp = $.map(response, function( item, prop ) {
                    return $.extend(item, {
                        // adding _djs prefix to minimize naming collision
                        _djsGetValue: fn.getValue,
                        _djsGetDetailLink: function() {
                            return '#entities/item/' + self._type.LogicalTypeName + '/' + this[self.keyName];
                        }
                    });
                });

                self.items(resp);
                self.isFetching(false);
            });
    };

    ctor.prototype.next = function() {
        if ( !this.hasNext() || this.isFetching() ) {
            return false;
        }
        this.skip(this.page() * this.take());
        this.page(this.page() + 1);

        this.fetch();
    };

    ctor.prototype.previous = function() {
        if ( !this.hasPrevious() || this.isFetching() ) {
            return false;
        }

        this.page(this.page() - 1);
        this.skip((this.page() - 1) * this.take());
        this.fetch();
    };

    ctor.prototype.gotoFirstPage = function( page ) {
        this.page(1);
    };

    ctor.prototype.gotoLastPage = function( page ) {
        system.log('todo: gotoLastPage');
    };

    ctor.prototype.init = function() {
        var self = this;
        var options = this._options;
        var defaults = {
            take: 10,
            skip: 0,
            page: 1,
            filter: false,
            totalCount: null,
            withInlineCount: false
        };

        // Whitelist
        $.each(defaults, function( name, value ) {
            if ( ko.isObservable(value) ) {
                return;
            }

            self[name] = ko.observable(options[name] || value);
            self['_' + name] = options[name] || value;
            self[name].subscribe(function( newValue ) {
                self['_' + name] = newValue;
            })
        });

        // sort|filter|take cause a reset of the ds ->
        // todo: combine ds default options with changed value
        $.each(['_sort', 'filter', 'take'], function( idx, prop ) {
            self[prop].subscribe(function( value ) {
                system.log('ds:reset:', value);
                self.page(1);
                self.fetch();
            })
        });

        //Todo: DS or Paging Widget level
        self.hasNext = ko.computed(function() {
            //Todo:
            return true;
        });

        self.hasPrevious = ko.computed(function() {
            return (this.page() > 1);
        }, this);

    };

    return ctor;

});