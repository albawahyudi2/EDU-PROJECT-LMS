/**
 * QUICK API DIAGNOSTIC
 * Check if API is accessible and what errors we're getting
 */

const API_URL = process.env.API_URL || 'https://edu-project-lms-production.up.railway.app/graphql';

async function testAPI() {
  console.log('Testing API:', API_URL);
  console.log('');
  
  // Test 1: Simple health check query
  console.log('Test 1: Login query');
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `
          mutation Login($email: String!, $password: String!) {
            login(email: $email, password: $password) {
              accessToken
              user {
                name
                role
              }
            }
          }
        `,
        variables: {
          email: 'guru@lms-abk.com',
          password: 'password123'
        }
      }),
    });
    
    console.log('Status:', response.status);
    console.log('OK:', response.ok);
    
    const text = await response.text();
    console.log('Raw Response:', text.substring(0, 500));
    
    try {
      const data = JSON.parse(text);
      console.log('\nParsed Response:');
      console.log(JSON.stringify(data, null, 2));
    } catch (e) {
      console.log('Could not parse as JSON');
    }
  } catch (error) {
    console.log('Error:', error.message);
  }
}

testAPI();
