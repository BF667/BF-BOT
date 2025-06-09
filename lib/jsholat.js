const needle = require('needle');
const moment = require('moment-timezone');

const Jsholat = (kota) => new Promise((resolve, reject) => {
  const url = 'https://api.banghasan.com/sholat/format/json';
  const tanggal = moment.tz('Asia/Jakarta').format('YYYY-MM-DD');
  needle(url + '/kota/nama/' + kota, (err, resp, body) => {
    if (err) return reject(err);
    if (body.kota.length === 0) return reject('Nama kota tidak ditemukan.');
    const kodekota = body.kota[0].id;
    needle(url + '/jadwal/kota/' + kodekota + '/tanggal/' + tanggal, (err, resp, body) => {
      if (err) return reject(err);
      resolve(body.jadwal.data);
    });
  });
});

module.exports = { Jsholat };
