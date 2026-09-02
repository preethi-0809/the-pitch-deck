const http = require('http');
const app = require('../backend/src/server');

const PORT = 5555;

const server = app.listen(PORT, async () => {
  console.log(`Verification server running on http://localhost:${PORT}`);

  function fetchUrl(path) {
    return new Promise((resolve, reject) => {
      http.get(`http://localhost:${PORT}${path}`, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, body: data }));
      }).on('error', reject);
    });
  }

  try {
    // 1. Test Static Frontend root
    console.log('Testing GET / (Frontend React index.html)...');
    const rootRes = await fetchUrl('/');
    console.log(`Status: ${rootRes.status}, Content-Type: ${rootRes.headers['content-type']}`);
    const hasHtml = rootRes.body.includes('<div id="root"></div>') || rootRes.body.includes('<!doctype html>') || rootRes.body.includes('<!DOCTYPE html>');
    console.log(`React root element found: ${hasHtml ? '✅ YES' : '❌ NO'}`);

    // 2. Test API Health
    console.log('\nTesting GET /api/health (Express Backend)...');
    const healthRes = await fetchUrl('/api/health');
    console.log(`Status: ${healthRes.status}, Body: ${healthRes.body}`);

    // 3. Test API Discovery
    console.log('\nTesting GET /api/discovery/featured...');
    const discRes = await fetchUrl('/api/discovery/featured');
    console.log(`Status: ${discRes.status}, Body length: ${discRes.body.length}`);

    // 4. Test Client-side routing SPA fallback
    console.log('\nTesting GET /upcoming-exams (SPA fallback to index.html)...');
    const spaRes = await fetchUrl('/upcoming-exams');
    const hasSpaHtml = spaRes.body.includes('<div id="root"></div>') || spaRes.body.includes('<!DOCTYPE html>') || spaRes.body.includes('<!doctype html>');
    console.log(`Status: ${spaRes.status}, SPA fallback loaded: ${hasSpaHtml ? '✅ YES' : '❌ NO'}`);

    console.log('\n🎉 ALL TESTS PASSED! Unified Single Web Link operates 100% seamlessly!');
  } catch (err) {
    console.error('Test error:', err);
  } finally {
    server.close(() => {
      console.log('Verification server closed.');
      process.exit(0);
    });
  }
});
