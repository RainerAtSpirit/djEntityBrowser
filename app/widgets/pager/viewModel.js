/**
 * Copyright 2011-2013 (C) Spirit-EDV-Beratung AG. All rights reserved.
 */
/*global define */
define(['durandal/system'], function( system ) {

    var ctor = function() {

    };

    ctor.prototype.init = function() {
        var self = this;
        var properties = (self._settings.properties || {});
        var defaults = {
            label: '',
            id: null,
            value: null,
            type: 'text',
            placeholder: 'type here ...',
            options: null
        };

        $.each(defaults, function( prop, val ) {
            self[prop] = properties[prop] || val;
        });

    };

  /*  ctor.prototype.binding = function() {
        //ensure that the widget detached callback is called even if composed with cacheViews:true
        return { cacheViews: false };
    };*/

  /*  ctor.prototype.attached = function( view ) {
        var self = this;
        var $view = $(view);

        $view.find('select').select2();
    };*/

    ctor.prototype.activate = function( settings ) {
        this._settings = settings;

        this.init();
    };

  /*  ctor.prototype.detached = function( view ) {
        $(view).find('.select2').select2('destroy');
    };
*/
    return ctor;
});