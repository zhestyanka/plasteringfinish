const https = require('https');

async function testBotInfo() {
  const botToken = '8441134609:AAEE2nxXaxsh1BAkTH5QABBMCg5F4zq4RmY';
  
  const options = {
    hostname: 'api.telegram.org',
    port: 443,
    path: `/bot${botToken}/getMe`,
    method: 'GET'
  };

  console.log('🧪 Проверка информации о боте...');
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
            console.log('✅ Бот работает!');
            console.log('🤖 Имя бота:', parsed.result.first_name);
            console.log('👤 Username:', parsed.result.username);
          } else {
            console.log('❌ Ошибка бота:', parsed.description);
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

testBotInfo().catch(console.error);
