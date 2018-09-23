import Cookies from 'js-cookie';
import EventEmitter from 'events';

export default class CookieConsentApi extends EventEmitter
{
    constructor(conf = {})
    {
        super();

        const defaultConf = {
            cookieName: 'ccm',
            cookieDuration: 365,
            cookieDomain: null,
            services: []
        };

        // Merge default config with user config
        this.conf = Object.assign({}, defaultConf, conf);

        // Console log errors if conf is invalid
        this.validateConf();
    }

    init()
    {
        this.updateView();
        this.emit('init');
    }

    reset()
    {
        Cookies.remove(this.conf.cookieName, {domain: this.conf.cookieDomain});
        this.updateView();
        this.emit('clear');
    }

    acceptAll()
    {
        let cookieServices = {};
        this.conf.services.forEach(service => cookieServices[service] = true);
        Cookies.set(this.conf.cookieName, cookieServices, {
            duration: this.conf.cookieDuration,
            domain: this.conf.cookieDomain
        });
        this.updateView();
        this.emit('acceptAll');
    }

    accept(service)
    {
        let cookieServices = this.getCookieServices();
        cookieServices[service] = true;
        Cookies.set(this.conf.cookieName, cookieServices, {
            duration: this.conf.cookieDuration,
            domain: this.conf.cookieDomain
        });
        this.updateView();
        this.emit('accept', service);
    }

    refuse(service)
    {
        let cookieServices = this.getCookieServices();
        cookieServices[service] = false;
        Cookies.set(this.conf.cookieName, cookieServices, {
            duration: this.conf.cookieDuration,
            domain: this.conf.cookieDomain
        });
        this.updateView();
        this.emit('refuse', service);
    }


    validateConf()
    {
        // Services
        if (!Array.isArray(this.conf.services)) {
            console.error('CCM: Services is not an array')
        }
        else {
            this.conf.services.forEach(service => {
                if (/^[a-zA-Z0-9]+$/.test(service) === false) {
                    console.error('CCM: "' + service + '" is not a valid service name, only alphanumeric allowed');
                }
            });
        }
    }

    getCookieServices()
    {
        return Cookies.getJSON(this.conf.cookieName) || {};
    }

    updateView()
    {
        const cookieServices = this.getCookieServices();

        this.conf.services.forEach(service => {

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
                        this.executeScripts(elem);
                    }
                })
            }

            // Service is refused in cookie
            else {
                elems.forEach(elem => {
                    let fallbackContent = elem.getAttribute('data-ccm-fallback');
                    if (fallbackContent) {
                        elem.innerHTML = fallbackContent;
                        this.executeScripts(elem);
                    }
                });
            }

        });
    }

    // HACK to execute scripts
    executeScripts(elem)
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
