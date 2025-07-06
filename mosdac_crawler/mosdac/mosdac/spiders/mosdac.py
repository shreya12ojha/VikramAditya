import scrapy 
from urllib.parse import urljoin, urlparse
from mosdac.items import MosdacItem

class MosdacSpider(scrapy.Spider):
    name = 'mosdac'
    allowed_domains = ['mosdac.gov.in']
    start_urls = ['https://www.mosdac.gov.in/']

    visited_urls = set()

    def normalize_url(self, url):
        return url.split('#')[0].split('?')[0].rstrip('/')

    def parse(self, response):
        content_type = response.headers.get('Content-Type', b'').decode('utf-8').lower()
        if 'text/html' not in content_type:
            return  # Skip non-HTML content

        normalized_url = self.normalize_url(response.url)
        if normalized_url in self.visited_urls:
            return
        self.visited_urls.add(normalized_url)

        # Skip garbage: remove scripts/styles before extracting text
        response.selector.remove_namespaces()
        for selector in response.xpath('//script | //style | //noscript'):
            selector.root.getparent().remove(selector.root)

        text_parts = response.xpath('//body//text()[normalize-space()]').getall()
        content = ' '.join(part.strip() for part in text_parts if part.strip())

        # Skip pages with tiny or garbage content
        if len(content) < 100:
            return

        item = MosdacItem()
        item['url'] = response.url
        item['title'] = response.xpath('//title/text()').get(default='').strip()
        item['content'] = content
        yield item

        # Crawl internal links only
        for href in response.css('a::attr(href)').getall():
            if not href or href.startswith(('mailto:', 'javascript:', '#')):
                continue

            absolute_url = urljoin(response.url, href)
            parsed = urlparse(absolute_url)

            # Stay within domain and HTML-like pages
            if self.allowed_domains[0] in parsed.netloc:
                if not parsed.path.endswith(('.pdf', '.jpg', '.jpeg', '.png', '.zip', '.docx', '.xlsx')):
                    norm_link = self.normalize_url(absolute_url)
                    if norm_link not in self.visited_urls:
                        yield response.follow(norm_link, callback=self.parse)
