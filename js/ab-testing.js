/**
 * Digital Pedia A/B Testing Framework
 * Client-side split testing for a static GitHub Pages site.
 * Persists variant assignments in localStorage for consistency.
 * Tracks conversions and stores results for later analysis.
 */
(function() {
    'use strict';

    var AB_CONFIG = {
        experiments: {
            headline: {
                name: 'Hero Headline Test',
                storageKey: 'ab_headline_variant',
                weight: function() {
                    // Run on 100% of visitors
                    return Math.random() < 1.0;
                },
                variants: {
                    A: {
                        name: 'Original - Product-focused',
                        h1: 'AI-Powered Products for Ambitious Solopreneurs',
                        subtitle: '50 copy-paste workflows, 25 templates, and 30 visual frameworks — everything you need to launch and scale your digital product business.'
                    },
                    B: {
                        name: 'Benefit-focused headline',
                        h1: 'Save 10+ Hours Every Week With Ready-Made AI Workflows',
                        subtitle: 'Stop building from scratch. Get battle-tested AI workflows, templates, and frameworks used by 500+ solopreneurs.'
                    },
                    C: {
                        name: 'Pain-point headline',
                        h1: "Tired of Starting From Scratch? Here's Your Shortcut",
                        subtitle: 'Every AI workflow, template, and framework you need — tested and ready to deploy. Build your first digital product this weekend.'
                    },
                    D: {
                        name: 'Results-focused headline',
                        h1: 'Launch Your Digital Product Business in 48 Hours',
                        subtitle: '50 AI workflows. 25 business templates. 30 visual frameworks. Everything included for the price of one dinner out.'
                    }
                }
            },
            cta_button: {
                name: 'CTA Button Copy & Style Test',
                storageKey: 'ab_cta_variant',
                weight: function() {
                    return Math.random() < 1.0;
                },
                variants: {
                    A: {
                        name: 'Original - Get Started',
                        text: 'Get Started',
                        classes: 'hero-cta'
                    },
                    B: {
                        name: 'Value-focused',
                        text: 'Get 50+ AI Workflows Now',
                        classes: 'hero-cta'
                    },
                    C: {
                        name: 'Urgency-focused with color change',
                        text: 'Start Building Today — Limited Pricing',
                        classes: 'hero-cta cta-variant-urgent'
                    },
                    D: {
                        name: 'Direct action',
                        text: 'Download Free Starter Kit',
                        classes: 'hero-cta cta-variant-free'
                    }
                }
            },
            pricing_layout: {
                name: 'Pricing Card Layout Test',
                storageKey: 'ab_pricing_variant',
                weight: function() {
                    return Math.random() < 1.0;
                },
                variants: {
                    A: {
                        name: 'Original layout'
                    },
                    B: {
                        name: 'Bundle-first layout',
                        apply: function() {
                            // Move bundle section above individual products
                            var bundle = document.querySelector('.bundle');
                            var products = document.querySelector('.products');
                            if (bundle && products && products.parentNode) {
                                products.parentNode.insertBefore(bundle, products);
                            }
                        }
                    },
                    C: {
                        name: 'Comparison table layout',
                        apply: function() {
                            var products = document.querySelector('.products-grid');
                            if (!products) return;
                            products.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:1rem;"><h3 style="margin-bottom:1.5rem;font-size:1.5rem;">Compare Our Products</h3>' +
                                '<table style="width:100%;max-width:900px;margin:0 auto;border-collapse:collapse;text-align:left;font-size:0.9rem;">' +
                                '<thead><tr style="border-bottom:2px solid #6366f1;">' +
                                '<th style="padding:12px;">Feature</th>' +
                                '<th style="padding:12px;">AI Workflow Cheatsheet</th>' +
                                '<th style="padding:12px;">Solopreneur Template Pack</th>' +
                                '<th style="padding:12px;">Visual Frameworks Bundle</th>' +
                                '</tr></thead>' +
                                '<tbody>' +
                                '<tr style="border-bottom:1px solid #e2e8f0;"><td style="padding:10px;">Ready-made workflows</td><td style="padding:10px;text-align:center;">50</td><td style="padding:10px;text-align:center;">25</td><td style="padding:10px;text-align:center;">30</td></tr>' +
                                '<tr style="border-bottom:1px solid #e2e8f0;"><td style="padding:10px;">Format</td><td style="padding:10px;text-align:center;">PDF</td><td style="padding:10px;text-align:center;">Notion</td><td style="padding:10px;text-align:center;">PDF</td></tr>' +
                                '<tr style="border-bottom:1px solid #e2e8f0;"><td style="padding:10px;">Video guides</td><td style="padding:10px;text-align:center;">Included</td><td style="padding:10px;text-align:center;">—</td><td style="padding:10px;text-align:center;">Included</td></tr>' +
                                '<tr style="border-bottom:1px solid #e2e8f0;"><td style="padding:10px;">Price</td><td style="padding:10px;text-align:center;font-weight:700;color:#6366f1;">$19</td><td style="padding:10px;text-align:center;font-weight:700;color:#6366f1;">$14</td><td style="padding:10px;text-align:center;font-weight:700;color:#6366f1;">$17</td></tr>' +
                                '</tbody></table></div>' +
                                '<div style="grid-column:1/-1;text-align:center;margin-top:1rem;">' +
                                '<a href="#bundle-section" class="btn btn-solid" style="font-size:1.1rem;padding:1rem 2.5rem;">Get the Complete Bundle — Save 40%</a>' +
                                '</div>';
                        }
                    },
                    D: {
                        name: 'Tiered pricing layout',
                        apply: function() {
                            var products = document.querySelector('.products-grid');
                            if (!products) return;
                            products.innerHTML = '' +
                                '<div style="grid-column:1/-1;text-align:center;margin-bottom:1rem;"><h3 style="font-size:1.7rem;margin-bottom:0.5rem;">Choose Your Plan</h3><p style="color:#64748b;">Pick individual products or save with a bundle</p></div>' +
                                '<div class="tier-card" style="background:#fff;border:1px solid #e2e8f0;border-radius:16px;padding:2rem;text-align:center;">' +
                                '<h3 style="color:#64748b;font-size:0.9rem;text-transform:uppercase;letter-spacing:0.05em;">Starter</h3>' +
                                '<div style="font-size:2.5rem;font-weight:800;margin:1rem 0;">$19</div>' +
                                '<p style="color:#64748b;margin-bottom:1.5rem;">AI Solopreneur Cheatsheet</p>' +
                                '<ul style="list-style:none;padding:0;margin:0 0 1.5rem;text-align:left;">' +
                                '<li style="padding:0.4rem 0;border-bottom:1px solid #f1f5f9;">50 AI workflows</li>' +
                                '<li style="padding:0.4rem 0;border-bottom:1px solid #f1f5f9;">Step-by-step guides</li>' +
                                '<li style="padding:0.4rem 0;border-bottom:1px solid #f1f5f9;">Video walkthroughs</li>' +
                                '</ul>' +
                                '<a href="#products" class="btn btn-outline" style="display:block;text-decoration:none;">Choose Starter</a>' +
                                '</div>' +
                                '<div class="tier-card" style="background:linear-gradient(135deg,#6366f1,#9333ea);color:#fff;border:2px solid #6366f1;border-radius:16px;padding:2rem;text-align:center;position:relative;">' +
                                '<div style="position:absolute;top:-12px;left:50%;transform:translateX(-50%);background:#fbbf24;color:#000;padding:0.25rem 1rem;border-radius:50px;font-size:0.7rem;font-weight:700;">MOST POPULAR</div>' +
                                '<h3 style="color:rgba(255,255,255,0.8);font-size:0.9rem;text-transform:uppercase;letter-spacing:0.05em;">Complete Bundle</h3>' +
                                '<div style="font-size:2.5rem;font-weight:800;margin:1rem 0;">$39</div>' +
                                '<p style="color:rgba(255,255,255,0.8);margin-bottom:1.5rem;">Everything + Future Updates Free</p>' +
                                '<ul style="list-style:none;padding:0;margin:0 0 1.5rem;text-align:left;">' +
                                '<li style="padding:0.4rem 0;border-bottom:1px solid rgba(255,255,255,0.15);">All individual products</li>' +
                                '<li style="padding:0.4rem 0;border-bottom:1px solid rgba(255,255,255,0.15);">Free lifetime updates</li>' +
                                '<li style="padding:0.4rem 0;border-bottom:1px solid rgba(255,255,255,0.15);">Priority support</li>' +
                                '<li style="padding:0.4rem 0;border-bottom:1px solid rgba(255,255,255,0.15);">Save 40%</li>' +
                                '</ul>' +
                                '<a href="#bundle-section" class="btn" style="display:block;text-decoration:none;background:#fff;color:#6366f1;font-weight:700;">Get the Bundle</a>' +
                                '</div>' +
                                '<div class="tier-card" style="background:#fff;border:1px solid #e2e8f0;border-radius:16px;padding:2rem;text-align:center;">' +
                                '<h3 style="color:#64748b;font-size:0.9rem;text-transform:uppercase;letter-spacing:0.05em;">Templates Pack</h3>' +
                                '<div style="font-size:2.5rem;font-weight:800;margin:1rem 0;">$14</div>' +
                                '<p style="color:#64748b;margin-bottom:1.5rem;">Solopreneur Template Library</p>' +
                                '<ul style="list-style:none;padding:0;margin:0 0 1.5rem;text-align:left;">' +
                                '<li style="padding:0.4rem 0;border-bottom:1px solid #f1f5f9;">25 Notion templates</li>' +
                                '<li style="padding:0.4rem 0;border-bottom:1px solid #f1f5f9;">Business planning</li>' +
                                '<li style="padding:0.4rem 0;border-bottom:1px solid #f1f5f9;">Sales tracking</li>' +
                                '</ul>' +
                                '<a href="#products" class="btn btn-outline" style="display:block;text-decoration:none;">Choose Templates</a>' +
                                '</div>';
                            products.style.gridTemplateColumns = 'repeat(auto-fit, minmax(260px, 1fr))';
                        }
                    }
                }
            }
        }
    };

    // ---- Variant assignment (consistent via localStorage) ----
    function getVariant(experimentKey) {
        var stored = localStorage.getItem(experimentKey);
        if (stored) return stored;

        var experiment = AB_CONFIG.experiments[experimentKey];
        if (!experiment) return 'A';

        if (!experiment.weight()) {
            // Control group (no variant change, but we still track)
            localStorage.setItem(experimentKey, 'A');
            return 'A';
        }

        // Random assignment
        var variants = Object.keys(experiment.variants);
        var chosen = variants[Math.floor(Math.random() * variants.length)];
        localStorage.setItem(experimentKey, chosen);
        return chosen;
    }

    // ---- Apply experiment variants ----
    function applyHeadlineVariant(variant) {
        var variantData = AB_CONFIG.experiments.headline.variants[variant];
        if (!variantData) return;

        var h1 = document.querySelector('.hero h1');
        var subtitle = document.querySelector('.hero p');

        if (h1) h1.textContent = variantData.h1;
        if (subtitle) subtitle.textContent = variantData.subtitle;

        console.log('[A/B Test] Headline: variant ' + variant + ' — ' + variantData.name);
    }

    function applyCTAVariant(variant) {
        var variantData = AB_CONFIG.experiments.cta_button.variants[variant];
        if (!variantData) return;

        var heroCta = document.querySelector('.hero-cta');
        if (heroCta) {
            heroCta.textContent = variantData.text;
            if (variantData.classes) {
                // Remove old CTA variant classes
                heroCta.className = heroCta.className.replace(/cta-variant-\S+/g, '').trim();
                // Add new classes if different from base
                var extraClasses = variantData.classes.replace('hero-cta', '').trim();
                if (extraClasses) {
                    heroCta.className += ' ' + extraClasses;
                }
            }
        }

        console.log('[A/B Test] CTA: variant ' + variant + ' — ' + variantData.name);
    }

    function applyPricingVariant(variant) {
        var variantData = AB_CONFIG.experiments.pricing_layout.variants[variant];
        if (!variantData || !variantData.apply) return;

        variantData.apply();
        console.log('[A/B Test] Pricing: variant ' + variant + ' — ' + variantData.name);
    }

    // ---- Conversion tracking ----
    function trackConversion(eventType, details) {
        var conversions = JSON.parse(localStorage.getItem('ab_conversions') || '[]');
        conversions.push({
            event: eventType,
            headline: getVariant('headline'),
            cta: getVariant('cta_button'),
            pricing: getVariant('pricing_layout'),
            timestamp: new Date().toISOString(),
            details: details || {},
            url: window.location.href,
            referrer: document.referrer || 'direct'
        });
        localStorage.setItem('ab_conversions', JSON.stringify(conversions));
    }

    // Track clicks on buy buttons as conversion signals
    function setupConversionTracking() {
        document.addEventListener('click', function(e) {
            var target = e.target;
            // Track PayPal buy button clicks
            if (target.closest('.paypal-buy-btn, .btn-solid, .btn-outline') ||
                target.closest('#download-bundle, .hero-cta') ||
                target.getAttribute('data-conversion')) {
                var btn = target.closest('.paypal-buy-btn, .btn-solid, .btn-outline, a[href*="paypal.com"], .hero-cta');
                trackConversion('cta_click', {
                    button_text: btn ? (btn.textContent || 'unknown').trim().substring(0, 100) : 'unknown',
                    section: btn ? (btn.closest('section, .hero, .bundle, .products') || {}).tagName || 'unknown' : 'unknown'
                });
            }
            // Track email sign-ups
            if (target.closest('#capture-email') || (target.tagName === 'BUTTON' && target.textContent.toLowerCase().indexOf('get free') > -1)) {
                trackConversion('email_signup', {
                    source: 'email_capture'
                });
            }
        });

        // Track form submissions
        document.addEventListener('submit', function(e) {
            var form = e.target;
            if (form.id === 'email-form' || form.id === 'capture-email' || form.querySelector('#capture-email')) {
                trackConversion('email_submit', {
                    form_id: form.id,
                    fields_count: form.querySelectorAll('input,select,textarea').length
                });
            }
        });
    }

    // ---- Add custom styles for CTA variants ----
    function injectTestStyles() {
        var style = document.createElement('style');
        style.textContent = '' +
            '.cta-variant-urgent { background: #ef4444 !important; animation: pulse-cta 2s infinite; }' +
            '.cta-variant-urgent:hover { background: #dc2626 !important; }' +
            '.cta-variant-free { background: #10b981 !important; }' +
            '.cta-variant-free:hover { background: #059669 !important; }' +
            '@keyframes pulse-cta { 0%,100% { transform: scale(1); } 50% { transform: scale(1.03); } }' +
            '.tier-card { transition: all 0.3s ease; }' +
            '.tier-card:hover { transform: translateY(-4px); box-shadow: 0 12px 30px rgba(0,0,0,0.1); }';
        document.head.appendChild(style);
    }

    // ---- Public API for retrieving results ----
    window.ABTest = {
        getVariant: getVariant,
        trackConversion: trackConversion,
        getResults: function() {
            var conversions = JSON.parse(localStorage.getItem('ab_conversions') || '[]');
            var results = { totalConversions: conversions.length, experiments: {} };

            for (var key in AB_CONFIG.experiments) {
                var exp = AB_CONFIG.experiments[key];
                results.experiments[key] = {
                    name: exp.name,
                    variants: {}
                };
                for (var v in exp.variants) {
                    var count = conversions.filter(function(c) { return c[key] === v; }).length;
                    results.experiments[key].variants[v] = {
                        name: exp.variants[v].name,
                        conversions: count
                    };
                }
            }
            return results;
        },
        getConfig: function() {
            return AB_CONFIG;
        }
    };

    // ---- Initialize ----
    function init() {
        injectTestStyles();
        setupConversionTracking();

        // Check URL params for forced variants (e.g., ?variant_headline=B&variant_cta=C)
        var params = new URLSearchParams(window.location.search);
        var forcedHeadline = params.get('variant_headline');
        var forcedCTA = params.get('variant_cta');
        var forcedPricing = params.get('variant_pricing');
        
        var headlineVariant = forcedHeadline && AB_CONFIG.experiments.headline.variants[forcedHeadline] ? forcedHeadline : getVariant('headline');
        var ctaVariant = forcedCTA && AB_CONFIG.experiments.cta_button.variants[forcedCTA] ? forcedCTA : getVariant('cta_button');
        var pricingVariant = forcedPricing && AB_CONFIG.experiments.pricing_layout.variants[forcedPricing] ? forcedPricing : getVariant('pricing_layout');
        
        // If forced via URL, store it
        if (forcedHeadline) localStorage.setItem('ab_headline_variant', forcedHeadline);
        if (forcedCTA) localStorage.setItem('ab_cta_variant', forcedCTA);
        if (forcedPricing) localStorage.setItem('ab_pricing_variant', forcedPricing);

        if (headlineVariant !== 'A') {
            applyHeadlineVariant(headlineVariant);
        }
        if (ctaVariant !== 'A') {
            applyCTAVariant(ctaVariant);
        }
        if (pricingVariant !== 'A') {
            applyPricingVariant(pricingVariant);
        }

        // Track page view with variant info
        trackConversion('page_view', {
            headline: headlineVariant,
            cta: ctaVariant,
            pricing: pricingVariant
        });

        console.log('[A/B Test] Active variants — Headline: ' + headlineVariant + ', CTA: ' + ctaVariant + ', Pricing: ' + pricingVariant);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
