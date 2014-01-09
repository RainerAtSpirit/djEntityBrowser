/**
 * Copyright 2011-2013 (C) Spirit-EDV-Beratung AG. All rights reserved.
 * Available via the MIT license.
 * see: https://github.com/RainerAtSpirit/djODataAPIExplorer for details.
 */
define(function( require ) {
    'use strict';

    var oDataUris = [
        {
            id: 'nwJayData',
            type: 'remote',
            name: 'Northwind (JayData.org)',
            url: 'http://jaydata.org/examples/Northwind.svc',
            cors: true
        },
        {
            id: 'nwODataOrgV3',
            type: 'remote',
            name: 'Northwind V3 (odata.org)',
            url: 'http://services.odata.org/V3/Northwind/Northwind.svc',
            cors: false
        },
        {
            id: 'nwODataOrgV4',
            type: 'remote',
            name: 'Northwind V4 (odata.org)',
            url: 'http://services.odata.org/V3/Northwind/Northwind.svc',
            cors: false
        }
    ];

    return {
        oDataUris: oDataUris
    };

});