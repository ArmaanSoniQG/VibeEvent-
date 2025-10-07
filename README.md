# VibeEvent-

A dynamic web scraping project to collect event data from Luma using Playwright.

## Features

- Scrapes food & drink events from Luma
- Uses Playwright for dynamic content loading
- Extracts event details: title, host, date, location, and URL
- Generates CSV output with random acceptance status
- Handles infinite scroll and lazy-loaded content

## Setup

1. Create and activate virtual environment:
```bash
python3 -m venv venv
source venv/bin/activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Install Playwright browsers:
```bash
playwright install chromium
```

## Usage

Run the scraper:
```bash
python luma_scrapper.py
```

This will:
- Navigate to https://lu.ma/food
- Scroll to load more events
- Extract event data
- Generate `luma_events_with_acceptance.csv` with the scraped data
- Save a debug screenshot (`debug_screenshot.png`)

## Output

The CSV file contains the following columns:
- **Description**: Event title
- **Hosted by**: Event organizer(s)
- **Date**: Event date and time
- **Location**: Event location
- **Acceptance**: Random status (Approved/Not Approved/Pending)
- **URL**: Direct link to the event page
