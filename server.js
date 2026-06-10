const mineflayer = require('mineflayer');
const { pathfinder, Movements } = require('mineflayer-pathfinder');

const bot = mineflayer.createBot({
  host: 'relay.lax1dude.net',
  port: 25565,
  username: 'Manus',
  version: '1.8.8',
  auth: 'offline'
});

bot.loadPlugin(pathfinder);

bot.on('spawn', () => {
  console.log('✅ ボットがワールドに参加しました！');
  console.log('📍 Join Code: uikd5');
  bot.chat('こんにちは！Manusです。コマンドを待っています。');
});

bot.on('chat', (username, message) => {
  if (username === bot.username) return;
  console.log(`💬 ${username}: ${message}`);
  
  if (message === 'hello') {
    bot.chat('こんにちは！');
  }
  if (message === 'position') {
    const pos = bot.entity.position;
    bot.chat(`現在地: X=${pos.x.toFixed(1)}, Y=${pos.y.toFixed(1)}, Z=${pos.z.toFixed(1)}`);
  }
  if (message === 'move to you') {
    bot.chat('あなたに向かいます！');
  }
  if (message === 'dig') {
    bot.chat('採掘します！');
  }
  if (message === 'build house') {
    bot.chat('家を建築します！');
  }
});

bot.on('error', (err) => {
  console.log('❌ エラー:', err);
});

bot.on('kicked', (reason) => {
  console.log('❌ キック:', reason);
});

