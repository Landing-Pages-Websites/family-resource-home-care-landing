import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { createElement } from "react";
import { prerenderToNodeStream } from "react-dom/static";
import { MARKET_IMAGES, type MarketImage } from "./images";
import { SectionBackdrop } from "./components/SectionBackdrop";

const HERO_OPACITY = "opacity-[0.18]";
const PRELOAD = /<link rel="preload" as="image"[^>]*>/g;
const IMG = /<img [^>]*>/g;

async function render(image: MarketImage, priority?: boolean): Promise<string> {
  const backdrop = createElement(SectionBackdrop, { image, opacity: HERO_OPACITY, priority });
  const page = createElement("html", null, createElement("head"), createElement("body", null, backdrop));
  const { prelude } = await prerenderToNodeStream(page);
  let html = "";
  for await (const chunk of prelude) html += chunk;
  return html;
}

describe("hero backdrop request priority", () => {
  it("hints the priority hero preload and img as high exactly once", async () => {
    const html = await render(MARKET_IMAGES.heroBg, true);
    const preloads = html.match(PRELOAD) ?? [];
    const imgs = html.match(IMG) ?? [];
    assert.equal(preloads.length, 1);
    assert.equal(imgs.length, 1);
    assert.match(preloads[0], /fetchPriority="high"/);
    assert.match(preloads[0], /imageSizes="\(min-width: 1024px\) 140vw, 100vw"/);
    assert.match(preloads[0], /frhc-hug-moment\.webp&amp;w=750&amp;q=75 750w/);
    assert.match(imgs[0], /fetchPriority="high"/);
    assert.ok(imgs[0].includes(`class="object-cover object-center ${HERO_OPACITY}"`));
  });

  it("leaves non-priority backdrops lazy, unpreloaded and unhinted", async () => {
    const html = await render(MARKET_IMAGES.photoBand);
    assert.doesNotMatch(html, /rel="preload"/);
    assert.doesNotMatch(html, /fetchPriority/);
    assert.match(html, /loading="lazy"/);
  });
});
