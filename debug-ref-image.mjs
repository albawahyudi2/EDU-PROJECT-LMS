// Login to prod and get the step referenceImage URL
const PROD_URL = 'https://edu-project-lms-production-9c20.up.railway.app/graphql';

async function req(query, vars, token) {
  const res = await fetch(PROD_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: JSON.stringify({ query, variables: vars || {} }),
  });
  return res.json();
}

async function main() {
  // Login
  const loginRes = await req(`
    mutation { login(input: { email: "guru@lms-abk.com", password: "Guru123!" }) { accessToken } }
  `);
  
  if (!loginRes.data?.login?.accessToken) {
    console.log('Login failed:', JSON.stringify(loginRes, null, 2));
    return;
  }
  const token = loginRes.data.login.accessToken;
  console.log('✅ Logged in');

  // Get classrooms
  const classroomsRes = await req(`
    query { classrooms { id name } }
  `, null, token);
  
  const classrooms = classroomsRes.data?.classrooms || [];
  console.log('Classrooms:', classrooms.map(c => c.name));
  
  if (classrooms.length === 0) return;

  // Get classroom detail
  const detailRes = await req(`
    query($id: String!) {
      classroomDetail(classroomId: $id) {
        id name
        subjects {
          id name
          modules {
            id title
            lessons {
              id title
              assignments {
                id title type
                taskSteps { id stepNumber instruction referenceImage }
              }
            }
          }
        }
      }
    }
  `, { id: classrooms[0].id }, token);

  const detail = detailRes.data?.classroomDetail;
  if (!detail) {
    console.log('No detail:', JSON.stringify(detailRes, null, 2));
    return;
  }

  for (const subj of detail.subjects) {
    for (const mod of subj.modules) {
      for (const lesson of mod.lessons) {
        for (const asgn of lesson.assignments) {
          if (asgn.type === 'TASK_ANALYSIS' && asgn.taskSteps?.length > 0) {
            console.log(`\nAssignment: "${asgn.title}"`);
            for (const step of asgn.taskSteps) {
              console.log(`  Step ${step.stepNumber}: "${step.instruction}"`);
              console.log(`  referenceImage: "${step.referenceImage}"`);
              if (step.referenceImage) {
                // Test HEAD request on the URL
                const imgUrl = step.referenceImage.startsWith('http') ? step.referenceImage : `https://${step.referenceImage}`;
                console.log(`  → Image URL: ${imgUrl}`);
                try {
                  const imgRes = await fetch(imgUrl, { method: 'HEAD' });
                  console.log(`    Status: ${imgRes.status} ${imgRes.statusText}`);
                  console.log(`    Content-Type: ${imgRes.headers.get('content-type')}`);
                  console.log(`    Access-Control-Allow-Origin: ${imgRes.headers.get('access-control-allow-origin')}`);
                  console.log(`    Content-Security-Policy: ${imgRes.headers.get('content-security-policy')}`);
                  console.log(`    X-Frame-Options: ${imgRes.headers.get('x-frame-options')}`);
                } catch (e) {
                  console.log(`    Fetch error: ${e.message}`);
                }
              }
            }
          }
        }
      }
    }
  }
}

main().catch(console.error);
