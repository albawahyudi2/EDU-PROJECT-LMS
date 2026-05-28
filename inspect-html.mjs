async function main() {
  const url = 'https://lms-seven-pied.vercel.app/login';
  const res = await fetch(url);
  const html = await res.text();
  console.log('HTML length:', html.length);
  
  // Search for any occurrence of https:// or http:// in the HTML
  const urlRegex = /https?:\/\/[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}[^\s"'`]*/g;
  const urls = html.match(urlRegex) || [];
  console.log('URLs in HTML:', [...new Set(urls)]);
}
main();
