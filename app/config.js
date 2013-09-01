define(function() {

    var oDataUris = [
        { id: 'nwJayData', type: 'remote', name: 'Northwind JayData.org', url: 'http://jaydata.org/examples/Northwind.svc', cors: true },
        { id: 'nwODataOrg', type: 'remote', name: 'Northwind services.odata.org', url: 'http://services.odata.org/Northwind/Northwind.svc', cors: false },
        { id: 'oaSpirit', type: 'remote', name: '!Not working: Spirit OpenAccess', url: 'http://openaccess.spirit.de/EntitiesModelService.svc', cors: false }
    ];

    return {
        oDataUris: oDataUris
    };

});