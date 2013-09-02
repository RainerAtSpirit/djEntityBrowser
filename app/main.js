requirejs.config({
    paths: {
        'text': '../lib/require/text',
        'durandal': '../lib/durandal/js',
        'plugins': '../lib/durandal/js/plugins',
        'transitions': '../lib/durandal/js/transitions',
        'knockout': '../lib/knockout/knockout-2.3.0.debug',
        'bootstrap': '../lib/bootstrap/js/bootstrap'
    },
    shim: {
        'bootstrap': {
            deps: ['jquery'],
            exports: 'jQuery'
        }
    }
});

define('jquery', function () { return jQuery; });

define(['durandal/system', 'durandal/app', 'durandal/viewLocator', 'config'], function (system, app, viewLocator, config) {

    //var oProviderConfig = {
    //    name: 'oData',
    //    oDataServiceHost: '/examples/Northwind.svc'
    //};

 

    //>>excludeStart("build", true);
    system.debug(true);
    //>>excludeEnd("build");

    app.title = 'DJ OData Entity browser';

    //specify which plugins to install and their configuration
    app.configurePlugins({
        router: true
        //dialog: true,
        //widget: {
        //    kinds: ['expander']
        //}
    });

    app.start().then(function () {
        //Replace 'viewmodels' in the moduleId with 'views' to locate the view.
        //Look for partial views in a 'views' folder in the root.
        viewLocator.useConvention();

        //Show the app by setting the root view model for our application.
        app.setRoot('shell');
    });
});