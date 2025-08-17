const http = require('http');

function testContact() {
  const data = JSON.stringify({
    name: 'Тест',
    phone: '+7(999)123-45-67',
    email: 'test@test.com',
    message: 'Тестовое сообщение',
    type: 'contact'
  });

  const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/contact',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': data.length
    }
  };

  const req = http.request(options, (res) => {
    console.log('Status:', res.statusCode);
    console.log('Headers:', res.headers);
    
    let responseData = '';
    res.on('data', (chunk) => {
      responseData += chunk;
    });
    
    res.on('end', () => {
      console.log('Response:', responseData);
      try {
        const parsed = JSON.parse(responseData);
        console.log('Parsed response:', parsed);
      } catch (e) {
        console.log('Could not parse response as JSON');
      }
    });
  });

  req.on('error', (error) => {
    console.error('Error:', error);
  });

  req.write(data);
  req.end();
}

testContact();
