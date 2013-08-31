define(['durandal/system', 'knockout', 'services/fn', 'config'], function (system, ko, fn, config) {

   

    var ctor = function () {
        this.items = ko.observableArray([]);
    };

    ctor.prototype.activate = function (entityName, related, relatedId, params) {
        var oDataURI = config.oDataURI();
        var context = myApp.ctx[oDataURI.id];
        var items = [];
        var self = this;
        var query = {};

        if (!entityName || !context[entityName]) {
            alert('missing or wrong entityName');
        }
        
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
        return query.take(10)
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