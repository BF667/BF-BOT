/*
Base Whatsapp Bot
By Hikari Archive

Youtube: @HikariArchive
*/

//~~~~~Setting Global~~~~~//

global.owner = ["6283150958207"] // Nomor Pemilik
global.bot = "628xxxx" // Nomor Bot
global.namabot = "BF BOT" // Nama Bot
global.namaown = "Rico A." // Nama owner

//~~~~~Status Diperbarui~~~~~//
let fs = require('fs')
let file = require.resolve(__filename)
fs.watchFile(file, () => {
fs.unwatchFile(file)
console.log(`Update ${__filename}`)
delete require.cache[file]
require(file)
})