define(['durandal/system', 'knockout', 'services/fn', 'global'], function (system, ko, fn, global) {

   

    var ctor = function () {
        this.items = ko.observableArray([]);
        this.take = ko.observable(10);
    };

    ctor.prototype.canActivate = function(entityName, related, relatedId, params) {
        var oDataURI = global.config.oDataURI();
        var context = global.ctx[oDataURI.id];

        if (!entityName || !context[entityName]) {
            alert('missing or wrong entityName');
            return false;
        }

        return true;
    };

    ctor.prototype.activate = function (entityName, related, relatedId, params) {
        var oDataURI = global.config.oDataURI();
        var context = global.ctx[oDataURI.id];
        var items = [];
        var self = this;
        var query = {};


        this.type = fn.getTypeByParam(entityName);
        this.ItemName = this.type.ItemName;
        this.ds = context[this.ItemName];
        this.model = this.ds[this.type.LogicalTypeName];


        this.properties = this.model.memberDefinitions.getPublicMappedProperties();
        this.assocations = this.ds.expression.storageModel.Associations;

        //Todo: Check if multiple keys are allowed in Odata?
        this.keyName = this.model.memberDefinitions.getKeyProperties()[0].name;
        this.params = params || {};

        
        // Apply relationship filter
        if (related && relatedId) {
            var expression = "it." + related + " == this.id";
            $.extend(true, query, this.ds.filter(expression, { id: relatedId }));
        }
        else {
            $.extend(true, query, this.ds);
        }

        // Return the promise to ensure that composition waits
        return query.take(this.take())
        .forEach(function (item) {
            items.push($.extend(item, {
                _getValue: fn.getValue,
                _getDetailLink: function () {
                    return '#entities/item/' + self.type.LogicalTypeName + '/' + this[self.keyName];
                }
            }
            ));
        })
        .then(function () {
            self.items(items);
        });
    };

    ctor.prototype.attached = function () {
        system.log('this.items', this.items());
    };

    return ctor;


});