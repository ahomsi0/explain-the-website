package fetcher

import (
	"context"
	"fmt"
	"io"
	"net"
	"net/http"
	"net/url"
	"strings"
	"time"
)

// FetchHTML retrieves the raw HTML of the given URL.
func FetchHTML(ctx context.Context, targetURL string, maxBytes int64) (string, error) {
	if err := validateNoSSRF(targetURL); err != nil {
		return "", err
	}

	client := &http.Client{
		Timeout: 15 * time.Second,
		CheckRedirect: func(req *http.Request, via []*http.Request) error {
			if len(via) >= 5 {
				return fmt.Errorf("too many redirects — the site may require a login")
			}
			return nil
		},
	}

	req, err := http.NewRequestWithContext(ctx, http.MethodGet, targetURL, nil)
	if err != nil {
		return "", fmt.Errorf("could not build request: %w", err)
	}

	// Identify as a browser to improve compatibility with sites that check User-Agent.
	req.Header.Set("User-Agent", "Mozilla/5.0 (compatible; ExplainWebsite/1.0; +https://explainthewebsite.dev)")
	req.Header.Set("Accept", "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8")
	req.Header.Set("Accept-Language", "en-US,en;q=0.9")

	resp, err := client.Do(req)
	if err != nil {
		return "", friendlyFetchError(err)
	}
	defer resp.Body.Close()

	if err := friendlyStatusError(resp.StatusCode, targetURL); err != nil {
		return "", err
	}

	ct := resp.Header.Get("Content-Type")
	if ct != "" && !strings.Contains(ct, "text/html") && !strings.Contains(ct, "application/xhtml") {
		return "", fmt.Errorf("this URL doesn't serve a web page (Content-Type: %s) — try the homepage instead", ct)
	}

	body, err := io.ReadAll(io.LimitReader(resp.Body, maxBytes))
	if err != nil {
		return "", fmt.Errorf("failed reading page content: %w", err)
	}

	return string(body), nil
}

// friendlyStatusError maps HTTP status codes to plain-English messages.
func friendlyStatusError(status int, targetURL string) error {
	switch {
	case status == 200 || (status >= 200 && status < 300):
		return nil // success

	case status == 301 || status == 302 || status == 303 || status == 307 || status == 308:
		// Shouldn't happen since we follow redirects, but just in case.
		return fmt.Errorf("the site redirected too many times — it may require a login")

	case status == 401 || status == 403:
		return fmt.Errorf("access denied (HTTP %d) — this site blocks automated requests", status)

	case status == 404:
		return fmt.Errorf("page not found (404) — check the URL and try again")

	case status == 429:
		return fmt.Errorf("rate limited (429) — this site is blocking too many requests, try again in a moment")

	case status == 999:
		// LinkedIn's custom bot-blocking code.
		return fmt.Errorf("this site actively blocks automated requests (HTTP 999) — LinkedIn, Instagram, and similar platforms do not allow analysis")

	case status >= 500:
		return fmt.Errorf("the target site returned a server error (HTTP %d) — it may be temporarily down", status)

	case status >= 400:
		return fmt.Errorf("the site returned HTTP %d — the page may require authentication or doesn't exist", status)

	default:
		return fmt.Errorf("unexpected HTTP status %d", status)
	}
}

// friendlyFetchError translates low-level network errors into readable messages.
func friendlyFetchError(err error) error {
	msg := err.Error()
	switch {
	case isTimeout(err):
		return fmt.Errorf("the site took too long to respond (timeout) — it may be slow or blocking requests")
	case strings.Contains(msg, "no such host"):
		return fmt.Errorf("domain not found — check the URL spelling and try again")
	case strings.Contains(msg, "connection refused"):
		return fmt.Errorf("connection refused — the site may be down or blocking requests")
	case strings.Contains(msg, "too many redirects"):
		return fmt.Errorf("too many redirects — this site may require a login to view")
	case strings.Contains(msg, "certificate"):
		return fmt.Errorf("SSL certificate error — the site has an invalid security certificate")
	default:
		return fmt.Errorf("could not reach the site: %s", msg)
	}
}

func isTimeout(err error) bool {
	if netErr, ok := err.(net.Error); ok && netErr.Timeout() {
		return true
	}
	msg := err.Error()
	return strings.Contains(msg, "context deadline exceeded") ||
		strings.Contains(msg, "context canceled") ||
		strings.Contains(msg, "timeout")
}

// validateNoSSRF rejects requests targeting private/loopback IP ranges.
func validateNoSSRF(rawURL string) error {
	u, err := url.Parse(rawURL)
	if err != nil {
		return fmt.Errorf("invalid URL")
	}

	host := u.Hostname()
	addrs, err := net.LookupHost(host)
	if err != nil {
		return nil // DNS failure will surface naturally during the fetch
	}

	for _, addr := range addrs {
		ip := net.ParseIP(addr)
		if ip == nil {
			continue
		}
		if isPrivateIP(ip) {
			return fmt.Errorf("requests to private or internal addresses are not allowed")
		}
	}
	return nil
}

func isPrivateIP(ip net.IP) bool {
	for _, cidr := range []string{"10.0.0.0/8", "172.16.0.0/12", "192.168.0.0/16", "127.0.0.0/8", "::1/128", "fc00::/7"} {
		_, network, err := net.ParseCIDR(cidr)
		if err != nil {
			continue
		}
		if network.Contains(ip) {
			return true
		}
	}
	return false
}
