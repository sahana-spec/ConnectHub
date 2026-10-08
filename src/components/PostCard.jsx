// Shows ONE post with all its buttons:
// like, comment, share, translate, listen, TL;DR, follow, delete.
import { useState } from "react";
import { ROLES } from "../data";
import { timeAgo, languageName, translateText, speakText, stopSpeaking, summarizeText } from "../helpers";

function PostCard(props) {
  const post = props.post;
  const currentUser = props.currentUser;

  // who wrote this post
  const author = props.users.find(function (u) {
    return u.name === post.username;
  });
  const roleInfo = ROLES.find(function (r) {
    return r.name === (author ? author.role : "Member");
  });

  const liked = post.likes.includes(currentUser.name);
  const isMine = post.username === currentUser.name;
  const isFollowing = currentUser.following.includes(post.username);
  const canDelete = isMine || currentUser.role === "Admin";

  // small things this card remembers
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [translated, setTranslated] = useState(null);
  const [translating, setTranslating] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState("");

  // ---------- show text with clickable #hashtags ----------
  function renderText(text) {
    const pieces = text.split(/(#[\p{L}\p{N}_]+)/u);
    return pieces.map(function (piece, index) {
      if (piece.startsWith("#") && piece.length > 1) {
        return (
          <span
            key={index}
            className="hashtag"
            onClick={function () {
              props.onTagClick(piece);
            }}
          >
            {piece}
          </span>
        );
      }
      return <span key={index}>{piece}</span>;
    });
  }

  // ---------- translate ----------
  async function handleTranslate() {
    // second click = go back to original
    if (translated) {
      setTranslated(null);
      return;
    }
    setTranslating(true);
    setError("");
    try {
      const result = await translateText(post.text, post.language, currentUser.language);
      setTranslated(result);
    } catch (e) {
      setError("Translation failed. Check your internet.");
    }
    setTranslating(false);
  }

  // ---------- listen ----------
  function handleListen() {
    if (speaking) {
      stopSpeaking();
      setSpeaking(false);
      return;
    }
    // read the translated text if it is showing, otherwise the original
    const textToRead = translated ? translated : post.text;
    const languageToUse = translated ? currentUser.language : post.language;
    const worked = speakText(textToRead, languageToUse, function () {
      setSpeaking(false);
    });
    if (worked) {
      setSpeaking(true);
    } else {
      setError("Your browser cannot read text aloud.");
    }
  }

  // ---------- TL;DR ----------
  function handleSummary() {
    if (summary) {
      setSummary(null);
    } else {
      setSummary(summarizeText(post.text));
    }
  }

  // ---------- comment ----------
  function handleSendComment() {
    const clean = commentText.trim();
    if (clean === "") return;
    props.onComment(post.id, clean);
    setCommentText("");
  }

  // css class: urgent and important posts look different
  let cardClass = "card post";
  if (post.priority === "urgent") cardClass = "card post post-urgent";
  if (post.priority === "important") cardClass = "card post post-important";

  return (
    <div className={cardClass}>
      {/* shared post label */}
      {post.sharedFrom && <p className="small-text">🔄 Shared from @{post.sharedFrom}</p>}

      {/* top: avatar, name, badge, time */}
      <div className="post-top">
        <div
          className="avatar clickable"
          onClick={function () {
            props.onOpenProfile(post.username);
          }}
        >
          {post.username.charAt(0).toUpperCase()}
        </div>

        <div className="post-top-text">
          <b
            className="clickable"
            onClick={function () {
              props.onOpenProfile(post.username);
            }}
          >
            @{post.username}
          </b>
          <span className="role-badge">{roleInfo.badge}</span>
          <div className="small-text">
            {timeAgo(post.createdAt)} · {languageName(post.language)}
          </div>
        </div>

        {!isMine && !isFollowing && (
          <button
            className="small-button"
            onClick={function () {
              props.onFollow(post.username);
            }}
          >
            + Follow
          </button>
        )}

        {canDelete && (
          <button
            className="small-button"
            onClick={function () {
              props.onDelete(post.id);
            }}
          >
            🗑
          </button>
        )}
      </div>

      {/* tags: priority and category */}
      <div className="tag-row">
        {post.priority === "urgent" && <span className="tag tag-urgent">🔴 URGENT</span>}
        {post.priority === "important" && <span className="tag tag-important">🔵 Important</span>}
        <span className="tag">{post.category}</span>
      </div>

      {/* the message */}
      <p className="post-text">{renderText(post.text)}</p>

      {summary && (
        <div className="info-box">
          <b>🤖 TL;DR:</b> {summary}
        </div>
      )}

      {translated && (
        <div className="info-box">
          <b>🌐 Translated:</b> {translated}
        </div>
      )}

      {error !== "" && <p className="error">{error}</p>}

      {/* buttons */}
      <div className="post-buttons">
        <button
          className={liked ? "action liked" : "action"}
          onClick={function () {
            props.onLike(post.id);
          }}
        >
          {liked ? "❤️" : "🤍"} {post.likes.length}
        </button>

        <button
          className="action"
          onClick={function () {
            setShowComments(!showComments);
          }}
        >
          💬 {post.comments.length}
        </button>

        {!isMine && (
          <button
            className="action"
            onClick={function () {
              props.onShare(post.id);
            }}
          >
            🔄 {post.shares}
          </button>
        )}

        <span className="spacer"></span>

        {post.text.length > 100 && (
          <button className="action" onClick={handleSummary}>
            🤖 TL;DR
          </button>
        )}

        <button className="action" onClick={handleTranslate} disabled={translating}>
          {translating ? "..." : translated ? "↩ Original" : "🌐 Translate"}
        </button>

        <button className={speaking ? "action liked" : "action"} onClick={handleListen}>
          {speaking ? "⏹ Stop" : "🔊 Listen"}
        </button>
      </div>

      {/* comments */}
      {showComments && (
        <div className="comments">
          {post.comments.length === 0 && <p className="small-text">No comments yet.</p>}

          {post.comments.map(function (comment) {
            return (
              <div key={comment.id} className="comment">
                <b>@{comment.username}</b> {comment.text}
                <span className="small-text"> · {timeAgo(comment.createdAt)}</span>
              </div>
            );
          })}

          <div className="comment-form">
            <input
              type="text"
              placeholder="Write a comment..."
              value={commentText}
              onChange={function (e) {
                setCommentText(e.target.value);
              }}
              onKeyDown={function (e) {
                if (e.key === "Enter") handleSendComment();
              }}
            />
            <button className="main-button" onClick={handleSendComment}>
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default PostCard;
