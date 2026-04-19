/**
 * Strip HTML for plain-text matching (headings/eyecatch/content from Quill).
 */
export function stripHtml(html) {
  if (html == null || typeof html !== "string") return "";
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Filter posts by optional category (exact, case-insensitive) and search query
 * (matches plain text in heading, eyecatch, body, or category name).
 */
export function filterPosts(
  posts,
  { searchQuery = "", categoryFilter = "" } = {}
) {
  if (!Array.isArray(posts)) return [];

  const q = String(searchQuery).trim().toLowerCase();
  const cat = String(categoryFilter).trim();

  return posts.filter((b) => {
    if (!b) return false;

    if (cat) {
      const bc = String(b.category || "").trim();
      if (bc.toLowerCase() !== cat.toLowerCase()) return false;
    }

    if (!q) return true;

    const headingText = stripHtml(b.heading || "").toLowerCase();
    const eyeText = stripHtml(b.eyecatch || "").toLowerCase();
    const contentText = stripHtml(b.content || "").toLowerCase();
    const catText = String(b.category || "").toLowerCase();

    return (
      headingText.includes(q) ||
      eyeText.includes(q) ||
      contentText.includes(q) ||
      catText.includes(q)
    );
  });
}
