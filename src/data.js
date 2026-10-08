// =====================================================
//  data.js  -  all the settings and starting data
//  Change names, categories, roles and sample posts here.
// =====================================================

export const APP_NAME = "ConnectHub";
export const TAGLINE = "Trusted updates for every community, in your language";

// People who want to be an Organization / Expert / Admin must type this code.
// (In a real app, an admin would approve them instead.)


// Maximum characters in one post
export const MAX_CHARS = 280;

// Post categories (also used as user interests)
export const CATEGORIES = [
  "Announcements",
  "Events",
  "Jobs & Careers",
  "Learning",
  "Health & Safety",
  "Local & Community",
  "Lost & Found",
  "Discussions",
  "Business & Services",
  "Education & Training",
  "environment& sustainability",
  "other",
];
export const ROLES = [
  { name: "Member" },
  { name: "Organization" },
  { name: "Expert" },
  { name: "Admin" },
  { name: "Official" },
  { name: "Business" },
  {name:"Volunteer"},
  {name:"student"},
];
// User roles and the badge shown next to the name
export const URGENT_ROLES = [
  { name: "Organization", badge: "🔵 Verified Organization" },
  { name: "Expert", badge: "🟢 Verified Expert" },
  { name: "Admin", badge: "🟣 Official Admin" },
  { name: "Official", badge: "🏛️ Government Official" },
  { name: "Business", badge: "🟠 Verified Business" },
];

// Post priorities. Members cannot post "urgent".
export const PRIORITIES = [
  { value: "normal", label: "🟢 Normal" },
  { value: "important", label: "🔵 Important" },
  { value: "urgent", label: "🔴 Urgent" },
];

// Languages (code is used for translation, voice is used for speech)
export const LANGUAGES = [
  { code: "en", name: "English", voice: "en-IN" },
  { code: "hi", name: "हिन्दी", voice: "hi-IN" },
  { code: "kn", name: "ಕನ್ನಡ", voice: "kn-IN" },
  { code: "ta", name: "தமிழ்", voice: "ta-IN" },
  { code: "te", name: "తెలుగు", voice: "te-IN" },
];

// helper used only for the sample data below
function minutesAgo(m) {
  return Date.now() - m * 60 * 1000;
}

// ---------- sample users ----------
export const starterUsers = [
  { name: "ravi", role: "Member", interests: ["Jobs & Careers", "Events", "Learning"], following: ["greenfuture"], language: "kn" },
  { name: "priya", role: "Member", interests: ["Jobs & Careers", "Local & Community"], following: ["ravi"], language: "hi" },
  { name: "meena", role: "Member", interests: ["Discussions", "Learning"], following: [], language: "en" },
  { name: "greenfuture", role: "Organization", interests: ["Events", "Local & Community"], following: [], language: "en" },
  { name: "dr_rao", role: "Expert", interests: ["Health & Safety"], following: [], language: "en" },
  { name: "admin", role: "Admin", interests: ["Announcements"], following: [], language: "en" },
];

// ---------- sample posts ----------
export const starterPosts = [
  {
    id: 1,
    username: "admin",
    text: "Heavy rain alert: schools and offices in the city will remain closed tomorrow. Please stay indoors and avoid low-lying areas. #rainalert",
    category: "Announcements",
    priority: "urgent",
    language: "en",
    createdAt: minutesAgo(5),
    likes: ["ravi", "meena"],
    comments: [{ id: 101, username: "meena", text: "Thank you for the update!", createdAt: minutesAgo(3) }],
    shares: 0,
    sharedFrom: null,
  },
  {
    id: 2,
    username: "greenfuture",
    text: "Join our tree plantation drive this Sunday at 8 AM at City Park, Gate 2. Bring water and a cap. Register before Friday 6 PM. #plantation #volunteer",
    category: "Events",
    priority: "important",
    language: "en",
    createdAt: minutesAgo(30),
    likes: ["ravi", "priya"],
    comments: [
      { id: 102, username: "ravi", text: "Can kids join too?", createdAt: minutesAgo(25) },
      { id: 103, username: "greenfuture", text: "Yes, all ages are welcome.", createdAt: minutesAgo(20) },
    ],
    shares: 1,
    sharedFrom: null,
  },
  {
    id: 3,
    username: "dr_rao",
    text: "Due to the rise in seasonal fever cases, residents are advised to drink boiled water, avoid street food and visit the nearest clinic if fever lasts more than two days. Free health checkup camps will be held at the community hall on Saturday from 9 AM to 1 PM. Please carry your ID card. #health",
    category: "Health & Safety",
    priority: "important",
    language: "en",
    createdAt: minutesAgo(60),
    likes: ["meena"],
    comments: [],
    shares: 0,
    sharedFrom: null,
  },
  {
    id: 4,
    username: "priya",
    text: "मेरी पहली नौकरी आज शुरू हुई! बहुत उत्साहित हूँ। #newjob",
    category: "Jobs & Careers",
    priority: "normal",
    language: "hi",
    createdAt: minutesAgo(120),
    likes: ["ravi"],
    comments: [],
    shares: 0,
    sharedFrom: null,
  },
  {
    id: 5,
    username: "ravi",
    text: "Lost a blue water bottle near the bus stop. Please contact me if found. #lostandfound",
    category: "Lost & Found",
    priority: "normal",
    language: "en",
    createdAt: minutesAgo(180),
    likes: [],
    comments: [],
    shares: 0,
    sharedFrom: null,
  },
  {
    id: 6,
    username: "meena",
    text: "Anyone up for a weekend study group on Python basics? Beginners are welcome. #python #learning",
    category: "Learning",
    priority: "normal",
    language: "en",
    createdAt: minutesAgo(240),
    likes: [],
    comments: [{ id: 104, username: "ravi", text: "I am in! Which day?", createdAt: minutesAgo(200) }],
    shares: 0,
    sharedFrom: null,
  },
  {
    id: 7,
    username: "ravi",
    text: "ಇವತ್ತು ಬೆಂಗಳೂರಿನಲ್ಲಿ ಮಳೆ ಜೋರಾಗಿದೆ! ಸುರಕ್ಷಿತವಾಗಿರಿ. #rain",
    category: "Local & Community",
    priority: "normal",
    language: "kn",
    createdAt: minutesAgo(300),
    likes: ["priya"],
    comments: [],
    shares: 0,
    sharedFrom: null,
  },
];

// ---------- sample notifications ----------
export const starterNotifications = [
  { id: 1, toUser: "ravi", text: "priya liked your post", createdAt: minutesAgo(100), read: false },
  { id: 2, toUser: "ravi", text: "greenfuture replied to your comment", createdAt: minutesAgo(20), read: false },
];
