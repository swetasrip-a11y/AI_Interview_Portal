const http = require('http');

const data = JSON.stringify({
  email: 'finaltest@test.com',
  password: 'TestPass123!',
  full_name: 'Final Test User',
  role: 'candidate'
});

const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/auth/register',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

const req = http.request(options, (res) => {
  let body = '';
  res.on('data', chunk => body += chunk);
  res.on('end', () => {
    console.log('Status:', res.statusCode);
    console.log('Response:', body);
    
    // Now test login
    if (res.statusCode === 200) {
      setTimeout(() => {
        testLogin();
      }, 500);
    }
  });
});

req.on('error', console.error);
req.write(data);
req.end();

function testLogin() {
  const loginData = JSON.stringify({
    email: 'finaltest@test.com',
    password: 'TestPass123!'
  });

  const loginOptions = {
    hostname: 'localhost',
    port: 5000,
    path: '/api/auth/login',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': loginData.length
    }
  };

  const loginReq = http.request(loginOptions, (res) => {
    let body = '';
    res.on('data', chunk => body += chunk);
    res.on('end', () => {
      console.log('\nLogin Status:', res.statusCode);
      console.log('Login Response:', body);
    });
  });

  loginReq.on('error', console.error);
  loginReq.write(loginData);
  loginReq.end();
}
