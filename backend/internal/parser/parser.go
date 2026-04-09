package parser

import (
	"fmt"
	"net/url"
	"strings"
	"time"

	"github.com/ahomsi/explain-website/internal/model"
	"golang.org/x/net/html"
)

// Parse takes raw HTML and a source URL, runs all sub-analyses, and returns
// a complete AnalysisResult.
func Parse(rawHTML string, sourceURL string) (model.AnalysisResult, error) {
	if strings.TrimSpace(rawHTML) == "" {
		return model.AnalysisResult{}, fmt.Errorf("empty HTML response")
	}

	doc, err := html.Parse(strings.NewReader(rawHTML))
	if err != nil {
		return model.AnalysisResult{}, fmt.Errorf("failed to parse HTML: %w", err)
	}

	overview := extractOverview(doc, rawHTML)
	tech := detectTech(rawHTML)
	seoChecks := auditSEO(doc)
	ux := analyzeUX(doc, rawHTML)
	pageStats := computePageStats(doc, sourceURL)
	weakPoints, recommendations := generateRecommendations(seoChecks, ux)

	// Ensure slices are never null in JSON (always at least an empty array).
	if tech == nil {
		tech = []model.TechItem{}
	}
	if weakPoints == nil {
		weakPoints = []string{}
	}
	if recommendations == nil {
		recommendations = []string{}
	}

	return model.AnalysisResult{
		URL:             sourceURL,
		FetchedAt:       time.Now().UTC(),
		Overview:        overview,
		TechStack:       tech,
		SEOChecks:       seoChecks,
		UX:              ux,
		PageStats:       pageStats,
		WeakPoints:      weakPoints,
		Recommendations: recommendations,
	}, nil
}

// computePageStats collects structural metrics from the parsed HTML tree.
func computePageStats(doc *html.Node, sourceURL string) model.PageStats {
	stats := model.PageStats{}

	var sourceHost string
	if u, err := url.Parse(sourceURL); err == nil {
		sourceHost = u.Hostname()
	}

	var walk func(*html.Node)
	walk = func(n *html.Node) {
		if n.Type == html.ElementNode {
			tag := strings.ToLower(n.Data)
			switch tag {
			case "img":
				stats.ImageCount++
			case "script":
				if getAttr(n, "src") != "" || n.FirstChild != nil {
					stats.ScriptCount++
				}
			case "h1":
				stats.H1Count++
			case "h2":
				stats.H2Count++
			case "h3":
				stats.H3Count++
			case "a":
				href := getAttr(n, "href")
				if href == "" || strings.HasPrefix(href, "#") ||
					strings.HasPrefix(href, "mailto:") || strings.HasPrefix(href, "tel:") {
					break
				}
				if strings.HasPrefix(href, "/") || strings.HasPrefix(href, "./") || strings.HasPrefix(href, "../") {
					stats.InternalLinks++
				} else if u, err := url.Parse(href); err == nil && u.Host != "" {
					if u.Hostname() == sourceHost {
						stats.InternalLinks++
					} else {
						stats.ExternalLinks++
					}
				}
			}
		} else if n.Type == html.TextNode && n.Parent != nil {
			parentTag := strings.ToLower(n.Parent.Data)
			if parentTag != "script" && parentTag != "style" && parentTag != "noscript" {
				stats.WordCount += len(strings.Fields(n.Data))
			}
		}

		for c := n.FirstChild; c != nil; c = c.NextSibling {
			walk(c)
		}
	}
	walk(doc)

	return stats
}

// extractOverview pulls high-level page metadata from the parsed tree.
func extractOverview(doc *html.Node, rawHTML string) model.Overview {
	o := model.Overview{}

	var walk func(*html.Node)
	walk = func(n *html.Node) {
		if n.Type == html.ElementNode {
			tag := strings.ToLower(n.Data)

			switch tag {
			case "title":
				if n.FirstChild != nil && n.FirstChild.Type == html.TextNode {
					o.Title = strings.TrimSpace(n.FirstChild.Data)
				}
			case "html":
				lang := getAttr(n, "lang")
				if lang != "" {
					// Normalise to language code only (e.g. "en-US" → "en").
					parts := strings.SplitN(lang, "-", 2)
					o.Language = parts[0]
				}
			case "meta":
				name := strings.ToLower(getAttr(n, "name"))
				property := strings.ToLower(getAttr(n, "property"))
				content := getAttr(n, "content")

				if name == "description" && o.Description == "" {
					o.Description = content
				}
				if property == "og:description" && o.Description == "" {
					o.Description = content
				}
			case "link":
				rel := strings.ToLower(getAttr(n, "rel"))
				if (rel == "icon" || rel == "shortcut icon") && o.Favicon == "" {
					o.Favicon = getAttr(n, "href")
				}
			}
		}
		for c := n.FirstChild; c != nil; c = c.NextSibling {
			walk(c)
		}
	}
	walk(doc)

	// Estimate page weight as a proxy for load speed.
	size := len(rawHTML)
	switch {
	case size < 50_000:
		o.PageLoadHint = "lightweight"
	case size < 200_000:
		o.PageLoadHint = "medium"
	default:
		o.PageLoadHint = "heavy"
	}

	return o
}
