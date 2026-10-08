// A user's profile page: info, follow button, interests and their posts.
import { CATEGORIES, ROLES } from "../data";
import PostCard from "./PostCard";

function Profile(props) {
  const user = props.users.find(function (u) {
    return u.name === props.profileName;
  });

  if (!user) {
    return <div className="card center">User not found.</div>;
  }

  const isMe = user.name === props.currentUser.name;
  const isFollowing = props.currentUser.following.includes(user.name);
  const roleInfo = ROLES.find(function (r) {
    return r.name === user.role;
  });

  // how many people follow this user
  const followers = props.users.filter(function (u) {
    return u.following.includes(user.name);
  }).length;

  // posts written (or shared) by this user, newest first
  const userPosts = props.posts
    .filter(function (p) {
      return p.username === user.name;
    })
    .sort(function (a, b) {
      return b.createdAt - a.createdAt;
    });

  return (
    <div className="narrow-page">
      <div className="card">
        <div className="post-top">
          <div className="avatar big-avatar">{user.name.charAt(0).toUpperCase()}</div>
          <div className="post-top-text">
            <h2 className="no-margin">@{user.name}</h2>
            <span className="role-badge">{roleInfo.badge}</span>
            <div className="small-text">
              {userPosts.length} posts · {followers} followers · {user.following.length} following
            </div>
          </div>

          {!isMe && (
            <button
              className={isFollowing ? "small-button" : "main-button"}
              onClick={function () {
                props.onFollow(user.name);
              }}
            >
              {isFollowing ? "Following ✓" : "Follow"}
            </button>
          )}
        </div>

        {/* interests: only I can change mine */}
        <h4>Interests {isMe && <span className="small-text">(click to change, your feed updates instantly)</span>}</h4>
        <div className="chip-row">
          {CATEGORIES.map(function (c) {
            const selected = user.interests.includes(c);
            if (!isMe && !selected) return null;
            return (
              <span
                key={c}
                className={selected ? "chip chip-selected" : "chip"}
                onClick={function () {
                  if (isMe) props.onToggleInterest(c);
                }}
              >
                {c}
              </span>
            );
          })}
        </div>
      </div>

      {userPosts.length === 0 && <div className="card center small-text">No posts yet.</div>}

      {userPosts.map(function (post) {
        return <PostCard key={post.id} post={post} {...props.postProps} />;
      })}
    </div>
  );
}

export default Profile;
