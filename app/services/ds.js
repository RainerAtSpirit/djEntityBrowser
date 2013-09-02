define(['services/fn', 'global', 'knockout', 'durandal/system'], function( fn, global, ko, system ) {

    var ctor = function( ctx, entityName, options ) {
        if ( typeof ctx === 'undefined' || typeof entityName === 'undefined' ) {
            return;
        }

        this._ctx = ctx;
        this._entityName = entityName;
        this._type = fn.getTypeByParam(entityName);
        this._options = options || {};

        this.items = ko.observableArray([]);
        this.ItemName = this._type.ItemName;
        this.context = this._ctx[this.ItemName];
        this.model = this.context[this._type.LogicalTypeName];

        //Todo: Check if multiple keys are allowed in Odata?
        this.keyName = this.model.memberDefinitions.getKeyProperties()[0].name;
        this.properties = this.model.memberDefinitions.getPublicMappedProperties();
        this.assocations = this.context.expression.storageModel.Associations;

        // Process options
        this.init();
    };

    ctor.prototype.fetch = function() {
        system.log('todo: fetching');
    };

    ctor.prototype.query = function( expression, options ) {
        var self = this;
        var query = {};
        var items = [];

        if ( expression && options ) {
            $.extend(true, query, this.context.filter(expression, options));
        }
        else {
            $.extend(true, query, this.context);
        }

        return query.take(this.take())
            .forEach(function( item ) {
                items.push($.extend(item, {
                        _getValue: fn.getValue,
                        _getDetailLink: function() {
                            return '#entities/item/' + self._type.LogicalTypeName + '/' + this[self.keyName];
                        }
                    }
                ))
            })
            .then(function(){
                self.items(items);
            })


    };

    ctor.prototype.next = function() {
        system.log('todo: next');
    };

    ctor.prototype.previous = function() {
        system.log('todo: next');
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
            sort: false,
            filter: false,
            total: null
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

        //Todo: Consider splitting into refresh/reset/fetch
        $.each(['sort', 'filter', 'take'], function( idx, prop ) {
            self[prop].subscribe(function( value ) {
                system.log('ds:changed:', value);
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