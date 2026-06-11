/**
 * Eaglercraft LAN World 直接WebSocket接続ボット
 */

const WebSocket = require('ws' );
const EventEmitter = require('events');

const JOIN_CODE = process.env.JOIN_CODE || 'a1qg1';
const RELAY_URL = 'wss://relay.lax1dude.net/';
const BOT_NAME = 'Manus';

console.log(`🤖 Eaglercraft直接WebSocketボット起動`);
console.log(`📍 Relay URL: ${RELAY_URL}`);
console.log(`🔑 Join Code: ${JOIN_CODE}`);
console.log(`👤 ボット名: ${BOT_NAME}`);

class EaglerCraftBot extends EventEmitter {
  constructor(joinCode, botName) {
    super();
    this.joinCode = joinCode;
    this.botName = botName;
    this.ws = null;
    this.connected = false;
    this.players = {};
    this.position = { x: 0, y: 64, z: 0 };
  }

  connect() {
    const wsUrl = `${RELAY_URL}${this.joinCode}`;
    console.log(`🔗 接続中: ${wsUrl}`);

    this.ws = new WebSocket(wsUrl);

    this.ws.on('open', () => {
      console.log('✅ WebSocket接続成功');
      this.connected = true;
      this.emit('connect');
      this.sendHandshake();
    });

    this.ws.on('message', (data) => {
      this.handleMessage(data);
    });

    this.ws.on('error', (err) => {
      console.log('❌ WebSocketエラー:', err.message);
      this.emit('error', err);
    });

    this.ws.on('close', () => {
      console.log('⚠️ WebSocket接続切断');
      this.connected = false;
      this.emit('disconnect');
      setTimeout(() => this.connect(), 5000);
    });
  }

  sendHandshake() {
    try {
      const handshake = {
        type: 'handshake',
        username: this.botName,
        version: '1.8.8'
      };
      this.ws.send(JSON.stringify(handshake));
      console.log('📤 ハンドシェイク送信');
    } catch (err) {
      console.log('❌ ハンドシェイク送信エラー:', err.message);
    }
  }

  handleMessage(data) {
    try {
      if (data instanceof Buffer || data instanceof ArrayBuffer) {
        console.log('📥 バイナリデータ受信:', data.length, 'bytes');
        return;
      }
      const message = JSON.parse(data);
      console.log('💬 メッセージ受信:', message);
      if (message.type === 'chat') {
        this.handleChat(message);
      }
    } catch (err) {
      // JSON解析失敗
    }
  }

  handleChat(message) {
    const { username, text } = message;
    if (username === this.botName) return;
    console.log(`💬 ${username}: ${text}`);
    this.processCommand(username, text);
  }

  processCommand(username, text) {
    const cmd = text.toLowerCase().trim();
    if (cmd === 'hello') {
      this.sendChat('こんにちは！');
    }
    if (cmd === 'position') {
      const pos = this.position;
      this.sendChat(`現在地: X=${pos.x.toFixed(1)}, Y=${pos.y.toFixed(1)}, Z=${pos.z.toFixed(1)}`);
    }
    if (cmd === 'help') {
      this.sendChat('コマンド一覧: hello, position, help, status');
    }
  }

  sendChat(text) {
    try {
      const message = {
        type: 'chat',
        text: text
      };
      this.ws.send(JSON.stringify(message));
      console.log(`📤 チャット送信: ${text}`);
    } catch (err) {
      console.log('❌ チャット送信エラー:', err.message);
    }
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
    }
  }
}

const bot = new EaglerCraftBot(JOIN_CODE, BOT_NAME);

bot.on('connect', () => {
  console.log('🎮 ボットがワールドに接続しました！');
  setTimeout(() => {
    bot.sendChat('こんにちは！Manusです。');
  }, 2000);
});

bot.connect();

process.on('SIGINT', () => {
  console.log('\n🛑 ボットを停止します...');
  bot.disconnect();
  process.exit(0);
});
