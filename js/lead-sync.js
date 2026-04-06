/**
 * Digital Pedia - Lead Capture Sync Script
 * 
 * Syncs localStorage-captured leads to the delivery API backend.
 * Also captures new signups server-side in real-time.
 * 
 * The API endpoint must be updated in production to your actual domain.
 * For now it falls back to localStorage-only on production (GitHub Pages).
 */
(function() {
    // API endpoint - update this to your deployed API URL
    var LEAD_API_URL = window.location.hostname === '127.0.0.1' || window.location.hostname === 'localhost'
        ? 'http://127.0.0.1:8000/api/leads/capture'
        : 'https://api.digitalpedia.com/api/leads/capture'; // <- UPDATE THIS IN PRODUCTION

    var USE_LOCAL_FALLBACK = true;

    // ---- Send lead to API (non-blocking) ----
    function sendLeadToAPI(data) {
        try {
            navigator.sendBeacon(LEAD_API_URL, JSON.stringify(data));
        } catch(e) {
            // sendBeacon not supported, use XHR fallback
            var xhr = new XMLHttpRequest();
            xhr.open('POST', LEAD_API_URL, true);
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.send(JSON.stringify(data));
        }
    }

    // ---- Patch existing email forms to also POST to API ----
    function patchEmailForm(formId, inputId) {
        var form = document.getElementById(formId);
        if (!form) return;
        form.addEventListener('submit', function(e) {
            var email = document.getElementById(inputId);
            if (email && email.value && email.value.indexOf('@') > -1) {
                sendLeadToAPI({
                    email: email.value,
                    source: form.dataset.source || 'landing_page',
                    freebie: form.dataset.freebie || null,
                    page: window.location.pathname
                });
            }
        });
    }

    // ---- Patch freebie download forms ----
    function patchFreebieCards() {
        document.querySelectorAll('.freebie-capture button, .freebie-capture .btn').forEach(function(btn) {
            btn.addEventListener('click', function(e) {
                var card = e.target.closest('.freebie-card');
                var input = card ? card.querySelector('.freebie-email') : null;
                if (input && input.value && input.value.indexOf('@') > -1) {
                    sendLeadToAPI({
                        email: input.value,
                        source: 'freebie_download',
                        freebie: input.dataset.freebie || 'unknown',
                        page: 'landing'
                    });
                }
            });
        });
    }

    // ---- Sync old localStorage leads to API (one-time on load) ----
    function syncLocalLeads() {
        var keys = ['dp_signups', 'dp_visits'];
        try {
            keys.forEach(function(key) {
                var data = localStorage.getItem(key);
                if (data) {
                    var items = JSON.parse(data);
                    items.forEach(function(item) {
                        if (item.email) {
                            sendLeadToAPI({
                                email: item.email,
                                source: item.source || 'synced',
                                freebie: item.freebie || null,
                                page: item.page || 'landing'
                            });
                        }
                    });
                }
            });
        } catch(e) {}
    }

    // ---- Run patches when DOM is ready ----
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            patchEmailForm('email-capture-form', 'email-capture-input');
            patchEmailForm('exit-email-form', 'exit-email-input');
            patchFreebieCards();
            syncLocalLeads();
        });
    } else {
        patchEmailForm('email-capture-form', 'email-capture-input');
        patchEmailForm('exit-email-form', 'exit-email-input');
        patchFreebieCards();
        syncLocalLeads();
    }
})();
