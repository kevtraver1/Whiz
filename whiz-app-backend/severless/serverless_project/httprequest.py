import requests
def handler(event, context):
    r = requests.get("https://news.ycombinator.com/news")
    return {"content": r.text}