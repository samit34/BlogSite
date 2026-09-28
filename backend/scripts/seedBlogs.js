/**
 * Seeds many dummy authors + posts so the magazine looks full.
 *
 * Mongo (needs backend/.env MONGO_URI):
 *   npm run seed:blogs -- --reset
 *
 * Live/API (default if --api or SEED_API_URL):
 *   npm run seed:blogs -- --api https://chronic.publicvm.com
 */

const path = require("path");
const fs = require("fs");

const UPLOADS_DIR = path.join(__dirname, "..", "uploads");
const EDITORIAL_DIR = path.join(__dirname, "..", "..", "frontend", "public", "editorial");
const SEED_PASSWORD = "SeedPass123!";
const RESET = process.argv.includes("--reset");

function argValue(flag) {
  const i = process.argv.indexOf(flag);
  if (i === -1) return "";
  return String(process.argv[i + 1] || "").trim();
}

const API_BASE = (
  argValue("--api") ||
  process.env.SEED_API_URL ||
  process.env.REACT_APP_API_URL ||
  ""
).replace(/\/$/, "");

const SEED_CATEGORIES = [
  "Culture",
  "Travel",
  "Design",
  "Food",
  "Photography",
  "Craft",
  "Books",
  "Science",
  "Health",
  "Sports",
  "Wildlife",
  "Technology",
];

const AUTHORS = [
  { username: "Maya Chen", email: "maya.chen.seed@example.com" },
  { username: "Jules Ortega", email: "jules.ortega.seed@example.com" },
  { username: "Priya Nair", email: "priya.nair.seed@example.com" },
  { username: "Sam Whitaker", email: "sam.whitaker.seed@example.com" },
  { username: "Elena Rossi", email: "elena.rossi.seed@example.com" },
  { username: "Theo Park", email: "theo.park.seed@example.com" },
  { username: "Amara Okeke", email: "amara.okeke.seed@example.com" },
  { username: "Nico Vargas", email: "nico.vargas.seed@example.com" },
  { username: "Harper Quinn", email: "harper.quinn.seed@example.com" },
  { username: "Rowan Hale", email: "rowan.hale.seed@example.com" },
];

const TITLES = [
  "Quiet mornings, long sentences",
  "What we keep on the shelf",
  "Light, weather, and the long walk",
  "Rooms that teach you how to look",
  "The discipline of a first draft",
  "A desk, a window, a deadline",
  "Notes from a slow train",
  "How to cook for one without sadness",
  "The last good bookstore in town",
  "Why I still shoot on film",
  "A field guide to city birds",
  "On building a kinder gym habit",
  "Cars I loved and never owned",
  "Science you can feel in your hands",
  "Games that make evenings longer",
  "Funny things my neighbor said",
  "Children and the art of asking why",
  "Health without the hard sell",
  "Wildlife at the edge of the highway",
  "Culture in the grocery aisle",
  "Travel plans that went beautifully wrong",
  "Design for rooms you actually live in",
  "Bread, butter, and better weekends",
  "Craft as a way of paying attention",
  "The playlist that saved February",
  "Libraries after dark",
  "A short history of my walking shoes",
  "How constraints make better pictures",
  "The myth of the perfect morning",
  "Letters I never sent",
  "Markets, spices, and borrowed recipes",
  "What museums taught me about silence",
  "Rain, typewriters, and unfinished essays",
  "The case for a smaller wardrobe",
  "Maps I fold until they tear",
  "On keeping a plant alive",
  "Night trains through small stations",
  "A kitchen with one good knife",
  "Portraits of strangers at the pier",
  "How I learned to rest on purpose",
  "The architecture of a good paragraph",
  "Summer scores and dusty radios",
  "Birds that refuse to leave the city",
  "What we pack when we mean to stay",
  "Ink, paper, and stubborn optimism",
  "A weekend in someone else's kitchen",
  "The long way home from the coast",
  "On collecting postcards, not likes",
  "Tools that earn their drawer",
  "Evenings measured in soup",
  "Why small galleries still matter",
  "The quiet politics of a public park",
  "How to lose an afternoon well",
  "A camera, a bus, a new neighborhood",
  "Stories from the secondhand shop",
  "When the weather writes the day",
  "Learning a city by its bakeries",
  "The last fifty pages of a borrowed book",
  "Work that looks like care",
  "A garden that is mostly weeds",
  "On photographing the same street twice",
  "Friends who cook without recipes",
  "The sound of type in a quiet room",
  "Trains, delays, and decent coffee",
  "What children notice first",
  "A studio with too much light",
  "How I stopped chasing the perfect trip",
  "Markets that smell like rain",
  "The ethics of a slow magazine",
  "Windows worth sitting beside",
  "A coat for every kind of weather",
  "On reading the same poem yearly",
  "The craft of setting a table",
  "Cities that teach you to walk",
  "A notebook that survived three moves",
  "When science feels like wonder",
  "The joy of a well-made spoon",
  "Evenings with no plan at all",
  "How photographs remember for us",
  "A letter from the off-season",
];

