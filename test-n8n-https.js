const https = require('https');

function fetchMapsRaw(url) {
    return new Promise((resolve, reject) => {
        https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0', 'Connection': 'close' } }, (res) => {
            if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
                return resolve(fetchMapsRaw(res.headers.location.startsWith('http') ? res.headers.location : 'https://www.google.com' + res.headers.location));
            }
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => resolve({ finalUrl: url, body: data }));
            res.on('error', reject);
        }).on('error', reject);
    });
}

const fetchWithTimeout = (url, timeoutMs) => {
    return Promise.race([
        fetchMapsRaw(url),
        new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout de 5 segundos excedido al leer Maps')), timeoutMs))
    ]);
};

const url = "https://maps.app.goo.gl/mTpJSHaNy7wH6hRP8?g_st=awb";

async function test() {
    let p = { latitude: '', longitude: '' };
    try {
        const { finalUrl, body } = await fetchWithTimeout(url, 5000);
        console.log("FINAL URL Length:", finalUrl.length);
        console.log("HTML LENGTH:", body.length);
        let coordsMatch = body.match(/center=(-?\d+\.\d+)%2C(-?\d+\.\d+)/);
        if(!coordsMatch) coordsMatch = body.match(/ll=(-?\d+\.\d+),(-?\d+\.\d+)/);
        console.log("COORD MATCH:", coordsMatch ? coordsMatch[0] : null);
    } catch(e) {
        console.log("ERROR CATCH ALREDEDOR DE FETCH:", e.message);
        p.latitude = '0';
        p.longitude = '0';
        p.error = 'Falló obtención de ubicación remota: ' + e.message;
        console.log("Objeto modificado:", p);
    }
}
test();
