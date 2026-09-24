import { test } from "node:test";
import assert from "node:assert/strict";
import { getProgress, getShareUrl, getSource, videoSource, withSource } from "../src/lib/links.ts";

test("attribution preserves the official destination and its existing parameters", () => {
  const allowed = ["school", "family", "instagram", "healthcare"];
  for (const source of allowed) {
    assert.equal(getSource(`?source=${source}`, allowed), source);
    const url = new URL(withSource("https://ignitehope.phoenixchildrensfoundation.org/justin-liang?existing=1", source));
    assert.equal(url.origin, "https://ignitehope.phoenixchildrensfoundation.org");
    assert.equal(url.pathname, "/justin-liang");
    assert.equal(url.searchParams.get("source"), source);
    assert.equal(url.searchParams.get("existing"), "1");
  }
  assert.equal(getSource("?source=https://untrusted.example", allowed), null);
});
test("sharing uses landing page URL and removes incidental search data and section hashes", () => {
  assert.equal(getShareUrl("https://example.org", "http://localhost:3000/#share", "family"), "https://example.org/?source=family");
  assert.equal(getShareUrl("", "https://example.org/?secret=private&source=school#share", "school"), "https://example.org/?source=school");
});
test("unknown amounts are distinct from zero and the visual meter remains bounded", () => {
  assert.equal(getProgress(null, 1000), null);
  assert.equal(getProgress(0, 1000), 0);
  assert.equal(getProgress(500, 1000), 50);
  assert.equal(getProgress(1400, 1000), 100);
  assert.equal(getProgress(-10, 1000), 0);
  assert.equal(getProgress(50, 0), null);
});
test("video configuration accepts supported formats and rejects unsafe protocols", () => {
  assert.equal(videoSource("") , null);
  assert.equal(videoSource("javascript:alert(1)"), null);
  assert.equal(videoSource("not a URL"), null);
  assert.deepEqual(videoSource("/videos/message.mp4"), {type:"file", url:"/videos/message.mp4"});
  assert.deepEqual(videoSource("https://youtu.be/abcdefghijk"), {type:"embed",url:"https://www.youtube-nocookie.com/embed/abcdefghijk?autoplay=1"});
  assert.deepEqual(videoSource("https://vimeo.com/123456789"), {type:"embed",url:"https://player.vimeo.com/video/123456789?autoplay=1"});
});
