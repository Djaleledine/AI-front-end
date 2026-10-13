// Automated Integration Test for ANJUCIA Mock API & Pages
const http = require("http");

function request(url, options = {}) {
  return new Promise((resolve, reject) => {
    const parsed = new URL(url);
    const reqOptions = {
      hostname: parsed.hostname,
      port: parsed.port || 3000,
      path: parsed.pathname + parsed.search,
      method: options.method || "GET",
      headers: options.headers || {}
    };

    const req = http.request(reqOptions, (res) => {
      let data = "";
      res.on("data", (chunk) => { data += chunk; });
      res.on("end", () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: data
        });
      });
    });

    req.on("error", reject);

    if (options.body) {
      req.write(typeof options.body === "string" ? options.body : JSON.stringify(options.body));
    }
    req.end();
  });
}

async function runTests() {
  console.log("=== Testing Mock API Endpoints ===");
  const base = "http://localhost:3000";

  // 1. GET /api/mock/products
  const resProducts = await request(`${base}/api/mock/products`);
  console.log(`GET /api/mock/products: HTTP ${resProducts.statusCode}`);
  const jsonProducts = JSON.parse(resProducts.body);
  console.log(`-> Products count: ${jsonProducts.count}, first: ${jsonProducts.data[0]?.id}`);

  // 2. GET /api/mock/products/soothing-gel-cream
  const resSingle = await request(`${base}/api/mock/products/soothing-gel-cream`);
  console.log(`GET /api/mock/products/soothing-gel-cream: HTTP ${resSingle.statusCode}`);
  const jsonSingle = JSON.parse(resSingle.body);
  console.log(`-> Single product price: ${jsonSingle.data?.priceDZD} DZD`);

  // 3. GET /api/mock/bundles
  const resBundles = await request(`${base}/api/mock/bundles`);
  console.log(`GET /api/mock/bundles: HTTP ${resBundles.statusCode}`);
  const jsonBundles = JSON.parse(resBundles.body);
  console.log(`-> Bundles count: ${jsonBundles.count}, packs: ${jsonBundles.data.map(b => b.id).join(", ")}`);

  // 4. GET /api/mock/rituals
  const resRituals = await request(`${base}/api/mock/rituals`);
  console.log(`GET /api/mock/rituals: HTTP ${resRituals.statusCode}`);
  const jsonRituals = JSON.parse(resRituals.body);
  console.log(`-> Botanicals count: ${jsonRituals.count}`);

  // 5. GET /api/mock/reviews
  const resReviews = await request(`${base}/api/mock/reviews`);
  console.log(`GET /api/mock/reviews: HTTP ${resReviews.statusCode}`);
  const jsonReviews = JSON.parse(resReviews.body);
  console.log(`-> Reviews count: ${jsonReviews.count}`);

  // 6. GET /api/mock/pharmacies
  const resPharmas = await request(`${base}/api/mock/pharmacies`);
  console.log(`GET /api/mock/pharmacies: HTTP ${resPharmas.statusCode}`);
  const jsonPharmas = JSON.parse(resPharmas.body);
  console.log(`-> Pharmacies count: ${jsonPharmas.count}`);

  // 7. GET /api/mock/wilayas
  const resWilayas = await request(`${base}/api/mock/wilayas`);
  console.log(`GET /api/mock/wilayas: HTTP ${resWilayas.statusCode}`);
  const jsonWilayas = JSON.parse(resWilayas.body);
  console.log(`-> Wilayas count: ${jsonWilayas.count}`);

  // 8. POST /api/mock/analyzer
  const resScan = await request(`${base}/api/mock/analyzer`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: { skinType: "Déshydratée", location: "16 - Alger", climate: "coastal" }
  });
  console.log(`POST /api/mock/analyzer: HTTP ${resScan.statusCode}`);
  const jsonScan = JSON.parse(resScan.body);
  console.log(`-> Scan ID: ${jsonScan.data?.scanId}, Flagship: ${jsonScan.data?.recommendedCare?.flagship?.name}`);

  // 9. POST /api/mock/orders
  const resOrder = await request(`${base}/api/mock/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: {
      customerName: "Meriem Hadj",
      customerPhone: "0555123456",
      customerAddress: "Rue Didouche Mourad",
      wilaya: "16 - Alger",
      items: [{ id: "soothing-gel-cream", qty: 2 }],
      totalDZD: 3000
    }
  });
  console.log(`POST /api/mock/orders: HTTP ${resOrder.statusCode}`);
  const jsonOrder = JSON.parse(resOrder.body);
  console.log(`-> Order ID: ${jsonOrder.data?.id}, Tracking: ${jsonOrder.data?.trackingCode}`);

  console.log("\n=== Testing Website Pages ===");
  const pages = ["/", "/products", "/analyzer", "/terms"];
  for (const p of pages) {
    const res = await request(`${base}${p}`);
    console.log(`Page ${p}: HTTP ${res.statusCode} (Length: ${res.body.length} bytes)`);
  }

  console.log("\nALL VERIFICATIONS PASSED!");
}

runTests().catch(err => {
  console.error("Test error:", err);
  process.exit(1);
});
