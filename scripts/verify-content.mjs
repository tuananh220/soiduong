#!/usr/bin/env node
/**
 * Kiểm chứng nội dung học thuật của Soi Đường.
 *
 * Chạy:      npm run verify:content
 * Kiểm link: npm run verify:links     (thêm --check-links --strict để fail khi link hỏng)
 *
 * Các bất biến được kiểm tra (mục tiêu: nội dung sai nguồn không thể lọt vào repo):
 *  1. Mọi trích dẫn đều có nguồn dẫn (và có link tra cứu với dữ liệu học thuật).
 *  2. Không nêu số trang — vì số trang thay đổi giữa các lần in của Hồ Chí Minh toàn tập.
 *  3. Trích dẫn không phải "Nguyên văn" thì phải có ghi chú giải thích.
 *  4. Mục "Kiểm chứng trích dẫn" phải có bằng chứng và cách dùng đúng.
 *  5. Mọi tham chiếu chuyên đề (topicId) phải tồn tại.
 *  6. Lộ trình và trò chơi phải tham chiếu dữ liệu có thật.
 */

import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dataDir = path.join(root, "data");

const errors = [];
const warnings = [];
let checkedQuotes = 0;
let checkedLinks = 0;

function fail(message) {
  errors.push(message);
}

function warn(message) {
  warnings.push(message);
}

async function loadJson(name) {
  const raw = await readFile(path.join(dataDir, name), "utf8");
  return JSON.parse(raw);
}

const PAGE_NUMBER_PATTERN = /\b(tr\.|trang)\s*\d+/i;
const URL_PATTERN = /^https?:\/\//;

/** Kiểm tra một trích dẫn có đủ nguồn, link và ghi chú theo quy tắc biên soạn. */
function checkQuote({ label, text, source, sourceUrl, level, note, requireUrl = true }) {
  checkedQuotes += 1;

  if (!source || !source.trim()) {
    fail(`${label}: thiếu trường "source"`);
  } else if (PAGE_NUMBER_PATTERN.test(source)) {
    fail(
      `${label}: nguồn có số trang ("${source}") — quy tắc biên soạn của dự án không nêu số trang`,
    );
  }

  if (requireUrl) {
    if (!sourceUrl) {
      fail(`${label}: thiếu "sourceUrl" để người đọc tự tra cứu`);
    } else if (!URL_PATTERN.test(sourceUrl)) {
      fail(`${label}: "sourceUrl" không phải URL hợp lệ ("${sourceUrl}")`);
    }
  }

  if (level && level !== "Nguyên văn" && !note) {
    fail(
      `${label}: mức độ "${level}" nhưng thiếu "note" giải thích khác biệt so với nguyên văn`,
    );
  }

  if (!text || text.trim().length < 8) {
    fail(`${label}: nội dung trích dẫn quá ngắn hoặc rỗng`);
  }
}

