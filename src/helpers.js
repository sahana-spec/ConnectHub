// =====================================================
//  helpers.js  -  small useful functions
// =====================================================
import { LANGUAGES } from "./data";

// "5 min ago", "2 hours ago" ...
export function timeAgo(time) {
  const seconds = Math.floor((Date.now() - time) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return minutes + " min ago";
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return hours + " hr ago";
  const days = Math.floor(hours / 24);
  return days + " day ago";
}

// find the language name from its code (hi -> हिन्दी)
export function languageName(code) {
  const found = LANGUAGES.find(function (l) {
    return l.code === code;
  });
  return found ? found.name : code;
}

// count hashtags in all posts and return the top ones
export function getTrending(posts) {
  const counts = {};
  posts.forEach(function (post) {
    const tags = post.text.match(/#[\p{L}\p{N}_]+/gu) || [];
    tags.forEach(function (tag) {
      const lower = tag.toLowerCase();
      counts[lower] = (counts[lower] || 0) + 1;
    });
  });
  // turn {"#rain": 2, ...} into a sorted list
  return Object.keys(counts)
    .map(function (tag) {
      return { tag: tag, count: counts[tag] };
    })
    .sort(function (a, b) {
      return b.count - a.count;
    })
    .slice(0, 6);
}

// ---------- TRANSLATE (free MyMemory API, needs internet) ----------
export async function translateText(text, fromCode, toCode) {
  if (fromCode === toCode) return text;
  const url =
    "https://api.mymemory.translated.net/get?q=" +
    encodeURIComponent(text) +
    "&langpair=" +
    fromCode +
    "|" +
    toCode;
  const response = await fetch(url);
  const data = await response.json();
  return data.responseData.translatedText;
}

// ---------- LISTEN (browser text-to-speech) ----------
export function speakText(text, languageCode, whenFinished) {
  if (!("speechSynthesis" in window)) return false;
  window.speechSynthesis.cancel();
  const speech = new SpeechSynthesisUtterance(text);
  const lang = LANGUAGES.find(function (l) {
    return l.code === languageCode;
  });
  speech.lang = lang ? lang.voice : "en-IN";
  speech.onend = whenFinished;
  speech.onerror = whenFinished;
  window.speechSynthesis.speak(speech);
  return true;
}

export function stopSpeaking() {
  if ("speechSynthesis" in window) window.speechSynthesis.cancel();
}

// ---------- TL;DR SUMMARY ----------
// A simple rule-based summary so the demo works without internet.
// It picks the sentence with the most "important" words.
// To use real AI later: send the text to an AI API from your backend.
const importantWords = [
  "postponed", "cancelled", "extended", "deadline", "register", "submit",
  "before", "tomorrow", "today", "monday", "tuesday", "wednesday", "thursday",
  "friday", "saturday", "sunday", "exam", "last date", "must", "starts", "free", "advised",
];

export function summarizeText(text) {
  // split into sentences
  const sentences = text.split(/(?<=[.!?])\s+/);
  let bestSentence = sentences[0];
  let bestScore = -1;

  sentences.forEach(function (sentence) {
    const lower = sentence.toLowerCase();
    let score = 0;
    importantWords.forEach(function (word) {
      if (lower.includes(word)) score = score + 1;
    });
    // numbers (dates, times) also count
    if (/\d/.test(sentence)) score = score + 1;
    if (score > bestScore) {
      bestScore = score;
      bestSentence = sentence;
    }
  });

  // keep it short (max 18 words)
  const words = bestSentence.replace(/#\S+/g, "").trim().split(/\s+/);
  if (words.length > 18) return words.slice(0, 18).join(" ") + "...";
  return words.join(" ");
}
