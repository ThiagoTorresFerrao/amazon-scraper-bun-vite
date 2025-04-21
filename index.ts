
import express from 'express';
import axios from 'axios';
import { JSDOM } from 'jsdom';

const app = express();
const PORT = 3000;

app.get('/api/scrape', async (req, res) => {
  const keyword = req.query.keyword as string;

  if (!keyword) {
    return res.status(400).json({ error: 'Keyword is required' });
  }

  const searchUrl = \`https://www.amazon.com/s?k=\${encodeURIComponent(keyword)}\`;

  try {
    const response = await axios.get(searchUrl, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.82 Safari/537.36',
      },
    });

    const dom = new JSDOM(response.data);
    const document = dom.window.document;

    const products = [...document.querySelectorAll('[data-component-type="s-search-result"]')].map(el => {
      const title = el.querySelector('h2 a span')?.textContent?.trim() ?? 'No title';
      const rating = el.querySelector('[aria-label*="out of 5 stars"]')?.getAttribute('aria-label') ?? 'No rating';
      const reviews = el.querySelector('.s-link-style .s-underline-text')?.textContent?.trim() ?? '0';
      const image = el.querySelector('img')?.getAttribute('src') ?? '';

      return { title, rating, reviews, image };
    });

    res.json({ keyword, results: products });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching or parsing Amazon data' });
  }
});

app.listen(PORT, () => {
  console.log(\`Server running at http://localhost:\${PORT}\`);
});
