package parser

import (
	"regexp"
	"strings"

	"github.com/ahomsi/explain-website/internal/model"
	"golang.org/x/net/html"
)

// CTA keyword list — checked against the visible text of <a> and <button> elements.
var ctaKeywords = []string{
	"buy", "get started", "sign up", "signup", "try", "free trial",
	"start", "book", "order", "subscribe", "contact us", "learn more",
	"shop now", "get demo", "book a demo", "request demo", "download",
	"register", "join", "claim", "add to cart", "checkout", "get quote",
}

var socialProofKeywords = []string{
	"review", "testimonial", "rated", "customers", "clients", "trust pilot",
	"trustpilot", "verified", "stars", "rating", "★", "⭐", "g2 crowd", "capterra",
	"4.", "5.", "/5", "out of 5",
}

var trustKeywords = []string{
	"guarantee", "secure", "ssl", "certified", "award", "accredited",
	"privacy", "safe", "money back", "refund", "100%", "no risk", "verified",
}

var phoneRegex = regexp.MustCompile(`\+?[\d][\d\s\-\(\)]{7,}`)

// analyzeUX scans the HTML tree for conversion and UX signals.
func analyzeUX(doc *html.Node, rawHTML string) model.UXResult {
	result := model.UXResult{}

	walkUX(doc, &result)

	// Check for contact info via mailto/tel links (already captured in walkUX)
	// and also in raw HTML for phone numbers.
	lower := strings.ToLower(rawHTML)
	if phoneRegex.MatchString(lower) {
		result.HasContactInfo = true
	}

	// Trust signals: scan raw HTML for keywords (faster than tree walking).
	for _, kw := range trustKeywords {
		if strings.Contains(lower, kw) {
			result.HasTrustSignals = true
			break
		}
	}

	// Social proof: scan raw HTML.
	for _, kw := range socialProofKeywords {
		if strings.Contains(lower, kw) {
			result.HasSocialProof = true
			break
		}
	}

	return result
}

func walkUX(n *html.Node, result *model.UXResult) {
	if n.Type == html.ElementNode {
		tag := strings.ToLower(n.Data)

		switch tag {
		case "form":
			result.HasForms = true
			result.FormCount++

		case "a", "button":
			text := strings.ToLower(strings.TrimSpace(extractText(n)))
			for _, kw := range ctaKeywords {
				if strings.Contains(text, kw) {
					result.HasCTA = true
					result.CTACount++
					break
				}
			}
			// Detect contact info via href.
			if tag == "a" {
				href := strings.ToLower(getAttr(n, "href"))
				if strings.HasPrefix(href, "mailto:") || strings.HasPrefix(href, "tel:") {
					result.HasContactInfo = true
				}
			}

		case "meta":
			if strings.ToLower(getAttr(n, "name")) == "viewport" {
				result.MobileReady = true
			}
		}
	}

	for c := n.FirstChild; c != nil; c = c.NextSibling {
		walkUX(c, result)
	}
}

// extractText recursively collects all text content under a node.
func extractText(n *html.Node) string {
	if n.Type == html.TextNode {
		return n.Data
	}
	var sb strings.Builder
	for c := n.FirstChild; c != nil; c = c.NextSibling {
		sb.WriteString(extractText(c))
	}
	return sb.String()
}
