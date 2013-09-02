define(['durandal/system', 'knockout', 'services/fn', 'services/ds', 'global'], function( system, ko, fn, DataSource, global ) {
    var ctor = function() {
        this.items = ko.observableArray([])
    };

    ctor.prototype.canActivate = function( entityName, related, relatedId, params ) {
        var oDataURI = global.config.oDataURI();
        var context = global.ctx[oDataURI.id];

        if ( !entityName || !context[entityName] ) {
            alert('missing or wrong entityName');
            return false;
        }

        return true;
    };

    ctor.prototype.activate = function( entityName, related, relatedId, params ) {
        var oDataURI = global.config.oDataURI();
        var context = global.ctx[oDataURI.id];

        //Store one shared data source per entity per context
        global.TEST = global.TEST || {};
        global.TEST[oDataURI.id] = global.TEST[oDataURI.id] || {};
        this.ds = global.TEST[oDataURI.id][this.ItemName] = new DataSource(context, entityName, {
            take: 20
        });

        //this.params = params || {};

        // Apply relationship filter
        if ( related && relatedId ) {
            var expression = "it." + related + " == this.id";
            var options = { id: relatedId };
            return this.ds.query(expression, options);
        }
        else {
            return this.ds.query();
        }


    };

    ctor.prototype.attached = function() {
        system.log('this.ds.items', this.ds.items());
    };

    return ctor;

});