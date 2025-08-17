const https = require('https');

function testTelegram() {
  const data = JSON.stringify({
    message: {
      name: 'Тест',
      phone: '+7(999)123-45-67',
      email: 'test@test.com',
      message: 'Тестовое сообщение'
    },
    type: 'contact'
  });

  const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/telegram',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': data.length
    }
  };

  const req = https.request(options, (res) => {
    console.log('Status:', res.statusCode);
    
    let responseData = '';
    res.on('data', (chunk) => {
      responseData += chunk;
    });
    
    res.on('end', () => {
      console.log('Response:', responseData);
    });
  });

  req.on('error', (error) => {
    console.error('Error:', error);
  });

  req.write(data);
  req.end();
}

testTelegram();
