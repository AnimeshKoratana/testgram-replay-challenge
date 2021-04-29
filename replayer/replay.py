# Make sure to run `playwright install` before running this
from playwright.sync_api import sync_playwright
import json

START_URL = "https://app.testgram.ai"

with open("steps.json", "r") as f:
    steps = json.load(f)

def replay(page):
    for step in steps:
        event = step["event"]
        if event == "click":
            click(step, page)
        elif event == 'change' :
            fill(step, page)


def click(step, page):
    page.click(step['data']['selector'])
    # page.wait_for_timeout(2000.0)


def fill(step, page):
    data = step["data"]
    page.fill(data['selector'], data['value'])
    # page.wait_for_timeout(2000.0)

if __name__ == '__main__':
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=False)
        page = browser.new_page()
        page.goto(START_URL)
        replay(page)
        browser.close()
