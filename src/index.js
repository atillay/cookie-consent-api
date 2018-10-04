import Cookies from 'js-cookie';
import EventEmitter from 'events';

class CookieConsentApi extends EventEmitter
{
    constructor(conf = {})
    {
        super();

        const defaultConf = {
            cookieName: 'cookie_consent_settings',
            cookieDuration: 365,
            cookieDomain: null,
            services: []
        };

        // Merge default config with user config
        this._conf = Object.assign({}, defaultConf, conf);

        // Console log errors if conf is invalid
        this._validateConf();

        // Replace dom elements based on cookie consent value
        this._updateView();
    }

    reset()
    {
        Cookies.remove(this._conf.cookieName, {domain: this._conf.cookieDomain});
        this._updateView();
        this.emit('clear');
    }

    acceptAll()
    {
        let cookieServices = {};
        this._conf.services.forEach(service => cookieServices[service] = true);

        this._setCookieServices(cookieServices);
        this._updateView();
        this.emit('allConfigured');
    }

    accept(service)
    {
        let cookieServices = this._getCookieServices();
        cookieServices[service] = true;

        this._setCookieServices(cookieServices);
        this._updateView();
        this.emit('accept', service);

        if (this.isAllConfigured()) this.emit('allConfigured');
    }

    refuse(service)
    {
        let cookieServices = this._getCookieServices();
        cookieServices[service] = false;

        this._setCookieServices(cookieServices);
        this._updateView();
        this.emit('refuse', service);

        if (this.isAllConfigured()) this.emit('allConfigured');
    }

    isAllConfigured()
    {
        const cookieServices = this._getCookieServices();
        let isAllConfigured = true;

        this._conf.services.forEach(service => {
            if (cookieServices[service] === undefined) isAllConfigured = false;
        });

        return isAllConfigured;
    }

    isConfigured(service)
    {
        const cookieServices = this._getCookieServices();
        return cookieServices[service] !== undefined;
    }
    
    isAccepted(service)
    {
        const cookieServices = this._getCookieServices();
        return cookieServices[service] !== undefined && cookieServices[service] === true;
    }

    isRefused(service)
    {
        const cookieServices = this._getCookieServices();
        return cookieServices[service] !== undefined && cookieServices[service] === false;
    }

    getServices()
    {
        return this._conf.services;
    }

    _getCookieServices()
    {
        return Cookies.getJSON(this._conf.cookieName) || {};
    }

    _setCookieServices(cookieServices)
    {
        Cookies.set(this._conf.cookieName, cookieServices, {
            duration: this._conf.cookieDuration,
            domain: this._conf.cookieDomain
        });
    }

    _validateConf()
    {
        // Services
        if (!Array.isArray(this._conf.services)) {
            console.error('CCM: Services is not an array')
        }
        else {
            this._conf.services.forEach(service => {
                if (/^[a-zA-Z0-9]+$/.test(service) === false) {
                    console.error('CCM: "' + service + '" is not a valid service name, only alphanumeric allowed');
                }
            });
        }
    }

    _updateView()
    {
        const cookieServices = this._getCookieServices();

        this._conf.services.forEach(service => {

            const elems = document.querySelectorAll('[data-cookie-consent="' + service + '"]');

            // Service is accepted in cookie
            if (cookieServices[service] === true) {
                elems.forEach(elem => {
                    if (!elem.getAttribute('data-ccm-fallback')) {
                        elem.setAttribute('data-ccm-fallback', elem.innerHTML);
                    }
                    var match = elem.innerHTML.match(new RegExp('\<\!--if-consent(.*?)endif--\>', 's'));
                    if (match && match.length == 2) {
                        elem.innerHTML = match[1];
                        this._executeScripts(elem);
                    }
                })
            }

            // Service is refused in cookie
            else {
                elems.forEach(elem => {
                    let fallbackContent = elem.getAttribute('data-ccm-fallback');
                    if (fallbackContent) {
                        elem.innerHTML = fallbackContent;
                        this._executeScripts(elem);
                    }
                });
            }

        });
    }

    _executeScripts(elem)
    {
        const scriptsDom = elem.querySelectorAll('script');
        scriptsDom.forEach(function(scriptDom) {
            let script = document.createElement('script');
            script.innerHTML = scriptDom.innerHTML;
            scriptDom.remove();
            elem.append(script);
        })
    }
}

export default CookieConsentApi;