function htmlTitle(title) {
  return `<p>${title}</p>`;
}

function htmlDeck(category, author) {
  const line = `${author} on ${category.toLowerCase()}—a piece to keep.`.slice(0, 70);
  return `<p>${line}</p>`;
}

function htmlBody(title, category, author, i) {
  const grafs = [
    `<p>${title} began as a note in the margin. ${author} kept returning to it, the way you return to a street that still has good light at four in the afternoon.</p>`,
    `<p>This is a ${category.toLowerCase()} story, but it is also about attention: what we notice when we slow down enough to let a scene finish speaking.</p>`,
    `<h2>A small method</h2>`,
    `<p>Start with one claim. Walk around it. Cut the clever line if it does not earn the quiet one. Repeat until the piece feels like something you would leave on a kitchen table.</p>`,
    `<p>We published this because it still feels like print—generous margins, no hurry, and a last sentence that does not beg for a click.</p>`,
    `<p>Issue note ${i + 1}: if you save only one thing this week, let it be this.</p>`,
  ];
  return grafs.join("");
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function fetchRetry(url, opts = {}, tries = 4) {
  let last;
  for (let i = 0; i < tries; i++) {
    try {
      const res = await fetch(url, opts);
      if (res.status === 429 || res.status >= 500) {
        await sleep(600 * (i + 1));
        last = new Error(`HTTP ${res.status}`);
        continue;
      }
      return res;
    } catch (err) {
      last = err;
      await sleep(700 * (i + 1));
    }
  }
  throw last;
}

function listFrom(payload) {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.items)) return payload.items;
  return [];
}

function editorialFiles() {
  if (!fs.existsSync(EDITORIAL_DIR)) return [];
  return fs
    .readdirSync(EDITORIAL_DIR)
    .filter((n) => /\.(jpe?g|png|webp)$/i.test(n))
    .map((n) => path.join(EDITORIAL_DIR, n));
}

async function imageBuffer(i) {
  const locals = editorialFiles();
  const picsum = `https://picsum.photos/seed/chronic-mag-${i}/1200/800`;
  try {
    const res = await fetchRetry(picsum, { redirect: "follow" });
    if (res.ok) return Buffer.from(await res.arrayBuffer());
  } catch {
    /* fall through */
  }
  if (locals.length) return fs.readFileSync(locals[i % locals.length]);
  throw new Error("No image source available");
}

function postsPlan(categories) {
  const cats = categories.length ? categories : SEED_CATEGORIES;
  const plan = [];
  let n = 0;
  for (let a = 0; a < AUTHORS.length; a++) {
    for (let p = 0; p < 8; p++) {
      const title = TITLES[n] || `Field notes ${n + 1}`;
      plan.push({
        author: AUTHORS[a],
        title,
        category: cats[(a + p * 3) % cats.length],
        index: n,
      });
      n += 1;
    }
  }
  return plan;
}

async function seedMongo() {
  require("dotenv").config();
  const mongoose = require("mongoose");
  const bcrypt = require("bcrypt");
  const { connectDB } = require("../config/ds");
  const blogcontent = require("../model/blogcontentschema");
  const blogcategory = require("../model/category");
  const User = require("../model/userschema");

  async function ensureCategoriesMongo() {
    const existing = await blogcategory.find();
    const have = new Set(existing.map((c) => String(c.category).toLowerCase()));
    for (const category of SEED_CATEGORIES) {
      if (!have.has(category.toLowerCase())) {
        await blogcategory.create({ category });
      }
    }
    return blogcategory.find();
  }

  async function ensureUsersMongo() {
    const users = [];
    const hashed = await bcrypt.hash(SEED_PASSWORD, 10);
    for (const author of AUTHORS) {
      let user = await User.findOne({
        $or: [{ username: author.username }, { email: author.email }],
      });
      if (!user) {
        user = await User.create({
          username: author.username,
          email: author.email,
          password: hashed,
          role: "user",
        });
        console.log(`Created user ${author.username}`);
      }
      users.push(user);
    }
    return users;
  }

  await connectDB();
  if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });

  const catDocs = await ensureCategoriesMongo();
  const categories = catDocs.map((c) => c.category);
  const users = await ensureUsersMongo();
  const byName = Object.fromEntries(users.map((u) => [u.username, u]));

  if (RESET) {
    const names = AUTHORS.map((a) => a.username);
    const removed = await blogcontent.deleteMany({ username: { $in: names } });
    console.log(`Removed ${removed.deletedCount} previous seed posts.`);
  }

  const existing = await blogcontent.find({
    username: { $in: AUTHORS.map((a) => a.username) },
  });
  const seen = new Set(existing.map((p) => `${p.username}::${p.heading}`));

  const plan = postsPlan(categories);
  let created = 0;
  for (const item of plan) {
    const heading = htmlTitle(item.title);
    const key = `${item.author.username}::${heading}`;
    if (seen.has(key)) continue;
    const user = byName[item.author.username];
    const filename = `seed-${Date.now()}-${item.index}.jpg`;
    const filePath = path.join(UPLOADS_DIR, filename);
    try {
      fs.writeFileSync(filePath, await imageBuffer(item.index));
    } catch (err) {
      console.warn(`Skip ${item.title}: ${err.message}`);
      continue;
    }
    await blogcontent.create({
      image: filename,
      heading,
      content: htmlBody(item.title, item.category, item.author.username, item.index),
      category: item.category,
      username: user.username,
      userid: String(user._id),
      date: String(Date.now() - item.index * 43200000),
      eyecatch: htmlDeck(item.category, item.author.username),
      liked: [],
    });
    created += 1;
    console.log(`+ ${item.author.username} / ${item.category} / ${item.title}`);
  }

  console.log(`Mongo seed done. Inserted ${created} posts.`);
  await mongoose.disconnect();
}

