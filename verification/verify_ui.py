
from playwright.sync_api import sync_playwright

def verify_app():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Navigate to the app
        page.goto('http://localhost:5173')

        # Wait for the dashboard to load (Sidebar should be visible)
        page.wait_for_selector('text=PhysiCode', state='attached', timeout=10000)

        # Take a screenshot of the Dashboard
        page.screenshot(path='verification/dashboard.png')
        print('Dashboard screenshot taken')

        # Look for the 'EMPEZAR' badge which appears on the active lesson
        page.wait_for_selector('text=EMPEZAR', timeout=5000)

        # Click the FIRST 'EMPEZAR' badge found
        page.get_by_text('EMPEZAR').first.click()

        # Wait for Lesson page content. Avoiding '//' which might be interpreted as regex flags by playwright's text engine or similar weirdness?
        # Let's search for just the filename or simpler text.
        page.wait_for_selector('text=physics_engine.js', timeout=5000)

        # Take a screenshot of the Lesson page
        page.screenshot(path='verification/lesson.png')
        print('Lesson screenshot taken')

        browser.close()

if __name__ == '__main__':
    verify_app()
