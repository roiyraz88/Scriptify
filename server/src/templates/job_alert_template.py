import requests
import yagmail

SERP_API_KEY = "__API_KEY__"
EMAIL_SENDER = "__EMAIL_SENDER__"
EMAIL_PASSWORD = "__EMAIL_PASSWORD__"
EMAIL_RECIPIENT = "__EMAIL_RECIPIENT__"
QUERY = "__QUERY__"

SENT_LINKS = set()

def search_and_notify():
    url = "https://serpapi.com/search"
    params = {
        "engine": "google",
        "q": QUERY,
        "api_key": SERP_API_KEY
    }

    response = requests.get(url, params=params)
    results = response.json().get("organic_results", [])

    yag = yagmail.SMTP(EMAIL_SENDER, EMAIL_PASSWORD)

    for result in results:
        title = result.get("title")
        link = result.get("link")

        if link not in SENT_LINKS:
            message = f"📢 New job opportunity!\n{title}\n🔗 {link}"
            print("נשלח מייל על:", title)
            yag.send(to=EMAIL_RECIPIENT, subject="New job opportunity", contents=message)
            SENT_LINKS.add(link)

search_and_notify()