async function apiJson(base, pathname, opts = {}) {
  const res = await fetchRetry(`${base}${pathname}`, opts);
  const text = await res.text();
  let body = {};
  try {
    body = text ? JSON.parse(text) : {};
  } catch {
    body = { raw: text };
  }
  return { res, body };
}

async function ensureAuth(base, author) {
  const signup = await apiJson(base, "/user/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: author.username,
      email: author.email,
      password: SEED_PASSWORD,
    }),
  });
  if (signup.res.ok && signup.body.token) return signup.body.token;

  const login = await apiJson(base, "/user/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: author.username,
      password: SEED_PASSWORD,
    }),
  });
  if (!login.res.ok || !login.body.token) {
    throw new Error(
      `Could not auth ${author.username}: ${login.body.message || login.res.status}`
    );
  }
  return login.body.token;
}

async function seedApi(base) {
  console.log(`Seeding via API ${base}`);

  const catRes = await apiJson(base, "/user/homecategory");
  const existingCats = listFrom(catRes.body).map((c) => c.category).filter(Boolean);
  const have = new Set(existingCats.map((c) => String(c).toLowerCase()));
  for (const category of SEED_CATEGORIES) {
    if (have.has(category.toLowerCase())) continue;
    const added = await apiJson(base, "/user/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ category }),
    });
    if (added.res.ok) {
      existingCats.push(category);
      have.add(category.toLowerCase());
      console.log(`Category added: ${category}`);
    }
    await sleep(200);
  }

  const blogsRes = await apiJson(base, "/user/showblog");
  const blogs = listFrom(blogsRes.body);
  const seen = new Set(blogs.map((p) => `${p.username}::${p.heading}`));

  const tokens = {};
  for (const author of AUTHORS) {
    tokens[author.username] = await ensureAuth(base, author);
    console.log(`Ready author: ${author.username}`);
    await sleep(250);
  }

  const plan = postsPlan(existingCats);
  let created = 0;
  for (const item of plan) {
    const heading = htmlTitle(item.title);
    if (seen.has(`${item.author.username}::${heading}`)) continue;
    let buf;
    try {
      buf = await imageBuffer(item.index);
    } catch (err) {
      console.warn(`Skip image ${item.title}: ${err.message}`);
      continue;
    }
    const fd = new FormData();
    fd.append("heading", heading);
    fd.append("content", htmlBody(item.title, item.category, item.author.username, item.index));
    fd.append("category", item.category);
    fd.append("eyecatch", htmlDeck(item.category, item.author.username));
    fd.append(
      "image",
      new File([buf], `seed-${item.index}.jpg`, { type: "image/jpeg" })
    );

    const up = await fetchRetry(`${base}/user/upload`, {
      method: "POST",
      headers: { Authorization: `Bearer ${tokens[item.author.username]}` },
      body: fd,
    });
    if (!up.ok) {
      const t = await up.text();
      console.warn(`Upload failed (${up.status}) ${item.title}: ${t.slice(0, 180)}`);
      await sleep(400);
      continue;
    }
    created += 1;
    console.log(`+ ${item.author.username} / ${item.category} / ${item.title}`);
    await sleep(350);
  }

  console.log(`API seed done. Inserted ${created} posts.`);
}

async function main() {
  const wantApi = process.argv.includes("--api") || Boolean(API_BASE);
  if (wantApi && API_BASE) {
    await seedApi(API_BASE);
    return;
  }
  if (process.env.MONGO_URI) {
    await seedMongo();
    return;
  }
  throw new Error(
    "Set MONGO_URI for local seed, or run: npm run seed:blogs -- --api https://your-api"
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
