const https = require('https');

async function testGetUpdates() {
  const botToken = '8441134609:AAEE2nxXaxsh1BAkTH5QABBMCg5F4zq4RmY';
  
  const options = {
    hostname: 'api.telegram.org',
    port: 443,
    path: `/bot${botToken}/getUpdates`,
    method: 'GET'
  };

  console.log('🧪 Получение обновлений бота...');
  console.log('🔑 Bot Token:', botToken);

  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let responseData = '';
      
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      
      res.on('end', () => {
        console.log('📡 Статус ответа:', res.statusCode);
        
        try {
          const parsed = JSON.parse(responseData);
          console.log('📨 Ответ Telegram:', JSON.stringify(parsed, null, 2));
          
          if (parsed.ok) {
            console.log('✅ Обновления получены!');
            console.log('📊 Количество обновлений:', parsed.result.length);
            
            if (parsed.result.length > 0) {
              console.log('💬 Последние чаты:');
              parsed.result.forEach((update, index) => {
                if (update.message) {
                  const chat = update.message.chat;
                  console.log(`   ${index + 1}. Chat ID: ${chat.id}, Тип: ${chat.type}, Имя: ${chat.first_name || chat.title || 'Неизвестно'}`);
                }
              });
            } else {
              console.log('📭 Нет обновлений. Отправьте сообщение боту @plasteringspb_bot');
            }
          } else {
            console.log('❌ Ошибка получения обновлений:', parsed.description);
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

    req.end();
  });
}

testGetUpdates().catch(console.error);
