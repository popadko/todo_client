define([
    'jquery',
    'text!params.json'
], function ($, params) {

    var App = {};
    App.ENTER_KEY = 13;
    App.params = JSON.parse(params);

    return App;
});
