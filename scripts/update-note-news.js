const fs = require("fs");
const https = require("https");
const xml2js = require("xml2js");

const RSS_URL = "https://note.com/saitolabo/rss/";

function fetchText(url) {
  return new Promise((resolve, reject) => {
    https.get(
      url,
      {
        headers: {
          "User-Agent": "Mozilla/5.0",
          "Accept": "application/rss+xml, application/xml, text/xml;q=0.9, */*;q=0.8"
        }
      },
      (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          const redirectedUrl = new URL(res.headers.location, url).toString();
          return resolve(fetchText(redirectedUrl));
        }

        if (res.statusCode !== 200) {
          return reject(
            new Error(`RSS fetch failed: ${res.statusCode} ${res.statusMessage}`)
          );
        }

        let data = "";
        res.on("data", (chunk) => {
          data += chunk;
        });
        res.on("end", () => resolve(data));
      }
    ).on("error", reject);
  });
}

// ★ タイトルから日付抽出
function extractDateFromTitle(title) {
  const match = title.match(/(\d{4})年(\d{1,2})月(\d{1,2})日/);
  if (!match) return null;

  const [_, y, m, d] = match;
  const date = new Date(Number(y), Number(m) - 1, Number(d));

  return {
    timestamp: date.getTime(),
    label: `${y}年${Number(m)}月${Number(d)}日`
  };
}

(async () => {
  try {
    const xml = await fetchText(RSS_URL);
    const parsed = await xml2js.parseStringPromise(xml, { explicitArray: false });

    const items = parsed?.rss?.channel?.item || [];
    const normalized = Array.isArray(items) ? items : [items];

    const feed = normalized
      .map((item) => {
        const title = item.title || "タイトル未設定";
        const url = item.link || "https://note.com/saitolabo";

        const extracted = extractDateFromTitle(title);

        return {
          title: title,
          url: url,
          timestamp: extracted ? extracted.timestamp : 0,
          dateLabel: extracted ? extracted.label : ""
        };
      })
      .sort((a, b) => b.timestamp - a.timestamp);

    fs.writeFileSync("data/note-feed.json", JSON.stringify(feed, null, 2), "utf-8");
    console.log("data/note-feed.json updated");
    console.log(feed);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
})();
