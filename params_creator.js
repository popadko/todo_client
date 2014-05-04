String.prototype.toCamel = function () {
    return this.toLowerCase().replace(/(_[a-z])/g, function ($1) {
        return $1.toUpperCase().replace('_', '');
    });
};

var filename = './app/params.json';

var params = require(filename);

var envVarNames = [
    'TODO_WEB_SOCKET_HOST',
    'TODO_WEB_SOCKET_PORT'
];

envVarNames.forEach(function (envVarName) {
    envVar = process.env[envVarName];
    if (envVar !== undefined) {
        params[envVarName.toCamel()] = envVar;
    }
});

var fs = require('fs');

fs.writeFile(filename, JSON.stringify(params), function (err) {
    if (err) {
        console.log(err);
    }
});