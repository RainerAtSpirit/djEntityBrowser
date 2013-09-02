define(['durandal/system', 'knockout', 'services/fn', 'services/ds', 'global'], function( system, ko, fn, DataSource, global ) {
    var ctor = function() {
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

        this.ds = new DataSource(context, entityName, {
            take: 10,
            //todo: move to paging module
            withInlineCount: true
        });

        global.TEST = global.TEST ||  {};
        global.TEST[entityName] = this.ds;

        // Apply filter if needed and return the promise
        //Todo Filter expression as binary search tree
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