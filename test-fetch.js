const url = "https://maps.app.goo.gl/mTpJSHaNy7wH6hRP8?g_st=awb";
async function test() {
    try {
        const fetch = global.fetch || require('node-fetch');
        const response = await fetch(url, { redirect: 'follow', headers: { 'User-Agent': 'Mozilla/5.0' } });
        console.log("FINAL URL:", response.url);
        const text = await response.text();
        console.log("HTML LENGTH:", text.length);
        let coordsMatch = text.match(/center=(-?\d+\.\d+)%2C(-?\d+\.\d+)/);
        if(!coordsMatch) coordsMatch = text.match(/ll=(-?\d+\.\d+),(-?\d+\.\d+)/);
        console.log("COORD MATCH:", coordsMatch ? coordsMatch[0] : null);
    } catch(e) {
        console.log("ERROR:", e);
    }
}
test();
