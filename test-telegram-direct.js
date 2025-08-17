const https = require('https');

async function testTelegramDirect() {
  const botToken = '8441134609:AAEE2nxXaxsh1BAkTH5QABBMCg5F4zq4RmY';
  const chatId = '6476993703';
  
  const message = "Тестовое сообщение от бота";

  const postData = JSON.stringify({
    chat_id: chatId,
    text: message
  });

  const options = {
    hostname: 'api.telegram.org',
    port: 443,
    path: `/bot${botToken}/sendMessage`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData, 'utf8')
    }
  };

  console.log('🧪 Тестирование Telegram API напрямую...');
  console.log('🔑 Bot Token:', botToken);
  console.log('💬 Chat ID:', chatId);
  console.log('📝 Сообщение:', message);
  console.log('📤 Отправляемые данные:', postData);
  console.log('📏 Длина данных:', Buffer.byteLength(postData, 'utf8'));

  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let responseData = '';
      
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      
      res.on('end', () => {
        console.log('📡 Статус ответа:', res.statusCode);
        console.log('📡 Заголовки:', res.headers);
        
        try {
          const parsed = JSON.parse(responseData);
          console.log('📨 Ответ Telegram:', JSON.stringify(parsed, null, 2));
          
          if (parsed.ok) {
            console.log('✅ Сообщение успешно отправлено в Telegram!');
          } else {
            console.log('❌ Ошибка Telegram:', parsed.description);
          }
          
          resolve(parsed);
        } catch (e) {
          console.log('❌ Ошибка парсинга ответа:', responseData);
          resolve({ error: 'Parse error', data: responseData });
        }
      });
    });

    req.on('error', (error) => {
      console.error('❌ Ошибка запроса:', error);
      reject(error);
    });

    req.write(postData);
    req.end();
  });
}

testTelegramDirect().catch(console.error);
