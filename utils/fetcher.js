// utils/fetcher.js
const axios = require('axios');

const fetchJson = (url) => new Promise((resolve, reject) => {
  axios.get(url)
    .then((response) => resolve(response.data))
    .catch((err) => reject(err));
});

module.exports = { fetchJson };
