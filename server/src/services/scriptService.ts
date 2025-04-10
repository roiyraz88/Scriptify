export const generateJobAlertScript = (
  serpApiKey: string,
  emailSender: string,
  emailPassword: string,
  emailRecipient: string,
  query: string
): string => {
  return `
  import requests
  import yagmail
  
  
  SERP_API_KEY = "${serpApiKey}"
  EMAIL_SENDER = "${emailSender}"
  EMAIL_PASSWORD = "${emailPassword}"
  EMAIL_RECIPIENT = "${emailRecipient}"
  QUERY = '${query}'
  # =================================
  
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
              message = f"📢 משרה חדשה:\\n{title}\\n🔗 {link}"
              print("נשלח מייל על:", title)
              yag.send(to=EMAIL_RECIPIENT, subject="משרה חדשה 🎯", contents=message)
              SENT_LINKS.add(link)
  
  # קריאה לפונקציה
  search_and_notify()
  `;
};
