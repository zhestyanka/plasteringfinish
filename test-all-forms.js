const http = require('http');

function testForm(type, data) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({
      name: 'Тест',
      phone: '+7(999)123-45-67',
      email: 'test@test.com',
      message: 'Тестовое сообщение',
      type: type,
      ...data
    });

    console.log(`   📤 Отправляемые данные: ${postData}`);

    const options = {
      hostname: 'localhost',
      port: 3000,
      path: '/api/contact',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': postData.length
      }
    };

    const req = http.request(options, (res) => {
      let responseData = '';
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      
      res.on('end', () => {
        try {
          const parsed = JSON.parse(responseData);
          resolve({
            status: res.statusCode,
            data: parsed
          });
        } catch (e) {
          resolve({
            status: res.statusCode,
            data: responseData
          });
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.write(postData);
    req.end();
  });
}

async function runTests() {
  console.log('🧪 Тестирование всех форм...\n');

  // Тест 1: Обычная контактная форма
  try {
    console.log('📝 Тест 1: Контактная форма');
    const result1 = await testForm('contact', {});
    console.log(`   Статус: ${result1.status}`);
    console.log(`   Ответ: ${JSON.stringify(result1.data, null, 2)}\n`);
  } catch (error) {
    console.log(`   ❌ Ошибка: ${error.message}\n`);
  }

  // Тест 2: Калькулятор
  try {
    console.log('🧮 Тест 2: Калькулятор');
    const result2 = await testForm('calculator', {
      clientPrice: '450',
      areaToPlaster: '100',
      layerThickness: '20',
      areaPerShift: '50',
      bagWeight: '30',
      bagPrice: '350',
      totalCost: '45000'
    });
    console.log(`   Статус: ${result2.status}`);
    console.log(`   Ответ: ${JSON.stringify(result2.data, null, 2)}\n`);
  } catch (error) {
    console.log(`   ❌ Ошибка: ${error.message}\n`);
  }

  // Тест 3: Услуги
  try {
    console.log('🔧 Тест 3: Услуги');
    const result3 = await testForm('service', {
      service: 'Механизированная штукатурка'
    });
    console.log(`   Статус: ${result3.status}`);
    console.log(`   Ответ: ${JSON.stringify(result3.data, null, 2)}\n`);
  } catch (error) {
    console.log(`   ❌ Ошибка: ${error.message}\n`);
  }

  // Тест 4: Тарифы
  try {
    console.log('💰 Тест 4: Тарифы');
    const result4 = await testForm('pricing', {
      selectedPlan: 'Стандарт',
      area: '100',
      totalCost: '45000'
    });
    console.log(`   Статус: ${result4.status}`);
    console.log(`   Ответ: ${JSON.stringify(result4.data, null, 2)}\n`);
  } catch (error) {
    console.log(`   ❌ Ошибка: ${error.message}\n`);
  }

  console.log('✅ Тестирование завершено!');
}

runTests();
