export const EDITORIAL_FALLBACKS = [
  {
    src: "/editorial/desk.jpg",
    title: "Quiet mornings, long sentences",
    cat: "Culture",
    kicker: "Essay",
  },
  {
    src: "/editorial/library.jpg",
    title: "What we keep on the shelf",
    cat: "Books",
    kicker: "Notes",
  },
  {
    src: "/editorial/nature.jpg",
    title: "Light, weather, and the long walk",
    cat: "Travel",
    kicker: "Field",
  },
  {
    src: "/editorial/interior.jpg",
    title: "Rooms that teach you how to look",
    cat: "Design",
    kicker: "Studio",
  },
  {
    src: "/editorial/typewriter.jpg",
    title: "The discipline of a first draft",
    cat: "Craft",
    kicker: "Column",
  },
  {
    src: "/editorial/studio.jpg",
    title: "A desk, a window, a deadline",
    cat: "Work",
    kicker: "Practice",
  },
];

export const PIN_SCROLL_ITEMS = [
  {
    num: "01",
    title: "Find a voice",
    text: "Every issue starts with a point of view—curious, unhurried, and specific. We look for stories that still feel like they belong in print.",
    src: "/editorial/paper.jpg",
  },
  {
    num: "02",
    title: "Shape the pages",
    text: "Photography, type, and white space do the quiet work. Layouts stay generous so the writing can breathe the way a magazine should.",
    src: "/editorial/interior.jpg",
  },
  {
    num: "03",
    title: "Photograph the world",
    text: "We commission and collect images that feel tactile—grain, light, and rooms you could walk into. The picture should earn the headline.",
    src: "/editorial/nature.jpg",
  },
  {
    num: "04",
    title: "Publish with care",
    text: "Edit twice. Cut once more. Then send it live—tagged, saved, and easy to find again when a reader wants to linger.",
    src: "/editorial/typewriter.jpg",
  },
  {
    num: "05",
    title: "Read it slowly",
    text: "This is not a feed. Bookmark what stays with you, wander the archive, and come back when you want another long afternoon.",
    src: "/editorial/library.jpg",
  },
];

export function stripHeading(html = "") {
  return String(html)
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function slidesFromPosts(posts, apiBase, min = 5) {
  const real = (Array.isArray(posts) ? posts : [])
    .filter((p) => p && p.image)
    .slice(0, 8)
    .map((p) => ({
      id: p._id,
      title: stripHeading(p.heading).slice(0, 72),
      cat: p.category || "Story",
      src: `${apiBase}/uploads/${p.image}`,
      to: `/layout/specificblog/${p._id}`,
    }));

  if (real.length >= min) return real;

  const extras = EDITORIAL_FALLBACKS.slice(0, Math.max(min - real.length, 0)).map(
    (item, i) => ({
      id: `editorial-${i}`,
      title: item.title,
      cat: item.cat,
      src: item.src,
      to: "/layout/blog",
    })
  );

  return [...real, ...extras];
}
