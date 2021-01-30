# cookie-consent-api
A flexible JS API to manage cookie consent for GDPR.  
The main idea is to easily enable or disable content on your app based on user consent.  
**Demo**: https://cookie-consent-api.alty.fr
> This is a work in progress, it has not been tested in production
> I would not recommend to put Google Analytics in the consent otherwise you will loose all stats for visitors that don't accept cookies

Available on NPM : `$ npm install @atillay/cookie-consent-api`

### Usage
Place at end of body before other scripts
```html
<script src="./cookie-consent-api.js"></script>
<script>
    const cookieConsent = new CookieConsentApi({
        cookieName: 'cookie_consent_settings', // optional
        cookieDuration: 365, // optional
        cookieDomain: 'localhost', // optional
        services: ['googleAnalytics', 'googleMaps', 'youtube'] // set a unique key for each service   
    });
</script>
```
You can check the `index.html` for a full usage example

### Automatic content switch if consent
```html 
<div data-cookie-consent="googleAnalytics">
    <!--if-consent
        <script>
            (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
                (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
                m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
            })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');
            ga('create', 'UA-XXXXX-Y', 'auto');
            ga('send', 'pageview');
            console.log('js executed');
        </script>
    endif-->
</div>
<div data-cookie-consent="youtube">
    <img src="https://img.youtube.com/vi/R4lZyXjGLRs/0.jpg">
    <!--if-consent  
        <iframe width="560" height="315" src="https://www.youtube.com/embed/R4lZyXjGLRs"></iframe>
    endif-->
</div>
```

### API methods

**Getters**
```javascript
cookieConsent.isAllConfigured(); /* all services are accepted or refused */ 
cookieConsent.isConfigured('serviceName'); /* service is accepted or refused */ 
cookieConsent.isAccepted('serviceName'); /* service is accepted */ 
cookieConsent.isRefused('serviceName'); /* service is refused */ 
cookieConsent.getServices(); /* returns services array from config */
```

**Setters**
```javascript
cookieConsent.accept('serviceName'); /* accept a service */
cookieConsent.refuse('serviceName'); /* refuse a service */
cookieConsent.acceptAll(); /* accept all services */
cookieConsent.refuseAll(); /* refuse all services */
cookieConsent.reset(); /* delete consent cookie */
```

**Events**
```javascript
cookieConsent.on('accept', function(service) { /* a service is accepted */ });
cookieConsent.on('refuse', function(service) { /* a service is refused */ });
cookieConsent.on('allConfigured', function() { /* all services configured */ });
cookieConsent.on('reset', function() { /* consent cookie deleted */ });
```
