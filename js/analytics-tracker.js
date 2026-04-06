// Digital Pedia - Custom Analytics Tracker
// Self-contained analytics without external dependencies
(function() {
    var TRACKER_KEY = 'dp_analytics';
    
    function getEvents() {
        try { return JSON.parse(localStorage.getItem(TRACKER_KEY) || '[]'); } 
        catch(e) { return []; }
    }
    
    function saveEvents(events) {
        try { localStorage.setItem(TRACKER_KEY, JSON.stringify(events)); } catch(e) {}
    }
    
    function trackEvent(type, data) {
        var events = getEvents();
        events.push({
            type: type,
            url: window.location.href,
            referrer: document.referrer,
            timestamp: Date.now(),
            date: new Date().toISOString(),
            userAgent: navigator.userAgent.substring(0, 80),
            screen: screen.width + 'x' + screen.height,
            utm_source: new URLSearchParams(window.location.search).get('utm_source') || '',
            utm_medium: new URLSearchParams(window.location.search).get('utm_medium') || '',
            utm_campaign: new URLSearchParams(window.location.search).get('utm_campaign') || '',
            page: window.location.pathname,
            title: document.title,
            data: data || {}
        });
        saveEvents(events);
    }
    
    // Detect traffic source
    function getSource() {
        var params = new URLSearchParams(window.location.search);
        var src = params.get('utm_source');
        if (src) return src;
        var ref = document.referrer.toLowerCase();
        if (ref.indexOf('reddit') > -1) return 'reddit';
        if (ref.indexOf('twitter') > -1 || ref.indexOf('x.com') > -1) return 'twitter';
        if (ref.indexOf('facebook') > -1) return 'facebook';
        if (ref.indexOf('google') > -1) return 'google';
        if (ref.indexOf('producthunt') > -1) return 'producthunt';
        if (ref.indexOf('indiehackers') > -1) return 'indiehackers';
        if (ref.indexOf('hackernews') > -1 || ref.indexOf('news.ycombinator') > -1) return 'hackernews';
        if (ref.indexOf('quora') > -1) return 'quora';
        if (ref.indexOf('youtube') > -1) return 'youtube';
        if (ref.indexOf('linkedin') > -1) return 'linkedin';
        return 'direct';
    }
    
    // Track page view
    trackEvent('pageview', { source: getSource() });
    
    // Make track globally available
    window.dpTrack = function(type, data) { trackEvent(type, data); };
    
    // Auto-track CTA clicks
    document.addEventListener('DOMContentLoaded', function() {
        // Track all CTA buttons
        var ctas = document.querySelectorAll('.cta-btn, .hero-cta, .download-btn, a[href*="gumroad"], a[href*="paypal"], a[href*="buymeacoffee"]');
        ctas.forEach(function(el) {
            el.addEventListener('click', function() {
                trackEvent('cta_click', {
                    text: el.textContent.trim().substring(0, 50),
                    href: el.href || el.getAttribute('href'),
                    source: getSource()
                });
            });
        });
        
        // Track email form submissions
        var forms = document.querySelectorAll('form');
        forms.forEach(function(form) {
            form.addEventListener('submit', function(e) {
                var email = form.querySelector('input[type="email"]');
                trackEvent('email_capture', {
                    list: form.querySelector('select').value || form.id || 'general',
                    has_email: !!email,
                    source: getSource()
                });
            });
        });
        
        // Track download clicks
        var downloads = document.querySelectorAll('a[href$=".pdf"], a[href$=".zip"], a[download]');
        downloads.forEach(function(el) {
            el.addEventListener('click', function() {
                var file = (el.href || '').split('/').pop();
                trackEvent('download', { file: file, source: getSource() });
            });
        });
        
        // Track scroll depth
        var scrollDepths = { 25: false, 50: false, 75: false, 100: false };
        window.addEventListener('scroll', function() {
            var scroll = (window.scrollY + window.innerHeight) / document.documentElement.scrollHeight * 100;
            for (var d in scrollDepths) {
                if (!scrollDepths[d] && scroll >= d) {
                    scrollDepths[d] = true;
                    trackEvent('scroll_depth', { depth: d, source: getSource() });
                }
            }
        }, { passive: true });
        
        // Track time on page (30s, 1m, 3m, 5m)
        var timeMilestones = [30000, 60000, 180000, 300000];
        var timesTracked = {};
        timeMilestones.forEach(function(ms) {
            setTimeout(function() {
                trackEvent('time_on_page', { seconds: ms/1000, source: getSource() });
            }, ms);
        });
    });
    
    console.log('Digital Pedia Analytics tracker loaded. Events stored in localStorage[' + TRACKER_KEY + ']');
})();
