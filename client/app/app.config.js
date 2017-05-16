/**
 * Created by nidheeshdas on 13/05/17.
 */

function customHttpInterceptor() {
    return {
        // optional method
        'request': function (config) {
            // do something on success
            if (config.url.indexOf('/api/') > -1) {
                var BASE_URL = 'https://dash-mum.bluetokaicoffee.com';
                config.url = BASE_URL + config.url;
                var authParts = Object.keys(window.api_params).map(k => k + '=' + window.api_params[k]).join('&');
                if (config.url.indexOf('?') > -1) {
                    config.url += '&' + authParts;
                } else {
                    config.url += '?' + authParts;
                }
                console.log(config.url);
            }
            return config;
        },

    };

}

function conf($httpProvider) {
    $httpProvider.interceptors.push('customHttpInterceptor');
}

export default {
    customHttpInterceptor,
    conf: ['$httpProvider', conf]
}
