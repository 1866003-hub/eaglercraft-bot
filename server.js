const mineflayer = require('mineflayer');

const bot = mineflayer.createBot({
  host: 'localhost',  // 後で変える
  port: 25565,
  username: 'AIBot',
  version: '1.8.8'
});

bot.on('spawn', () => {
  console.log('ボット接続成功！');
});

bot.on('error', (err) => {
  console.log('エラー:', err);
});

bot.on('end', () => {
  console.log('切断された');
});
