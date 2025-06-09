const axios = require('axios');
const cheerio = require('cheerio');

const getLatest = () => new Promise((resolve, reject) => {
  const url = 'http://nekopoi.care';
  axios.get(url)
    .then((req) => {
      const title = [];
      const link = [];
      const image = [];
      const soup = cheerio.load(req.data);
      soup('div.eropost').each((i, e) => {
        soup(e).find('h2').each((j, s) => {
          title.push(soup(s).find('a').text().trim());
          link.push(soup(s).find('a').attr('href'));
        });
        image.push(soup(e).find('img').attr('src'));
      });
      if (!title.length) return reject('No result.');
      const i = Math.floor(Math.random() * title.length);
      resolve({ title: title[i], image: image[i], link: link[i] });
    })
    .catch((err) => reject(err));
});

const getVideo = (url) => new Promise((resolve, reject) => {
  axios.get(url)
    .then((req) => {
      const links = [];
      const soup = cheerio.load(req.data);
      const title = soup('title').text();
      soup('div.liner').each((i, e) => {
        soup(e).find('div.listlink').each((j, s) => {
          soup(s).find('a').each((p, q) => {
            links.push(soup(q).attr('href'));
          });
        });
      });
      resolve({ title, links });
    })
    .catch((err) => reject(err));
});

module.exports = { getLatest, getVideo };
