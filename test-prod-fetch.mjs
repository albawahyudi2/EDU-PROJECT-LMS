const PROD_URL = 'https://edu-project-lms-production-9c20.up.railway.app/graphql';

async function tryLogin(email, password) {
  try {
    const loginResponse = await fetch(PROD_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `
          mutation Login($email: String!, $password: String!) {
            login(input: { email: $email, password: $password }) {
              accessToken
            }
          }
        `,
        variables: { email, password }
      })
    });

    const body = await loginResponse.json();
    return body;
  } catch (err) {
    return { error: err.message };
  }
}

async function main() {
  console.log('Trying teacher login...');
  let res = await tryLogin('guru@lms-abk.com', 'Guru123!');
  console.log('Teacher login result:', JSON.stringify(res, null, 2));

  if (!res.data?.login?.accessToken) {
    console.log('Trying student login...');
    res = await tryLogin('siswa1@lms-abk.com', 'Siswa123!');
    console.log('Student login result:', JSON.stringify(res, null, 2));
  }

  const token = res.data?.login?.accessToken;
  if (!token) {
    console.log('❌ Could not login with either credentials.');
    return;
  }

  // Fetch all assignments
  const queryResponse = await fetch(PROD_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      query: `
        query MyClassrooms {
          myClassrooms {
            id
            name
            subjects {
              id
              name
              modules {
                id
                title
                lessons {
                  id
                  title
                  assignments {
                    id
                    title
                    type
                    taskSteps {
                      id
                      stepNumber
                      instruction
                      referenceImage
                      isMandatory
                    }
                  }
                }
              }
            }
          }
        }
      `
    })
  });

  const queryData = await queryResponse.json();
  console.log('Query result:', JSON.stringify(queryData, null, 2));
}

main();
