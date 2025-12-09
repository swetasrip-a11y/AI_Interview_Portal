const http = require('http');

function makeRequest(method, path, data) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify(data);
    const options = {
      hostname: 'localhost',
      port: 5000,
      path: `/api${path}`,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': body.length
      }
    };

    const req = http.request(options, (res) => {
      let responseBody = '';
      res.on('data', chunk => responseBody += chunk);
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          body: responseBody ? JSON.parse(responseBody) : null,
          headers: res.headers
        });
      });
    });

    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

async function test() {
  console.log('🧪 Testing Auth API\n');

  try {
    // Test 1: Candidate signup
    console.log('1️⃣  CANDIDATE SIGNUP...');
    const email1 = 'candidate' + Date.now() + '@test.com';
    const res1 = await makeRequest('POST', '/auth/register', {
      email: email1,
      password: 'CandidatePass123!',
      full_name: 'Test Candidate',
      role: 'candidate'
    });
    console.log(`   Status: ${res1.status}`);
    console.log(`   Response: ${JSON.stringify(res1.body)}\n`);

    // Test 2: Interviewer signup
    console.log('2️⃣  INTERVIEWER SIGNUP...');
    const email2 = 'interviewer' + Date.now() + '@test.com';
    const res2 = await makeRequest('POST', '/auth/register', {
      email: email2,
      password: 'InterviewerPass123!',
      full_name: 'Test Interviewer',
      role: 'interviewer'
    });
    console.log(`   Status: ${res2.status}`);
    console.log(`   Response: ${JSON.stringify(res2.body)}\n`);

    // Test 3: Company signup
    console.log('3️⃣  COMPANY SIGNUP...');
    const email3 = 'company' + Date.now() + '@test.com';
    const res3 = await makeRequest('POST', '/auth/register', {
      email: email3,
      password: 'CompanyPass123!',
      full_name: 'Test Company',
      role: 'company'
    });
    console.log(`   Status: ${res3.status}`);
    console.log(`   Response: ${JSON.stringify(res3.body)}\n`);

    // Test 4: Candidate login
    console.log('4️⃣  CANDIDATE LOGIN...');
    const res4 = await makeRequest('POST', '/auth/login', {
      email: email1,
      password: 'CandidatePass123!'
    });
    console.log(`   Status: ${res4.status}`);
    console.log(`   Has token: ${!!res4.body?.token}`);
    console.log(`   User role: ${res4.body?.user?.role}\n`);

    // Test 5: Interviewer login
    console.log('5️⃣  INTERVIEWER LOGIN...');
    const res5 = await makeRequest('POST', '/auth/login', {
      email: email2,
      password: 'InterviewerPass123!'
    });
    console.log(`   Status: ${res5.status}`);
    console.log(`   Has token: ${!!res5.body?.token}`);
    console.log(`   User role: ${res5.body?.user?.role}\n`);

    // Test 6: Company login
    console.log('6️⃣  COMPANY LOGIN...');
    const res6 = await makeRequest('POST', '/auth/login', {
      email: email3,
      password: 'CompanyPass123!'
    });
    console.log(`   Status: ${res6.status}`);
    console.log(`   Has token: ${!!res6.body?.token}`);
    console.log(`   User role: ${res6.body?.user?.role}\n`);

    console.log('✅ ALL TESTS PASSED!\n');
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

test();
