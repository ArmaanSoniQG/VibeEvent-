from playwright.sync_api import sync_playwright
import csv
import random
import time

def scrape_luma_events():
    url = "https://lu.ma/climate"
    events_data = []
    
    with sync_playwright() as p:
        # Launch browser
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(
            user_agent='Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        )
        page = context.new_page()
        
        print(f"Navigating to {url}...")
        page.goto(url, wait_until="domcontentloaded", timeout=60000)
        
        # Wait for content to load
        print("Waiting for events to load...")
        time.sleep(5)
        
        # Scroll to load more events
        for i in range(5):
            page.evaluate("window.scrollTo(0, document.body.scrollHeight)")
            time.sleep(2)
            print(f"Scrolled {i+1} times...")
        
        # Take a screenshot for debugging
        page.screenshot(path="debug_screenshot.png")
        print("Saved screenshot to debug_screenshot.png")
        
        # Try to find event cards using Playwright's locator
        print("Extracting event data...")
        
        # Use JavaScript to extract event data from the page
        event_data_js = page.evaluate("""
            () => {
                const events = [];
                // Find all links that look like event links (short paths like /abc123)
                const links = Array.from(document.querySelectorAll('a[href^="/"]'));
                
                links.forEach(link => {
                    const href = link.getAttribute('href');
                    // Event links are typically short paths like /g0vwilk7
                    if (href && href.length > 1 && href.length < 15 && !href.slice(1).includes('/')) {
                        // Get the parent container that has the event info
                        let container = link.closest('div');
                        let attempts = 0;
                        // Go up the DOM tree to find the event card container
                        while (container && attempts < 10) {
                            const text = container.innerText;
                            if (text && text.length > 50 && text.length < 1000) {
                                events.push({
                                    href: href,
                                    text: text
                                });
                                break;
                            }
                            container = container.parentElement;
                            attempts++;
                        }
                    }
                });
                
                return events;
            }
        """)
        
        print(f"Found {len(event_data_js)} potential events")
        
        # Filter out known non-event paths
        excluded_paths = ['/discover', '/pricing', '/create', '/signin', '/category']
        
        for event_obj in event_data_js:
            try:
                href = event_obj['href']
                text_content = event_obj['text']
                
                # Skip known non-event pages (but allow single-segment paths like /abc123)
                if any(href.startswith(path) for path in excluded_paths) or href == '/':
                    continue
                
                # Try to extract structured data
                lines = [line.strip() for line in text_content.split('\n') if line.strip()]
                
                # Parse the event data
                date = ""
                title = ""
                host = ""
                location = ""
                
                # Find date (usually contains time like "11:00 AM" or day like "Oct 29")
                for i, line in enumerate(lines):
                    if any(time_indicator in line for time_indicator in ['AM', 'PM', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']):
                        date = line
                        # Title is usually after the date
                        if i + 1 < len(lines):
                            title = lines[i + 1]
                        # Host is usually marked with "By"
                        for j in range(i + 2, len(lines)):
                            if lines[j].startswith('By '):
                                host = lines[j].replace('By ', '')
                            elif not location and j > i + 1 and lines[j] not in ['Sign In', 'Explore Events']:
                                location = lines[j]
                        break
                
                acceptance = random.choice(["Approved", "Not Approved", "Pending"])
                
                # Only add if we have a meaningful title and it's not a navigation item
                if title and len(title) > 5 and title not in ['Explore Events', 'Sign In', 'Discover', 'Pricing']:
                    events_data.append({
                        "Description": title,
                        "Hosted by": host,
                        "Date": date,
                        "Location": location,
                        "Acceptance": acceptance,
                        "URL": f"https://lu.ma{href}"
                    })
                    print(f"  - Found: {title[:50]}...")
            except Exception as e:
                print(f"Error extracting event: {e}")
                continue
        
        browser.close()
        return events_data

# Run scraper
events_data = scrape_luma_events()

# Write to CSV
with open("luma_events_with_acceptance.csv", "w", newline="", encoding="utf-8") as f:
    writer = csv.DictWriter(f, fieldnames=["Description", "Hosted by", "Date", "Location", "Acceptance", "URL"])
    writer.writeheader()
    for event in events_data:
        writer.writerow(event)

print(f"CSV file generated: luma_events_with_acceptance.csv ({len(events_data)} events)")
