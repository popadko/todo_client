// Define jQuery as AMD module
define.amd.jQuery = true;

define([
    'jquery',
    'underscore',
    'backbone'
], function($, _, Backbone) {
    console.log('Hello World!');
});
