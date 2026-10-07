const host = "www.tarat.space";
const origin = `https://${host}`;
const key = "40f1e4c3b4d8c66bff476aa060ecfaf0";
const keyLocation = `${origin}/${key}.txt`;

async function fetchChecked(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    redirect: "error",
    signal: AbortSignal.timeout(30_000),
  });
  if (!response.ok) throw new Error(`${url} returned HTTP ${response.status}`);
  return response;
}

try {
  const keyResponse = await fetchChecked(keyLocation);
  if ((await keyResponse.text()).trim() !== key) {
    throw new Error("The live ownership key does not match. Deploy the key file before submitting.");
  }

  const sitemapResponse = await fetchChecked(`${origin}/sitemap.xml`);
  const sitemap = await sitemapResponse.text();
  if (!/<urlset(?:\s|>)/.test(sitemap)) throw new Error("Expected a sitemap URL set.");
  const urls = [...sitemap.matchAll(/<loc>\s*([^<]+?)\s*<\/loc>/g)].map((match) => {
    const value = match[1].replace(/&amp;/g, "&").replace(/&quot;/g, '"')
      .replace(/&apos;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">");
    const url = new URL(value);
    if (url.origin !== origin || url.username || url.password || url.search || url.hash) {
      throw new Error(`Sitemap contains a noncanonical URL: ${value}`);
    }
    return url.href;
  });
  const urlList = [...new Set(urls)];
  if (urlList.length === 0 || urlList.length > 10_000) {
    throw new Error(`Expected 1–10,000 sitemap URLs; found ${urlList.length}.`);
  }

  const response = await fetchChecked("https://api.indexnow.org/indexnow", {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({ host, key, keyLocation, urlList }),
  });
  if (response.status === 200) {
    console.log(`HTTP 200: IndexNow accepted ${urlList.length} URLs. This does not confirm indexing.`);
  } else if (response.status === 202) {
    console.log(`HTTP 202: IndexNow received ${urlList.length} URLs; ownership key verification is pending. This does not confirm indexing.`);
  } else {
    throw new Error(`Unexpected IndexNow response: HTTP ${response.status}`);
  }
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
