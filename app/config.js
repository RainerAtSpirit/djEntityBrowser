define(['knockout'], function (ko) {


    window.myApp = {
        entityMaps: {},
        ctx: {}
    };

    var enableJsonpCallback = ko.observable(false);

    var oDataUris = [
      //      { id: 'nwLocal', type: 'local', name: 'Northwind', url: '/examples/Northwind.svc', cors: true },
            { id: 'nwJayData', type: 'remote', name: 'Northwind JayData.org', url: 'http://jaydata.org/examples/Northwind.svc', cors: true },
            { id: 'nwODataOrg', type: 'remote', name: 'Northwind services.odata.org', url: 'http://services.odata.org/Northwind/Northwind.svc', cors: false },
    ];
   
    return {
        oDataURI: ko.observable(oDataUris[0]),
        oDataUris: ko.observableArray(oDataUris),
        enableJsonpCallback: enableJsonpCallback
    };

});