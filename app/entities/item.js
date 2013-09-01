define(['knockout', 'services/fn', 'global'], function( ko, fn, global ) {

    var ctor = function() {
        this.items = ko.observableArray([]);
    };

    ctor.prototype.canActivate = function( entityName, entityId, params ) {

        if ( !entityName && !entityId ) {
            alert('missing or wrong entityName or entity');
            return false;
        }
        return true;
    };

    ctor.prototype.activate = function( entityName, entityId, params ) {
        var oDataURI = global.config.oDataURI();
        var context = global.ctx[oDataURI.id];
        var items = [];
        var self = this;
        var query = {};

        this.id = entityId;

        this.type = fn.getTypeByParam(entityName);
        this.ItemName = this.type.ItemName;
        this.ds = context[this.ItemName];
        this.model = this.ds[this.type.LogicalTypeName];

        this.properties = this.model.memberDefinitions.getPublicMappedProperties();
        this.assocations = this.ds.expression.storageModel.Associations;

        //Todo: Check if multiple keys are allowed in Odata?
        this.keyName = this.model.memberDefinitions.getKeyProperties()[0].name;
        this.params = params || {};
        this._expression = "it." + this.keyName + " == this.id";

        $.extend(true, query, this.ds);

        // Retrieve a single item.
        query.filter(self._expression, { id: self.id })
            .forEach(function( item ) {
                items.push($.extend(item, {
                    _getValue: fn.getValue
                }));
            })
            .then(function() {
                self.items(items);
            });
    };

    return ctor;

});