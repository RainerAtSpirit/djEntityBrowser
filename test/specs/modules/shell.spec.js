/*global jasmine, describe, beforeEach, it, expect, require*/

define(function( require ) {
    "use strict";

    var shell = require('shell'),
        ko = require('knockout');

    describe('app/shell', function() {

        it('should have a "router" property', function() {
            expect(shell.router).toBeDefined();
        });

        it('should have a "oDataURI" knockout observable', function() {
            expect(ko.isObservable(shell.oDataURI)).toBeTruthy();
        });

        it('should have a "oDataUris" knockout observableArray', function() {
            expect(ko.isObservable(shell.oDataUris)).toBeTruthy();
            expect(shell.oDataUris().length).toBeDefined();
        });

        describe('activate', function() {

            it('should be a property of type function', function() {
                expect(shell.activate).toBeDefined();
            });

            it('should return a promise  ', function() {
                expect(shell.activate().then).toBeDefined();
            });

        });
    });
});