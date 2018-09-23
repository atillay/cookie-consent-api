# cookie-consent-api
A flexible JS API to manage cookie consent for GDPR

## Features and Usage
> This is a work in progress, it has not been tested in production

### Usage
```javascript
document.addEventListener('DOMContentLoaded', function() {
    const cookieConsentApi = new CookieConsentApi({
        cookieName: 'ccm', // optional
        cookieDuration: 365, // optional
        services: ['googleAnalytics', 'googleMaps', 'youtube'] // required   
    });
    cookieConsentApi.init();
});
```

### Actions
- cookieConsentApi.accept('serviceName');
- cookieConsentApi.refuse('serviceName');
- cookieConsentApi.acceptAll();
- cookieConsentApi.clear();


### Events:
Available events : `accept`, `refuse`, `acceptAll`, `init`, `reset`
```javascript
cookieConsentApi.on('accept', function(service) {
        console.log('User accepted cookies for service: ' + service)
});
```

### Automatic insert / remove dom element :
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
