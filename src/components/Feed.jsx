// The home page: alert banner, post box, filters, posts and the side panel.
import { useState } from "react";
import { CATEGORIES } from "../data";
import { getTrending } from "../helpers";
import PostBox from "./PostBox";
import PostCard from "./PostCard";

function Feed(props) {
  const currentUser = props.currentUser;

  const [tab, setTab] = useState("foryou"); // foryou, all or following
  const [category, setCategory] = useState("All");

  // ---------- urgent alerts at the top ----------
  const urgentPosts = props.posts
    .filter(function (p) {
      return p.priority === "urgent";
    })
    .sort(function (a, b) {
      return b.createdAt - a.createdAt;
    })
    .slice(0, 2);

  // ---------- which posts to show ----------
  // "For you" = my interests + urgent posts + people I follow + my own posts
  function isForMe(post) {
    if (currentUser.interests.includes(post.category)) return true;
    if (post.priority === "urgent") return true;
    if (currentUser.following.includes(post.username)) return true;
    if (post.username === currentUser.name) return true;
    return false;
  }

  let shownPosts = props.posts;

  if (tab === "foryou") {
    shownPosts = shownPosts.filter(isForMe);
  }
  if (tab === "following") {
    shownPosts = shownPosts.filter(function (p) {
      return currentUser.following.includes(p.username) || p.username === currentUser.name;
    });
  }
  if (category !== "All") {
    shownPosts = shownPosts.filter(function (p) {
      return p.category === category;
    });
  }
  if (props.searchText.trim() !== "") {
    const search = props.searchText.trim().toLowerCase();
    shownPosts = shownPosts.filter(function (p) {
      return p.text.toLowerCase().includes(search) || p.username.toLowerCase().includes(search.replace("@", ""));
    });
  }

  // newest first
  shownPosts = [...shownPosts].sort(function (a, b) {
    return b.createdAt - a.createdAt;
  });

  const trending = getTrending(props.posts);

  // how many posts in each category (for the side panel)
  function countInCategory(name) {
    return props.posts.filter(function (p) {
      return p.category === name;
    }).length;
  }

  return (
    <div className="two-columns">
      {/* ---------- left: main feed ---------- */}
      <div className="main-column">
        {urgentPosts.map(function (post) {
          return (
            <div key={post.id} className="alert-banner">
              🚨 <b>IMPORTANT ALERT:</b> {post.text}
            </div>
          );
        })}

        <PostBox currentUser={currentUser} onPost={props.onNewPost} />

        <input
          className="search-box"
          type="text"
          placeholder="🔍 Search posts, #hashtags or @users"
          value={props.searchText}
          onChange={function (e) {
            props.onSearchChange(e.target.value);
          }}
        />

        <div className="tabs">
          <button className={tab === "foryou" ? "tab active" : "tab"} onClick={function () { setTab("foryou"); }}>
            For You
          </button>
          <button className={tab === "all" ? "tab active" : "tab"} onClick={function () { setTab("all"); }}>
            All
          </button>
          <button className={tab === "following" ? "tab active" : "tab"} onClick={function () { setTab("following"); }}>
            Following
          </button>
        </div>

        <div className="chip-row">
          <span
            className={category === "All" ? "chip chip-selected" : "chip"}
            onClick={function () { setCategory("All"); }}
          >
            All
          </span>
          {CATEGORIES.map(function (c) {
            return (
              <span
                key={c}
                className={category === c ? "chip chip-selected" : "chip"}
                onClick={function () { setCategory(c); }}
              >
                {c}
              </span>
            );
          })}
        </div>

        {shownPosts.length === 0 && (
          <div className="card center small-text">
            No posts here. Try the "All" tab, or change your interests on your profile.
          </div>
        )}

        {shownPosts.map(function (post) {
          return <PostCard key={post.id} post={post} {...props.postProps} />;
        })}
      </div>

      {/* ---------- right: side panel ---------- */}
      <div className="side-column">
        <div className="card">
          <h3>🔥 Trending</h3>
          {trending.length === 0 && <p className="small-text">No hashtags yet.</p>}
          {trending.map(function (item) {
            return (
              <div
                key={item.tag}
                className="side-row clickable"
                onClick={function () {
                  props.onSearchChange(item.tag);
                }}
              >
                <span className="hashtag">{item.tag}</span>
                <span className="small-text">{item.count} posts</span>
              </div>
            );
          })}
        </div>

        <div className="card">
          <h3>📚 Categories</h3>
          {CATEGORIES.map(function (c) {
            return (
              <div
                key={c}
                className="side-row clickable"
                onClick={function () {
                  setCategory(c);
                  setTab("all");
                }}
              >
                <span>{c}</span>
                <span className="small-text">{countInCategory(c)}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Feed;
