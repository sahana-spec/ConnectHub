// The box where the user writes a new post.
// Has: text, category, priority, language, voice (mic) button.
import { useState, useRef } from "react";
import { CATEGORIES, PRIORITIES, LANGUAGES, MAX_CHARS,URGENT_ROLES} from "../data";

function PostBox(props) {
  const currentUser = props.currentUser;

  const [text, setText] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [priority, setPriority] = useState("normal");
  const [language, setLanguage] = useState(currentUser.language);
  const [listening, setListening] = useState(false);
  const [message, setMessage] = useState("");
  const recognitionRef = useRef(null);

  // members cannot post "urgent"
  const allowedPriorities = PRIORITIES.filter(function (p) {
  if (p.value === "urgent") {
    const canPostUrgent = URGENT_ROLES.some(function (r) {
      return r.name === currentUser.role;
    });

    if (!canPostUrgent) {
      return false;
    }
  }

  return true;
});

  // ---------- voice typing ----------
  function handleMic() {
    setMessage("");
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setMessage("Voice typing works only in Chrome or Edge");
      return;
    }

    // if already listening, stop
    if (listening) {
      recognitionRef.current.stop();
      return;
    }

    const recognition = new SpeechRecognition();
    const selectedLanguage = LANGUAGES.find(function (l) {
      return l.code === language;
    });
    recognition.lang = selectedLanguage.voice;
    recognition.interimResults = true;
    recognition.continuous = true;

    const textBeforeSpeaking = text;

    recognition.onresult = function (event) {
      let spoken = "";
      for (let i = 0; i < event.results.length; i++) {
        spoken = spoken + event.results[i][0].transcript;
      }
      const fullText = textBeforeSpeaking ? textBeforeSpeaking + " " + spoken : spoken;
      setText(fullText.slice(0, MAX_CHARS));
    };
    recognition.onend = function () {
      setListening(false);
    };
    recognition.onerror = function (event) {
      setMessage("Mic problem: " + event.error);
      setListening(false);
    };

    recognition.start();
    recognitionRef.current = recognition;
    setListening(true);
  }

  // ---------- post button ----------
  function handlePost() {
    const cleanText = text.trim();
    if (cleanText === "") return;

    if (recognitionRef.current && listening) recognitionRef.current.stop();

    props.onPost({
      text: cleanText,
      category: category,
      priority: priority,
      language: language,
    });

    setText("");
    setPriority("normal");
    setMessage("");
  }

  return (
    <div className="card">
      <textarea
        placeholder={listening ? "🎙️ Listening... speak now" : "Share a short update..."}
        maxLength={MAX_CHARS}
        value={text}
        onChange={function (e) {
          setText(e.target.value);
        }}
      />

      {message !== "" && <p className="error">{message}</p>}

      <div className="postbox-bottom">
        <button className={listening ? "small-button mic-on" : "small-button"} onClick={handleMic}>
          {listening ? "⏹ Stop" : "🎤 Speak"}
        </button>

        <select
          value={category}
          onChange={function (e) {
            setCategory(e.target.value);
          }}
        >
          {CATEGORIES.map(function (c) {
            return (
              <option key={c} value={c}>
                {c}
              </option>
            );
          })}
        </select>

        <select
          value={priority}
          onChange={function (e) {
            setPriority(e.target.value);
          }}
        >
          {allowedPriorities.map(function (p) {
            return (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            );
          })}
        </select>

        <select
          value={language}
          onChange={function (e) {
            setLanguage(e.target.value);
          }}
        >
          {LANGUAGES.map(function (l) {
            return (
              <option key={l.code} value={l.code}>
                {l.name}
              </option>
            );
          })}
        </select>

        <span className="small-text spacer">{MAX_CHARS - text.length} left</span>

        <button className="main-button" onClick={handlePost}>
          Post
        </button>
      </div>
    </div>
  );
}

export default PostBox;
