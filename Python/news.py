from flask import Flask, jsonify
from flask_cors import CORS
import feedparser
import requests
from bs4 import BeautifulSoup
import os
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)

app = Flask(__name__)

# Enable CORS for the frontend
VITE_FRONTEND_URL = os.getenv("VITE_FRONTEND_URL", "http://localhost:5173")
CORS(app, origins=[VITE_FRONTEND_URL])

# RSS feed URL
rss_url = (
    "https://www.barandbench.com/feed"  # Change this to any RSS feed URL you prefer
)


def fetch_rss_feed():
    feed = feedparser.parse(rss_url)
    news_items = []

    if len(feed.entries) > 0:
        for entry in feed.entries[:10]:  # Fetch 10 entries
            news_item = {
                "title": entry.title,
                "link": entry.link,
                "summary": entry.summary,
                "published": entry.published,
                "image": None,
                "content": None,  # Adding content field for detailed article content
            }

            # Try to get the image from 'media_content' (common for RSS feeds with media)
            if "media_content" in entry and entry.media_content:
                media = entry.media_content[0]
                if "url" in media:
                    news_item["image"] = media["url"]

            # Check 'enclosures' for images
            elif "enclosures" in entry and entry.enclosures:
                for enclosure in entry.enclosures:
                    if enclosure.get("type", "").startswith("image/"):
                        news_item["image"] = enclosure["url"]
                        break

            # If no image found, try scraping the article for the image
            if not news_item["image"]:
                try:
                    response = requests.get(entry.link)
                    soup = BeautifulSoup(response.content, "html.parser")
                    og_image_tag = soup.find("meta", property="og:image")
                    if og_image_tag:
                        news_item["image"] = og_image_tag["content"]
                except Exception as e:
                    logging.error(f"Error while scraping the article for image: {e}")

            # Default image if none found
            default_image = "https://via.placeholder.com/600x200?text=Legal+News"
            if not news_item["image"]:
                news_item["image"] = default_image

            # Fetching detailed content from the article
            if not news_item["content"]:
                try:
                    response = requests.get(entry.link)
                    soup = BeautifulSoup(response.content, "html.parser")

                    # Example: Try to extract main content, based on the website's structure
                    content_tag = soup.find("div", class_="article-body")
                    if content_tag:
                        news_item["content"] = content_tag.get_text().strip()

                    # If no specific article body found, try scraping other parts
                    if not news_item["content"]:
                        content_tag = soup.find(
                            "div", class_="content"
                        )  # Example alternative structure
                        if content_tag:
                            news_item["content"] = content_tag.get_text().strip()

                except Exception as e:
                    logging.error(f"Error while scraping detailed content: {e}")

            news_items.append(news_item)

    return news_items


# Define the API endpoint for fetching news
@app.route("/api/news", methods=["GET"])
def news():
    try:
        # Fetch and return the RSS feed data
        news_data = fetch_rss_feed()
        return jsonify(news_data)  # Return news as JSON
    except Exception as e:
        # Log the error for debugging
        logging.error(f"Error: {e}")
        return (
            jsonify({"error": "Failed to fetch news"}),
            500,
        )  # Return 500 if something goes wrong


if __name__ == "__main__":
    app.run(debug=True)
