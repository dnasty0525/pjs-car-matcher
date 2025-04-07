import cheerio from 'cheerio';
import axios from 'axios';

export default async function handler(req, res) {
  try {
    const response = await axios.get('https://www.pjsautoworld.com/vehicles');
    const $ = cheerio.load(response.data);
    const vehicles = [];

    $('.inventory-item').each((i, el) => {
      const title = $(el).find('.inventory-title').text().trim();
      const match = title.match(/(\\d{4})\\s+(\\w+)\\s+(.*)/);
      if (match) {
        const [, year, make, model] = match;
        vehicles.push({ year, make, model });
      }
    });

    res.status(200).json({ vehicles });
  } catch (err) {
    console.error('Scraping error:', err);
    res.status(500).json({ error: 'Failed to fetch inventory' });
  }
}
