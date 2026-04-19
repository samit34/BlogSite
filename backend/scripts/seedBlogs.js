/**
 * Seeds ~50 blog posts with cover images downloaded from Lorem Picsum (internet photos).
 *
 * Usage (from backend folder):
 *   npm run seed:blogs
 *
 * Re-seed (removes previous posts by seed_blogger, then inserts 50 new rows):
 *   npm run seed:blogs -- --reset
 *
 * Requires MONGO_URI (and optional MONGO_DB_NAME) in .env — same as server.js.
 */

require("dotenv").config();
const path = require("path");
const fs = require("fs");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { connectDB } = require("../config/ds");
const blogcontent = require("../model/blogcontentschema");
const blogcategory = require("../model/category");
const User = require("../model/userschema");

const UPLOADS_DIR = path.join(__dirname, "..", "uploads");
const SEED_USERNAME = "seed_blogger";
const BLOG_COUNT = 50;

const RESET = process.argv.includes("--reset");

const SEED_CATEGORIES = [
  "Technology",
  "Travel",
  "Food",
  "Culture",
  "Design",
  "Wellness",
  "Science",
  "Art",
];

const TITLES = [
  "Why small habits beat big resolutions",
  "Notes from a slow morning in Lisbon",
  "The quiet comeback of RSS readers",
  "Cooking with what you already have",
  "Design systems that teams actually use",
  "Walking as a serious productivity hack",
  "What we get wrong about remote work",
  "A weekend guide to cheap film cameras",
  "How I learned to love boring code",
  "Coffee shops and the art of showing up",
  "Minimalism without the aesthetic guilt",
  "The case for longer blog posts",
  "Why your backlog is lying to you",
  "Seasonal eating without the preachiness",
  "Typography mistakes I still make",
  "Sleep, screens, and stubborn optimism",
  "Building side projects without burning out",
  "Trains, planes, and accidental detours",
  "The playlist that saved my winter",
  "Learning in public: year two",
  "What museums taught me about focus",
  "On saying no without sounding rude",
  "Bread baking for impatient people",
  "The indie web is still here",
  "How I organize digital photos now",
  "Running without tracking every mile",
  "Books that changed how I read",
  "Why I deleted half my apps",
  "A love letter to neighborhood libraries",
  "CSS that finally clicked",
  "Journaling when you hate journaling",
  "The best gear is the gear you use",
  "Negotiating as an introvert",
  "What I pack for a week away",
  "Music discovery in the streaming age",
  "Fixing my relationship with email",
  "Plants I haven’t killed (yet)",
  "The myth of the perfect morning routine",
  "Honest notes on learning TypeScript",
  "Cheap flights, expensive lessons",
  "Soup season is a state of mind",
  "How constraints make better art",
  "The case for printing your photos",
  "Meetings that could have been memos",
  "A short history of my desk setup",
  "Why I still carry a paper notebook",
  "Weekend projects that shipped",
  "On finding your voice online",
  "The last fifty posts start here",
  "Closing the loop on a long experiment",
];

function loremParagraph(seed) {
  const snippets = [
    "Ideas travel farther when they are packaged with care. Start with one clear claim, then let the details breathe.",
    "Most advice fails because it ignores context. What works in one season may quietly fail in the next.",
    "The best stories leave room for the reader. You do not need to say everything—only the truest parts.",
    "Small experiments beat big promises. Ship something modest, observe, then adjust with intention.",
    "Attention is finite. Protect it like a budget: spend deliberately, audit often, and forgive the waste.",
  ];
  const a = snippets[seed % snippets.length];
  const b = snippets[(seed + 2) % snippets.length];
  return `<p>${a}</p><p>${b}</p><p>Thanks for reading—if this resonated, save it for a slower day.</p>`;
}

async function downloadImage(url, destPath) {
  const res = await fetch(url, { redirect: "follow" });
  if (!res.ok) {
    throw new Error(`GET ${url} → ${res.status}`);
  }
  const buf = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(destPath, buf);
}

async function ensureCategories() {
  let list = await blogcategory.find();
  if (list.length > 0) return list;

  for (const category of SEED_CATEGORIES) {
    await blogcategory.create({ category });
  }
  return blogcategory.find();
}

async function ensureSeedUser() {
  let user = await User.findOne({ username: SEED_USERNAME });
  if (user) return user;

  const hashed = await bcrypt.hash("SeedPass123!", 10);
  user = await User.create({
    username: SEED_USERNAME,
    email: "seed_blogger@example.local",
    password: hashed,
    role: "user",
  });
  console.log(`Created seed user "${SEED_USERNAME}" (password: SeedPass123!)`);
  return user;
}

async function main() {
  await connectDB();

  if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  }

  const categories = await ensureCategories();
  const user = await ensureSeedUser();
  const userId = String(user._id);

  if (RESET) {
    const removed = await blogcontent.deleteMany({ username: SEED_USERNAME });
    console.log(
      `Removed ${removed.deletedCount} existing posts by ${SEED_USERNAME}.`
    );
  }

  console.log(`Downloading images from picsum.photos and inserting ${BLOG_COUNT} posts…`);

  let created = 0;
  for (let i = 0; i < BLOG_COUNT; i++) {
    const filename = `seed-${Date.now()}-${i}.jpg`;
    const filePath = path.join(UPLOADS_DIR, filename);
    /** Stable unique photo per post (Lorem Picsum seed — no invalid id 404s). */
    const imageUrl = `https://picsum.photos/seed/blogsite-${i}/1200/800`;

    try {
      await downloadImage(imageUrl, filePath);
    } catch (err) {
      console.warn(`Image ${i + 1} failed, retrying with random…`, err.message);
      try {
        await downloadImage(
          `https://picsum.photos/1200/800?random=${Date.now() + i}`,
          filePath
        );
      } catch (err2) {
        console.error(`Skipping post ${i + 1}:`, err2.message);
        continue;
      }
    }

    const title = TITLES[i] || `Story ${i + 1}`;
    const catDoc = categories[i % categories.length];
    const category = catDoc.category;

    const deckPlain = `A short read on ${category.toLowerCase()}—ideas worth saving.`.slice(
      0,
      70
    );

    const heading = `<p>${title}</p>`;
    const eyecatch = `<p>${deckPlain}</p>`;
    const content = loremParagraph(i);
    const date = String(Date.now() - i * 86400000);

    await blogcontent.create({
      image: filename,
      heading,
      content,
      category,
      username: user.username,
      userid: userId,
      date,
      eyecatch,
      liked: [],
    });
    created += 1;
  }

  console.log(`Done. Inserted ${created} blog posts (requested ${BLOG_COUNT}).`);
  await mongoose.disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
