({
    baseUrl: "../app",
    dir: "../app_build",
    mainConfigFile: '../app/config.js',
//    optimize: 'none',
    optimize: 'uglify2',
    preserveLicenseComments: false,
    inlineText: true,
    modules: [
        {
            name: 'main'
        }
    ]

})
