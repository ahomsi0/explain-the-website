package parser

import (
	"strings"

	"github.com/ahomsi/explain-website/internal/model"
)

type techPattern struct {
	name       string
	category   string
	confidence string
	patterns   []string
	// requireAll: if true ALL patterns must match (AND logic) instead of any one
	requireAll bool
}

// techPatterns lists all detectable technologies with their HTML fingerprints.
var techPatterns = []techPattern{
	// CMS — use path/attribute signals only, never plain words
	{name: "WordPress", category: "cms", confidence: "high",
		patterns: []string{"/wp-content/", "/wp-includes/", "wp-json/wp/"}},
	{name: "Drupal", category: "cms", confidence: "high",
		patterns: []string{"drupal.js", "/sites/default/files/", "Drupal.settings"}},
	{name: "Joomla", category: "cms", confidence: "high",
		patterns: []string{"/media/jui/", "joomla!", "/components/com_"}},

	// Page builders / hosted
	{name: "Wix", category: "builder", confidence: "high",
		patterns: []string{"wix.com/", "static.parastorage.com", "wixstatic.com"}},
	{name: "Webflow", category: "builder", confidence: "high",
		patterns: []string{"webflow.com", "data-wf-page", "webflow.js"}},
	{name: "Squarespace", category: "builder", confidence: "high",
		patterns: []string{"squarespace.com", "static.squarespace.com"}},

	// E-commerce
	{name: "Shopify", category: "ecommerce", confidence: "high",
		patterns: []string{"cdn.shopify.com", "shopify.theme", "myshopify.com", "shopify-analytics"}},
	{name: "WooCommerce", category: "ecommerce", confidence: "high",
		// Require both a WooCommerce-specific JS signal AND a WordPress path to avoid false positives
		patterns: []string{"woocommerce", "/wc-api/", "wc_add_to_cart", "wc-block"}},
	{name: "BigCommerce", category: "ecommerce", confidence: "high",
		patterns: []string{"bigcommerce.com", "bigcommercecdn.com"}},
	{name: "Magento", category: "ecommerce", confidence: "high",
		patterns: []string{"x-magento-init", "mage/bootstrap", "mage.cookies", "mage-init"}},

	// JS Frameworks
	{name: "Next.js", category: "framework", confidence: "high",
		patterns: []string{"_next/static", "__NEXT_DATA__", "/_next/"}},
	{name: "Nuxt.js", category: "framework", confidence: "high",
		patterns: []string{"__nuxt", "/_nuxt/", "nuxt.js"}},
	{name: "React", category: "framework", confidence: "medium",
		patterns: []string{"react.production.min.js", "data-reactroot", "data-reactid", "__reactFiber", "react-dom"}},
	{name: "Vue", category: "framework", confidence: "medium",
		patterns: []string{"vue.min.js", "vue.runtime", "__vue__", "vue@"}},
	{name: "Angular", category: "framework", confidence: "medium",
		patterns: []string{"ng-version", "angular.min.js", "angular/core"}},
	{name: "Svelte", category: "framework", confidence: "high",
		patterns: []string{"__svelte", "svelte/"}},
	{name: "Gatsby", category: "framework", confidence: "high",
		patterns: []string{"___gatsby", "gatsby-chunk"}},
	{name: "Remix", category: "framework", confidence: "high",
		patterns: []string{"__remixContext", "remix-run"}},
	{name: "Astro", category: "framework", confidence: "high",
		patterns: []string{"astro-island", "astro-slot"}},

	// Analytics & Marketing
	{name: "Google Analytics 4", category: "analytics", confidence: "high",
		patterns: []string{"gtag/js?id=G-", "gtag('config', 'G-", `gtag("config", "G-`}},
	{name: "Google Analytics (UA)", category: "analytics", confidence: "high",
		patterns: []string{"google-analytics.com/analytics.js", "gtag('config', 'UA-", `gtag("config", "UA-`}},
	{name: "Google Tag Manager", category: "analytics", confidence: "high",
		patterns: []string{"googletagmanager.com/gtm.js", "googletagmanager.com/ns.html"}},
	{name: "Meta Pixel", category: "analytics", confidence: "high",
		patterns: []string{"connect.facebook.net/en_US/fbevents.js", "fbq('init'", `fbq("init"`}},
	{name: "HubSpot", category: "analytics", confidence: "high",
		patterns: []string{"js.hs-scripts.com", "js.hsforms.net", "js.hscta.net"}},
	{name: "Hotjar", category: "analytics", confidence: "high",
		patterns: []string{"static.hotjar.com", "script.hotjar.com"}},
	{name: "Intercom", category: "analytics", confidence: "high",
		patterns: []string{"widget.intercom.io", "intercomSettings"}},
	{name: "Segment", category: "analytics", confidence: "high",
		patterns: []string{"cdn.segment.com", "segment.io", "analytics.identify(", "analytics.track("}},
	{name: "Mixpanel", category: "analytics", confidence: "high",
		patterns: []string{"cdn.mxpnl.com", "mixpanel.com/libs", "mixpanel.init"}},
	{name: "Klaviyo", category: "analytics", confidence: "high",
		patterns: []string{"static.klaviyo.com", "klaviyo.com/media"}},
	{name: "Salesforce", category: "analytics", confidence: "high",
		patterns: []string{"pardot.com", "sfdcstatic.com", "force.com/resource"}},
	{name: "Zendesk", category: "analytics", confidence: "high",
		patterns: []string{"zdassets.com", "zendeskcdn.com", "static.zdassets.com"}},
	{name: "Stripe", category: "analytics", confidence: "high",
		patterns: []string{"js.stripe.com", "stripe.network", "stripe-js"}},
	{name: "Crisp Chat", category: "analytics", confidence: "high",
		patterns: []string{"client.crisp.chat", "crisp.chat/js"}},
	{name: "Tawk.to", category: "analytics", confidence: "high",
		patterns: []string{"embed.tawk.to", "tawk_api"}},

	// CDN / Infrastructure
	{name: "Cloudflare", category: "cdn", confidence: "medium",
		patterns: []string{"__cf_bm", "cloudflare.com/cdn-cgi", "cloudflareinsights.com"}},
	{name: "Amazon CloudFront", category: "cdn", confidence: "high",
		patterns: []string{"cloudfront.net"}},
	{name: "Akamai", category: "cdn", confidence: "high",
		patterns: []string{"akamaihd.net", "akamaized.net", "edgesuite.net"}},
	{name: "Fastly", category: "cdn", confidence: "high",
		patterns: []string{"fastly.net", "fastlylb.net"}},
	{name: "Vercel", category: "cdn", confidence: "high",
		patterns: []string{"vercel.app", "_vercel"}},
	{name: "Netlify", category: "cdn", confidence: "high",
		patterns: []string{"netlify.app", "netlify.com/js"}},
	{name: "jsDelivr", category: "cdn", confidence: "medium",
		patterns: []string{"cdn.jsdelivr.net"}},

	// UI Frameworks
	{name: "Bootstrap", category: "framework", confidence: "medium",
		patterns: []string{"bootstrap.min.css", "bootstrap.min.js", "bootstrap@"}},
	{name: "jQuery", category: "framework", confidence: "medium",
		patterns: []string{"jquery.min.js", "jquery-", "/jquery/"}},
	{name: "Tailwind CSS", category: "framework", confidence: "medium",
		patterns: []string{"tailwindcss", "cdn.tailwindcss.com"}},
	{name: "Alpine.js", category: "framework", confidence: "high",
		patterns: []string{"alpinejs", "cdn.jsdelivr.net/npm/alpinejs", "x-cloak"}},
	{name: "HTMX", category: "framework", confidence: "high",
		patterns: []string{"htmx.org", "unpkg.com/htmx"}},

	// Media / Embeds — correct category
	{name: "YouTube Embed", category: "media", confidence: "high",
		patterns: []string{"youtube.com/embed", "youtube-nocookie.com/embed"}},
	{name: "Vimeo Embed", category: "media", confidence: "high",
		patterns: []string{"player.vimeo.com/video", "vimeo.com/video"}},
}

// detectTech performs substring matching on the raw (lowercased) HTML string.
func detectTech(rawHTML string) []model.TechItem {
	lower := strings.ToLower(rawHTML)
	var found []model.TechItem
	seen := make(map[string]bool)

	for _, p := range techPatterns {
		if seen[p.name] {
			continue
		}
		matched := false
		if p.requireAll {
			matched = true
			for _, pat := range p.patterns {
				if !strings.Contains(lower, strings.ToLower(pat)) {
					matched = false
					break
				}
			}
		} else {
			for _, pat := range p.patterns {
				if strings.Contains(lower, strings.ToLower(pat)) {
					matched = true
					break
				}
			}
		}
		if matched {
			found = append(found, model.TechItem{
				Name:       p.name,
				Category:   p.category,
				Confidence: p.confidence,
			})
			seen[p.name] = true
		}
	}
	return found
}