async function main() {
  const [topics, quotes, audit, ngôn, game, the] = await Promise.all([
    loadJson("tu-tuong.json"),
    loadJson("quotes.json"),
    loadJson("citation-audit.json"),
    loadJson("nguon.json"),
    loadJson("trot-choi.json"),
    loadJson("kien-thuc-nen.json"),
  ]);

  const topicIds = new Set(topics.map((topic) => topic.id));
  const sourceUrls = new Set();

  // 1–3. Trích dẫn trong chuyên đề
  for (const topic of topics) {
    if (!topic.quotes?.length) fail(`Chuyên đề ${topic.id}: không có trích dẫn nào`);
    for (const [index, quote] of (topic.quotes ?? []).entries()) {
      checkQuote({
        label: `tu-tuong.json › ${topic.id} › quote ${index + 1}`,
        text: quote.text,
        source: quote.source,
        sourceUrl: quote.sourceUrl,
        level: quote.level,
        note: quote.note,
      });
      if (quote.sourceUrl) sourceUrls.add(quote.sourceUrl);
    }
  }

  // 1–3. Bộ sưu tập trích dẫn
  for (const quote of quotes) {
    const label = `quotes.json › ${quote.id}`;
    checkQuote({
      label,
      text: quote.front,
      source: quote.source,
      sourceUrl: quote.sourceUrl,
      level: quote.level,
      note: quote.note,
    });
    if (quote.sourceUrl) sourceUrls.add(quote.sourceUrl);
    if (quote.topicId && !topicIds.has(quote.topicId)) {
      fail(`${label}: topicId "${quote.topicId}" không tồn tại trong tu-tuong.json`);
    }
  }

  // 4. Bảng kiểm chứng trích dẫn
  const verdicts = new Set([
    "dung-nguyen-van",
    "gan-sai",
    "sai-nguon",
    "rut-gon",
    "co-dien-ban-khac",
    "tinh-than",
  ]);
  for (const entry of audit) {
    const label = `citation-audit.json › ${entry.id}`;
    if (!verdicts.has(entry.verdict)) fail(`${label}: verdict không hợp lệ (${entry.verdict})`);
    if (!entry.evidence?.trim()) fail(`${label}: thiếu "evidence"`);
    if (!entry.correctUsage?.trim()) fail(`${label}: thiếu "correctUsage"`);
    if (!entry.referenceUrl || !URL_PATTERN.test(entry.referenceUrl)) {
      fail(`${label}: thiếu "referenceUrl" để tra cứu lại`);
    } else {
      sourceUrls.add(entry.referenceUrl);
    }
    if (entry.verdict === "gan-sai" && !/Thanh Tịnh|không phải|nhầm|gán sai/i.test(entry.evidence)) {
      warn(`${label}: verdict "gan-sai" nhưng phần bằng chứng chưa nói rõ ai mới là tác giả`);
    }
  }

  // 5. Trò chơi "Câu này của ai?" — phải có tác giả + giải thích, và tác giả phải nằm trong bộ nhãn
  const authorLabels = new Set(game.authors ?? []);
  if (authorLabels.size < 4) {
    fail("trot-choi.json: cần ít nhất 4 nhãn tác giả để tạo phương án nhiễu");
  }
  if ((game.items ?? []).length < 8) {
    fail("trot-choi.json: cần ít nhất 8 câu để trò chơi đủ biến thiên");
  }
  for (const item of game.items ?? []) {
    const label = `trot-choi.json › ${item.id}`;
    if (!authorLabels.has(item.author)) {
      fail(`${label}: tác giả "${item.author}" không có trong danh sách authors`);
    }
    if (!item.explain?.trim()) fail(`${label}: thiếu "explain"`);
    if (!item.sourceUrl && !item.sourceNote) {
      fail(`${label}: cần "sourceUrl" hoặc "sourceNote"`);
    }
    if (item.sourceUrl) {
      if (!URL_PATTERN.test(item.sourceUrl)) fail(`${label}: sourceUrl không hợp lệ`);
      else sourceUrls.add(item.sourceUrl);
    }
  }

  // 5b. Thẻ kiến thức nền
  if ((the ?? []).length < 8) fail("kien-thuc-nen.json: cần ít nhất 8 thẻ");
  for (const card of the ?? []) {
    const label = `kien-thuc-nen.json › ${card.id}`;
    if (!card.front?.trim() || !card.back?.trim()) fail(`${label}: thiếu mặt trước/sau`);
    if (!card.source?.trim()) fail(`${label}: thiếu "source"`);
  }

  // 6. Lộ trình 7 ngày
  const loTrinh = await loadJson("lo-trinh.json");
  if (loTrinh.length !== 7) fail(`lo-trinh.json: cần đúng 7 ngày, hiện có ${loTrinh.length}`);
  for (const day of loTrinh) {
    const label = `lo-trinh.json › ngày ${day.day}`;
    if (day.topicId && !topicIds.has(day.topicId)) {
      fail(`${label}: topicId "${day.topicId}" không tồn tại`);
    }
    if (!day.tasks?.length) fail(`${label}: chưa có việc cần làm`);
    if (!day.title?.trim()) fail(`${label}: thiếu tiêu đề`);
  }

  // 6b. nguon.json — tài liệu đối chiếu phải có nhãn và ghi chú
  for (const doc of ngôn.documents ?? []) {
    if (!doc.label || !doc.title || !doc.note) {
      fail(`nguon.json: tài liệu "${doc.title ?? "(không tên)"}" thiếu label/title/note`);
    }
  }

  // 7. Kiểm link (tùy chọn)
  const checkLinks = process.argv.includes("--check-links");
  const strictLinks = process.argv.includes("--strict");
  if (checkLinks) {
    const urls = [...sourceUrls];
    console.log(`Đang kiểm ${urls.length} liên kết nguồn...`);
    for (const url of urls) {
      checkedLinks += 1;
      try {
        const response = await fetch(url, {
          method: "GET",
          redirect: "follow",
          signal: AbortSignal.timeout(20000),
          headers: { "user-agent": "soiduong-content-verify/1.0" },
        });
        if (response.status >= 400) {
          const message = `Link trả về ${response.status}: ${url}`;
          if (strictLinks) fail(message);
          else warn(message);
        }
      } catch (error) {
        const message = `Không truy cập được link (${error.name}): ${url}`;
        if (strictLinks) fail(message);
        else warn(message);
      }
    }
  }

  // Báo cáo
  console.log("");
  console.log("── Kiểm chứng nội dung Soi Đường ──");
  console.log(`Trích dẫn đã kiểm: ${checkedQuotes}`);
  console.log(`Mục kiểm chứng     : ${audit.length}`);
  console.log(`Câu trong trò chơi : ${(game.items ?? []).length}`);
  console.log(`Thẻ kiến thức nền  : ${(the ?? []).length}`);
  console.log(`Lộ trình           : ${loTrinh.length} ngày`);
  console.log(`Liên kết nguồn     : ${sourceUrls.size}${checkLinks ? ` (đã kiểm ${checkedLinks})` : ""}`);

  if (warnings.length) {
    console.log("");
    console.log(`⚠ Cảnh báo (${warnings.length}):`);
    warnings.forEach((message) => console.log(`  - ${message}`));
  }

  if (errors.length) {
    console.log("");
    console.log(`✗ Lỗi (${errors.length}):`);
    errors.forEach((message) => console.log(`  - ${message}`));
    process.exitCode = 1;
    return;
  }

  console.log("");
  console.log("✓ Tất cả bất biến nội dung đều đạt.");
}

main().catch((error) => {
  console.error("Không chạy được kiểm chứng:", error);
  process.exitCode = 2;
});
