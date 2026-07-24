import urllib.request
from bs4 import BeautifulSoup
import re
import sys

urls = [
    "https://developers.etsy.com/documentation/",
    "https://developers.etsy.com/documentation/tutorials/quickstart",
    "https://developers.etsy.com/documentation/tutorials/fulfillment",
    "https://developers.etsy.com/documentation/tutorials/listings",
    "https://developers.etsy.com/documentation/tutorials/migration",
    "https://developers.etsy.com/documentation/tutorials/third-variation",
    "https://developers.etsy.com/documentation/tutorials/shopmanagement",
    "https://developers.etsy.com/documentation/tutorials/payments",
    "https://developers.etsy.com/documentation/tutorials/personalization-migration",
    "https://developers.etsy.com/documentation/tutorials/personalization/examples",
    "https://developers.etsy.com/documentation/tutorials/personalization-addon-pricing",
    "https://developers.etsy.com/documentation/mcp_server/devmcpserver"
]

output_file = r"C:\Users\Administrator\.gemini\antigravity\brain\ef471977-9b9f-40be-9bad-98cc4319a84d\etsy_tutorials.md"

try:
    with open(output_file, "w", encoding="utf-8") as f:
        f.write("# Etsy Documentation & Tutorials\n\n")
        
        for url in urls:
            try:
                req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
                html = urllib.request.urlopen(req).read()
                soup = BeautifulSoup(html, 'html.parser')
                
                # Try to find main content
                main_content = soup.find('main') or soup.find('article') or soup.body
                if main_content:
                    text = main_content.get_text(separator='\n\n', strip=True)
                    # Clean up multiple newlines
                    text = re.sub(r'\n{3,}', '\n\n', text)
                    f.write(f"## Source: {url}\n\n")
                    f.write(text)
                    f.write("\n\n---\n\n")
                    print(f"Scraped {url}")
                else:
                    print(f"No content found for {url}")
            except Exception as e:
                print(f"Failed to scrape {url}: {e}")
    print("Done writing to " + output_file)
except Exception as e:
    print(f"Error: {e}")
