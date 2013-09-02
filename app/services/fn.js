define(['global'], function (global) {
    function getTypeByParam(entityName) {
        var ctx = global.ctx[global.config.oDataURI().id];
        if (!ctx) { return false }
        var obj = {};
        var result = $.grep(ctx._storageModel, function (n, i) {
            return n.ItemName === entityName || n.LogicalTypeName === entityName;
        });

        $.each(result[0], function (prop, value) {
            obj[prop] = value;
        });

        return obj;
    }

    function getValue(column, self) {
        var ctx = global.ctx[global.config.oDataURI().id];
        if (!ctx) { return false }
        var value = this[column.name] || '';

        if (column.inverseProperty) {
            var association = self.assocations[column.name];

            if (association && association.FromMultiplicity === '0..1') {
                value = '<a href="#entities/browse/' + column.name + '/' + self.keyName + '/' + this[self.keyName] + '">browse</a>';
            }
            else {
                var rModel = self.context.entityContext._storageModel[association.ToType.fullName];
                var rKeyName = ctx[rModel.ItemName][rModel.LogicalTypeName].memberDefinitions.getKeyProperties()[0].name;
                if (this[rKeyName]) {
                    value = '<a href="#entities/item/' + rModel.LogicalTypeName + '/' + this[rKeyName] + '">item</a>';
                }
                else {
                    value = rKeyName + ' is not a entity attribute';
                }

            }
        }
        return value;
    }

    return {
        getTypeByParam: getTypeByParam,
        getValue: getValue
    };


});