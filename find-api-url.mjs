async function main() {
  const url = 'https://lms-seven-pied.vercel.app/login';
  console.log(`Fetching Login HTML...`);
  const html = await (await fetch(url)).text();

  const scriptRegex = /<script\s+src="([^"]+)"/g;
  let match;
  const scriptUrls = [];
  while ((match = scriptRegex.exec(html)) !== null) {
    scriptUrls.push(match[1]);
  }

  console.log('Script URLs in Login Page:', scriptUrls);

  // We want to fetch all scripts and find any GraphQL endpoint or API URL
  for (const scriptUrl of scriptUrls) {
    const fullScriptUrl = scriptUrl.startsWith('http') ? scriptUrl : `https://lms-seven-pied.vercel.app${scriptUrl}`;
    console.log(`Scanning script: ${fullScriptUrl}`);
    const code = await (await fetch(fullScriptUrl)).text();

    // Look for any string matches that look like API endpoints or contain /graphql or up.railway.app or onrender.com
    const matches = code.match(/[a-zA-Z0-9.-]+\.up\.railway\.app/g) || [];
    const matchesRender = code.match(/[a-zA-Z0-9.-]+\.onrender\.com/g) || [];
    const matchesGraphql = code.match(/\/graphql/g) || [];
    const matchesHttps = code.match(/https?:\/\/[a-zA-Z0-9.-]+/g) || [];

    if (matches.length > 0) console.log(`  Railway:`, matches);
    if (matchesRender.length > 0) console.log(`  Render:`, matchesRender);
    if (matchesGraphql.length > 0) console.log(`  Graphql matches count:`, matchesGraphql.length);
    if (matchesHttps.length > 0) {
      console.log(`  Domains found:`, [...new Set(matchesHttps)].filter(d => !d.includes('w3.org') && !d.includes('nextjs.org') && !d.includes('react.dev') && !d.includes('vercel.app')));
    }
  }
}

main();
