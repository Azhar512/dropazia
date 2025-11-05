// Test login endpoint directly
const http = require('http');

const testLogin = async () => {
  const postData = JSON.stringify({
    email: 'admin@shopdaraz.com',
    password: 'admin123'
  });

  const options = {
    hostname: 'localhost',
    port: 5000,
    path: '/api/auth/login',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData)
    }
  };

  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          resolve({ status: res.statusCode, data: result });
        } catch (e) {
          resolve({ status: res.statusCode, data: data });
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.write(postData);
    req.end();
  });
};

console.log('🧪 Testing admin login...');
console.log('Email: admin@shopdaraz.com');
console.log('Password: admin123');
console.log('');

testLogin()
  .then(result => {
    console.log('✅ Response Status:', result.status);
    console.log('📄 Response Data:', JSON.stringify(result.data, null, 2));
    
    if (result.status === 200 && result.data.success) {
      console.log('');
      console.log('✅ LOGIN SUCCESSFUL!');
      console.log('Token received:', result.data.data.token ? 'YES' : 'NO');
    } else {
      console.log('');
      console.log('❌ LOGIN FAILED');
      console.log('Reason:', result.data.message || 'Unknown error');
    }
  })
  .catch(error => {
    console.error('❌ Error:', error.message);
    console.error('');
    console.error('💡 Make sure the backend server is running:');
    console.error('   cd backend');
    console.error('   npm run dev');
  });

