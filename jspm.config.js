System.config({
    baseURL: "https://localhost/",
    defaultJSExtensions: true,
    transpiler: "babel",
    babelOptions: {
        "optional": [
            "runtime"
        ]
    },
    paths: {
        "github:*": "jspm_packages/github/*",
        "npm:*": "jspm_packages/npm/*"
    },

    map: {
        "angular": "github:angular/bower-angular@1.6.4",
        "angular-mocks": "npm:angular-mocks@1.6.4",
        "angular-ui-router": "github:angular-ui/ui-router@0.3.2",
        "angularjs-datepicker": "npm:angularjs-datepicker@2.1.19",
        "babel": "npm:babel-core@5.8.38",
        "babel-runtime": "npm:babel-runtime@5.8.38",
        "capaj/systemjs-hot-reloader": "github:alexisvincent/systemjs-hot-reloader@0.5.9",
        "core-js": "npm:core-js@1.2.7",
        "css": "github:systemjs/plugin-css@0.1.33",
        "normalize.css": "github:necolas/normalize.css@3.0.3",
        "text": "github:systemjs/plugin-text@0.0.2",
        "github:alexisvincent/systemjs-hot-reloader@0.5.9": {
            "debug": "npm:debug@2.6.6",
            "socket.io-client": "github:socketio/socket.io-client@1.7.4",
            "weakee": "npm:weakee@1.0.0"
        },
        "github:angular-ui/ui-router@0.3.2": {
            "angular": "github:angular/bower-angular@1.6.4"
        },
        "github:jspm/nodelibs-assert@0.1.0": {
            "assert": "npm:assert@1.4.1"
        },
        "github:jspm/nodelibs-buffer@0.1.1": {
            "buffer": "npm:buffer@5.0.6"
        },
        "github:jspm/nodelibs-path@0.1.0": {
            "path-browserify": "npm:path-browserify@0.0.0"
        },
        "github:jspm/nodelibs-process@0.1.2": {
            "process": "npm:process@0.11.10"
        },
        "github:jspm/nodelibs-util@0.1.0": {
            "util": "npm:util@0.10.3"
        },
        "github:jspm/nodelibs-vm@0.1.0": {
            "vm-browserify": "npm:vm-browserify@0.0.4"
        },
        "github:necolas/normalize.css@3.0.3": {
            "css": "github:systemjs/plugin-css@0.1.33"
        },
        "npm:assert@1.4.1": {
            "assert": "github:jspm/nodelibs-assert@0.1.0",
            "buffer": "github:jspm/nodelibs-buffer@0.1.1",
            "process": "github:jspm/nodelibs-process@0.1.2",
            "util": "npm:util@0.10.3"
        },
        "npm:babel-runtime@5.8.38": {
            "process": "github:jspm/nodelibs-process@0.1.2"
        },
        "npm:buffer@5.0.6": {
            "base64-js": "npm:base64-js@1.2.0",
            "ieee754": "npm:ieee754@1.1.8"
        },
        "npm:core-js@1.2.7": {
            "fs": "github:jspm/nodelibs-fs@0.1.2",
            "path": "github:jspm/nodelibs-path@0.1.0",
            "process": "github:jspm/nodelibs-process@0.1.2",
            "systemjs-json": "github:systemjs/plugin-json@0.1.2"
        },
        "npm:debug@2.6.6": {
            "ms": "npm:ms@0.7.3"
        },
        "npm:inherits@2.0.1": {
            "util": "github:jspm/nodelibs-util@0.1.0"
        },
        "npm:path-browserify@0.0.0": {
            "process": "github:jspm/nodelibs-process@0.1.2"
        },
        "npm:process@0.11.10": {
            "assert": "github:jspm/nodelibs-assert@0.1.0",
            "fs": "github:jspm/nodelibs-fs@0.1.2",
            "vm": "github:jspm/nodelibs-vm@0.1.0"
        },
        "npm:util@0.10.3": {
            "inherits": "npm:inherits@2.0.1",
            "process": "github:jspm/nodelibs-process@0.1.2"
        },
        "npm:vm-browserify@0.0.4": {
            "indexof": "npm:indexof@0.0.1"
        }
    }
});
