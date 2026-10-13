const http = require("http");

const routes = ["/", "/products", "/analyzer", "/terms"];

function checkRoute(path) {
  return new Promise((resolve, reject) => {
    http.get(`http://localhost:3000${path}`, (res) => {
      let data = "";
      res.on("data", (chunk) => {
        data += chunk;
      });
      res.on("end", () => {
        resolve({
          path,
          statusCode: res.statusCode,
          hasScrollEngine: data.includes("global-scroll-progress-bar") || data.includes("scroll-to-top-orb"),
          hasScrollReveal: data.includes("scroll-reveal"),
          dataLength: data.length
        });
      });
    }).on("error", (err) => {
      reject(err);
    });
  });
}

async function run() {
  console.log("Testing routes for scroll animations...");
  for (const r of routes) {
    try {
      const res = await checkRoute(r);
      console.log(`[PASS] ${r} -> Status: ${res.statusCode}, Length: ${res.dataLength}, hasScrollEngine: ${res.hasScrollEngine}, hasScrollReveal: ${res.hasScrollReveal}`);
    } catch (e) {
      console.error(`[FAIL] ${r} ->`, e.message);
    }
  }
}

run();
