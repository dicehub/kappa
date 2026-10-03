import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { htmlToMarkdown, normalizeTableWhitespace } from "./html-to-markdown.ts";

describe("normalizeTableWhitespace", () => {
  it("keeps formatted GFM tables on one line", () => {
    const html = `<main>
      <table>
        <thead><tr><th>Prop</th><th>Type</th></tr></thead>
        <tbody><tr><td><code>variant</code></td><td><code>"primary" | "secondary"</code></td></tr></tbody>
      </table>
    </main>`;

    const normalized = normalizeTableWhitespace(html);
    assert.match(normalized, /<table><thead><tr><th>Prop<\/th>/);
    assert.match(htmlToMarkdown(html), /`"primary" \\| "secondary"`/);
  });
});

describe("htmlToMarkdown", () => {
  it("preserves page navigation while removing shell-only content", () => {
    const html = `<main>
      <h1>Components</h1>
      <span data-copy-ignore>Copy page</span>
      <nav aria-label="Component directory"><ul><li><a href="/docs/components/button">Button</a></li></ul></nav>
      <aside aria-label="On this page">On this page</aside>
      <footer>Footer</footer>
    </main>`;

    const markdown = htmlToMarkdown(html);
    assert.match(markdown, /^# Components/m);
    assert.match(markdown, /\[Button\]\(\/docs\/components\/button\)/);
    assert.doesNotMatch(markdown, /Copy page|On this page|Footer/);
  });

  it("writes fenced code and ignores decorative anchors", () => {
    const html = `<main>
      <h2>All Components <span data-copy-ignore>#</span></h2>
      <pre><code>pnpm install\npnpm dev</code></pre>
    </main>`;

    const markdown = htmlToMarkdown(html);
    assert.match(markdown, /^## All Components$/m);
    assert.match(markdown, /```\npnpm install\npnpm dev\n```/);
  });

  it("reduces Shiki markup to a clean language fence", () => {
    const html = `<main>
      <div class="docs-code-block" data-code-block data-code-expanded="false">
        <div data-code-preview data-copy-ignore>
          <pre data-language="typescript"><code>const answer =</code></pre>
        </div>
        <div id="example-code" data-code-full>
          <pre class="astro-code astro-code-themes github-light github-dark" data-language="typescript"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">const</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8"> answer = </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF">42</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">;</span></span></code></pre>
          <button type="button" aria-label="Copy code" data-copy-ignore><svg aria-hidden="true"><path /></svg></button>
        </div>
        <div data-code-reveal-overlay data-copy-ignore><button>View Code</button></div>
      </div>
    </main>`;

    const markdown = htmlToMarkdown(html);
    assert.equal(markdown, "```typescript\nconst answer = 42;\n```");
    assert.doesNotMatch(markdown, /astro-code|shiki|Copy code|View Code|<span/);
  });

  it("keeps a marked reference island and drops ordinary demo islands", () => {
    const html = `<main>
      <astro-island uid="ref" component-url="/reference.js" props="{}">
        <div class="docs-colors-reference" data-markdown-keep>
          <div class="docs-colors-search" data-copy-ignore>
            <p>Search token name or purpose</p>
          </div>
          <article data-colors-token-row>Kept reference row</article>
        </div>
      </astro-island>
      <astro-island uid="demo" component-url="/demo.js" props="{}">
        <div class="demo">Interactive demo only</div>
      </astro-island>
    </main>`;

    const markdown = htmlToMarkdown(html);
    assert.match(markdown, /Kept reference row/);
    assert.doesNotMatch(markdown, /Interactive demo only/);
    assert.doesNotMatch(markdown, /Search token name or purpose/);
    assert.doesNotMatch(markdown, /astro-island|data-markdown-keep/);
  });

  it("removes copy-ignore paragraphs and hidden empty states", () => {
    const html = `<main>
      <p>Kept paragraph</p>
      <p data-copy-ignore>Hidden paragraph</p>
      <p class="docs-colors-empty" hidden data-copy-ignore>No tokens match this search.</p>
      <p>Also kept</p>
    </main>`;

    const markdown = htmlToMarkdown(html);
    assert.match(markdown, /Kept paragraph/);
    assert.match(markdown, /Also kept/);
    assert.doesNotMatch(markdown, /Hidden paragraph|No tokens match this search/);
  });
});
