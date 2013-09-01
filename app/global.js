define(['knockout', 'config'], function( ko, config ) {

    var oDataUris = ko.observable(config.oDataUris);
    var oDataURI = ko.observable(config.oDataUris[0]);
    var enableJsonpCallback = ko.observable(false);

    var global = {
        entityMaps: {},
        ctx: {},
        config: {
            oDataUris: oDataUris,
            oDataURI: oDataURI,
            enableJsonpCallback: enableJsonpCallback
        }
    };

    //Expose global during developemnet
    //>>excludeStart("build", true);
    window.myApp = global;
    //>>excludeEnd("build");

    return global

});