/*
Bf WhatsApp Bot
By BF667
*/
require('./config');
const fs = require('fs');
const util = require('util');
const { exec } = require('child_process');
const { Jsholat } = require('./lib/jsholat');
const { getLatest, getVideo } = require('./lib/nekopoi');
const { randomLewd, armpits, feets, thighs, ass, boobs, belly, sideboobs, ahegao } = require('./lib/lewd');

module.exports = async (BF, m) => {
  try {
    const body = (
      (m.mtype === 'conversation' && m.message.conversation) ||
      (m.mtype === 'imageMessage' && m.message.imageMessage.caption) ||
      (m.mtype === 'documentMessage' && m.message.documentMessage.caption) ||
      (m.mtype === 'videoMessage' && m.message.videoMessage.caption) ||
      (m.mtype === 'extendedTextMessage' && m.message.extendedTextMessage.text) ||
      (m.mtype === 'buttonsResponseMessage' && m.message.buttonsResponseMessage.selectedButtonId) ||
      (m.mtype === 'templateButtonReplyMessage' && m.message.templateButtonReplyMessage.selectedId)
    ) || '';

    const budy = (typeof m.text === 'string') ? m.text : '';
    const prefixRegex = /^[°zZ#$@*+,.?=''():√%!¢£¥€π¤ΠΦ_&><`™©®Δ^βα~¦|/\\©^]/;
    const prefix = prefixRegex.test(body) ? body.match(prefixRegex)[0] : '.';
    const isCmd = body.startsWith(prefix);
    const command = isCmd ? body.slice(prefix.length).trim().split(' ').shift().toLowerCase() : '';
    const args = body.trim().split(/ +/).slice(1);
    const text = args.join(' ');
    const sender = m.key.fromMe ? (BF.user.id.split(':')[0] + '@s.whatsapp.net' || BF.user.id) : (m.key.participant || m.key.remoteJid);
    const botNumber = await BF.decodeJid(BF.user.id);
    const senderNumber = sender.split('@')[0];
    const isCreator = [botNumber, ...global.owner].map(v => v.replace(/[^0-9]/g, '') + '@s.whatsapp.net').includes(sender);
    const pushname = m.pushName || `${senderNumber}`;
    const isBot = botNumber.includes(senderNumber);

    //~~~~~Command Cases~~~~~//
    switch (command) {
      case 'menu':
        const menu = `📋 *Menu Bot WhatsApp*\n` +
          `Halo, ${pushname}! Berikut adalah daftar fitur bot:\n\n` +
          `🔹 *${prefix}ping* - Cek apakah bot aktif (Pong!).\n` +
          `🔹 *${prefix}jadwalsholat <kota>* - Lihat jadwal sholat untuk kota tertentu (contoh: ${prefix}jadwalsholat Jakarta).\n` +
          `\n📛 *Fitur Khusus Owner*\n` +
          `🔸 *${prefix}nekopoi* - Dapatkan video terbaru dari Nekopoi.\n` +
          `🔸 *${prefix}nekovideo <url>* - Dapatkan metadata dan link download dari video Nekopoi.\n` +
          `🔸 *${prefix}lewd* - Dapatkan gambar acak dari subreddit 18+.\n` +
          `🔸 *${prefix}armpits* - Dapatkan gambar anime armpits.\n` +
          `🔸 *${prefix}feets* - Dapatkan gambar anime feets.\n` +
          `🔸 *${prefix}thighs* - Dapatkan gambar anime thighs.\n` +
          `🔸 *${prefix}ass* - Dapatkan gambar anime booty.\n` +
          `🔸 *${prefix}boobs* - Dapatkan gambar anime boobs.\n` +
          `🔸 *${prefix}belly* - Dapatkan gambar anime belly.\n` +
          `🔸 *${prefix}sideboobs* - Dapatkan gambar anime sideboobs.\n` +
          `🔸 *${prefix}ahegao* - Dapatkan gambar anime ahegao.\n` +
          `\nGunakan perintah dengan prefix: ${prefix}\n` +
          `Contoh: ${prefix}ping`;
        await m.reply(menu);
        break;

      case 'ping':
        await m.reply('Pong!');
        break;

      case 'jadwalsholat':
        if (!text) return m.reply('Masukkan nama kota, contoh: .jadwalsholat Jakarta');
        try {
          const data = await Jsholat(text);
          const response = `Jadwal Sholat untuk ${text} (${data.tanggal}):\n` +
            `Subuh: ${data.subuh}\n` +
            `Dzuhur: ${data.dzuhur}\n` +
            `Ashar: ${data.ashar}\n` +
            `Maghrib: ${data.maghrib}\n` +
            `Isya: ${data.isya}`;
          await m.reply(response);
        } catch (err) {
          await m.reply(`Error: ${err.message || 'Gagal mengambil data.'}`);
        }
        break;

      case 'nekopoi':
        if (!isCreator) return m.reply('Fitur ini hanya untuk owner!');
        try {
          const data = await getLatest();
          const response = `Judul: ${data.title}\n` +
            `Link: ${data.link}\n` +
            `Gambar: ${data.image}`;
          await m.reply(response);
        } catch (err) {
          await m.reply(`Error: ${err.message || 'Gagal mengambil data.'}`);
        }
        break;

      case 'nekovideo':
        if (!isCreator) return m.reply('Fitur ini hanya untuk owner!');
        if (!text) return m.reply('Masukkan URL video Nekopoi, contoh: .nekovideo http://nekopoi.care/video-url');
        try {
          const data = await getVideo(text);
          const response = `Judul: ${data.title}\n` +
            `Link Download:\n${data.links.join('\n')}`;
          await m.reply(response);
        } catch (err) {
          await m.reply(`Error: ${err.message || 'Gagal mengambil data.'}`);
        }
        break;

      case 'lewd':
        if (!isCreator) return m.reply('Fitur ini hanya untuk owner!');
        try {
          const data = await randomLewd();
          if (!data.url) throw new Error('No image found.');
          const response = `Random Lewd Image\n` +
            `Title: ${data.title}\n` +
            `Source: ${data.subreddit}\n` +
            `URL: ${data.url}`;
          await m.reply(response);
        } catch (err) {
          await m.reply(`Error: ${err.message || 'Gagal mengambil gambar.'}`);
        }
        break;

      case 'armpits':
        if (!isCreator) return m.reply('Fitur ini hanya untuk owner!');
        try {
          const data = await armpits();
          if (!data.url) throw new Error('No image found.');
          const response = `Anime Armpits Image\n` +
            `Title: ${data.title}\n` +
            `Source: ${data.subreddit}\n` +
            `URL: ${data.url}`;
          await m.reply(response);
        } catch (err) {
          await m.reply(`Error: ${err.message || 'Gagal mengambil gambar.'}`);
        }
        break;

      case 'feets':
        if (!isCreator) return m.reply('Fitur ini hanya untuk owner!');
        try {
          const data = await feets();
          if (!data.url) throw new Error('No image found.');
          const response = `Anime Feets Image\n` +
            `Title: ${data.title}\n` +
            `Source: ${data.subreddit}\n` +
            `URL: ${data.url}`;
          await m.reply(response);
        } catch (err) {
          await m.reply(`Error: ${err.message || 'Gagal mengambil gambar.'}`);
        }
        break;

      case 'thighs':
        if (!isCreator) return m.reply('Fitur ini hanya untuk owner!');
        try {
          const data = await thighs();
          if (!data.url) throw new Error('No image found.');
          const response = `Anime Thighs Image\n` +
            `Title: ${data.title}\n` +
            `Source: ${data.subreddit}\n` +
            `URL: ${data.url}`;
          await m.reply(response);
        } catch (err) {
          await m.reply(`Error: ${err.message || 'Gagal mengambil gambar.'}`);
        }
        break;

      case 'ass':
        if (!isCreator) return m.reply('Fitur ini hanya untuk owner!');
        try {
          const data = await ass();
          if (!data.url) throw new Error('No image found.');
          const response = `Anime Booty Image\n` +
            `Title: ${data.title}\n` +
            `Source: ${data.subreddit}\n` +
            `URL: ${data.url}`;
          await m.reply(response);
        } catch (err) {
          await m.reply(`Error: ${err.message || 'Gagal mengambil gambar.'}`);
        }
        break;

      case 'boobs':
        if (!isCreator) return m.reply('Fitur ini hanya untuk owner!');
        try {
          const data = await boobs();
          if (!data.url) throw new Error('No image found.');
          const response = `Anime Boobs Image\n` +
            `Title: ${data.title}\n` +
            `Source: ${data.subreddit}\n` +
            `URL: ${data.url}`;
          await m.reply(response);
        } catch (err) {
          await m.reply(`Error: ${err.message || 'Gagal mengambil gambar.'}`);
        }
        break;

      case 'belly':
        if (!isCreator) return m.reply('Fitur ini hanya untuk owner!');
        try {
          const data = await belly();
          if (!data.url) throw new Error('No image found.');
          const response = `Anime Belly Image\n` +
            `Title: ${data.title}\n` +
            `Source: ${data.subreddit}\n` +
            `URL: ${data.url}`;
          await m.reply(response);
        } catch (err) {
          await m.reply(`Error: ${err.message || 'Gagal mengambil gambar.'}`);
        }
        break;

      case 'sideboobs':
        if (!isCreator) return m.reply('Fitur ini hanya untuk owner!');
        try {
          const data = await sideboobs();
          if (!data.url) throw new Error('No image found.');
          const response = `Anime Sideboobs Image\n` +
            `Title: ${data.title}\n` +
            `Source: ${data.subreddit}\n` +
            `URL: ${data.url}`;
          await m.reply(response);
        } catch (err) {
          await m.reply(`Error: ${err.message || 'Gagal mengambil gambar.'}`);
        }
        break;

      case 'ahegao':
        if (!isCreator) return m.reply('Fitur ini hanya untuk owner!');
        try {
          const data = await ahegao();
          if (!data.url) throw new Error('No image found.');
          const response = `Anime Ahegao Image\n` +
            `Title: ${data.title}\n` +
            `Source: ${data.subreddit}\n` +
            `URL: ${data.url}`;
          await m.reply(response);
        } catch (err) {
          await m.reply(`Error: ${err.message || 'Gagal mengambil gambar.'}`);
        }
        break;

      default:
        if (isCmd) await m.reply('Command tidak dikenali.');
    }
  } catch (err) {
    console.error(util.format(err));
    await m.reply('Terjadi kesalahan, coba lagi nanti.');
  }
};

//~~~~~File Watcher~~~~~//
let file = require.resolve(__filename);
fs.watchFile(file, () => {
  fs.unwatchFile(file);
  console.log(`Update ${__filename}`);
  delete require.cache[file];
  require(file);
});
