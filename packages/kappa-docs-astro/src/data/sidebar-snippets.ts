// read_when: Edit the copyable Vue examples on the Sidebar component page.
const snippets = import.meta.glob<string>("../snippets/sidebar/*.vue", {
  query: "?raw", import: "default", eager: true,
});

export function sidebarSnippet(name: string): string {
  const source = snippets[`../snippets/sidebar/${name}.vue`];
  if (!source) throw new Error(`Missing Sidebar snippet: ${name}`);
  return source;
}
