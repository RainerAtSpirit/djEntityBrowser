define(['durandal/system', 'knockout', 'services/fn', 'global', 'services/ds'], function( system, ko, fn, global, DataSource ) {

    var ctor = function() {
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

        this.ds = new DataSource(context, entityName, {
            take: 1
        });

        //Todo: Binary search tree
        var expression = "it." + this.ds.keyName + " === this.id";
        var options = { id: entityId };
        return this.ds.query(expression, options);
    };

    ctor.prototype.attached = function() {
        system.log('this.ds.items', this.ds.items());
    };

    return ctor;

});