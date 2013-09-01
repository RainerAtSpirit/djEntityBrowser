define(function() {

    var oDataUris = [
        //      { id: 'nwLocal', type: 'local', name: 'Northwind', url: '/examples/Northwind.svc', cors: true },
        { id: 'nwJayData', type: 'remote', name: 'Northwind JayData.org', url: 'http://jaydata.org/examples/Northwind.svc', cors: true },
        { id: 'nwODataOrg', type: 'remote', name: 'Northwind services.odata.org', url: 'http://services.odata.org/Northwind/Northwind.svc', cors: false }
    ];

    return {
        oDataUris: oDataUris
    };

});