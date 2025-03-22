from flask import Flask, jsonify
from flask_cors import CORS  # Import CORS
import feedparser

app = Flask(__name__)

# Enable CORS for the frontend
CORS(app, origins=["http://localhost:5173"])

# RSS feed URL
rss_url = "https://www.barandbench.com/feed"  # Change this to any RSS feed URL you prefer

# Function to fetch and parse RSS feed
def fetch_rss_feed():
    feed = feedparser.parse(rss_url)
    news_items = []

    if len(feed.entries) > 0:
        for entry in feed.entries[:5]:  # Get the first 5 entries
            news_item = {
                'title': entry.title,
                'link': entry.link,
                'summary': entry.summary,
                'published': entry.published,
                'image': None  # Placeholder for image
            }

            # Try to get the image from 'media_content' (common for RSS feeds with media)
            if 'media_content' in entry:
                media = entry.media_content[0]
                if 'url' in media:
                    news_item['image'] = media['url']

            # Check if image is in 'enclosures' (common for media RSS feeds)
            if not news_item['image'] and 'enclosures' in entry:
                for enclosure in entry.enclosures:
                    if enclosure.get('type', '').startswith('image/'):
                        news_item['image'] = enclosure['url']
                        break  # Get the first image found

            # If no image found, you can leave it as None or use a default image
            if not news_item['image']:
                news_item['image'] = 'https://via.placeholder.com/600x200?text=Legal+News'

            news_items.append(news_item)

    return news_items

# Define the API endpoint for fetching news
@app.route('/api/news', methods=['GET'])
def news():
    try:
        # Fetch and return the RSS feed data
        news_data = fetch_rss_feed()
        return jsonify(news_data)  # Return news as JSON
    except Exception as e:
        # Log the error for debugging
        print(f"Error: {e}")
        return jsonify({'error': 'Failed to fetch news'}), 500  # Return 500 if something goes wrong

if __name__ == '__main__':
    app.run(debug=True)
