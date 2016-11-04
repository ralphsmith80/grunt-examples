module.exports = function(grunt) {
    'use strict';

    var username = grunt.option('username') || 'administrator',
        password = grunt.option('password') || 'test',
        // random sid
        sid = grunt.option('sid') || '4e7375785459666348374b315775335771533159576865785a576c6f724774694d4c4d582b455878714d383d',
        proxyHeaders = {
            // user-name': username,
            // PASSWORD': password,
            'sid': sid,
        };

    grunt.initConfig({
        connect: {
            options: {
                port: 3000,
                hostname: 'localhost',
                base: 'operatorconsole',
                keepalive: true,
                // open: true,
            },
            server: {
                options: {
                    middleware: function(connect, options, middlewares) {
                        var proxySnippet = require('grunt-connect-proxy/lib/utils').proxyRequest;
                        // put the proxy middleware in first
                        middlewares.unshift(proxySnippet);
                        return middlewares;
                    },
                },
                proxies: [
                    {
                        context: '/',
                        // use this if you just want to proxy the api
                        // context: '/operatorconsole/api',
                        host: '10.238.72.25',
                        port: 80,
                        https: false,
                        xforward: false,
                        headers: proxyHeaders,
                        // hideHeaders: ['x-removed-header'],

                    },
                ],
            }
        },
    });

    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-connect-proxy');

    grunt.registerTask('server', ['connect:server']);
    grunt.registerTask('proxy-server', ['configureProxies:server', 'connect:server']);

    grunt.registerTask('default', ['proxy-server']);
};