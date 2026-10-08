// =====================================================
//  App.jsx  -  the main file
//  It stores ALL the data (users, posts, notifications)
//  and has one function for every action (like, comment, follow ...).
// =====================================================
import { useState, useEffect } from "react";
import { starterUsers, starterPosts, starterNotifications } from "./data";
import Login from "./components/Login";
import Navbar from "./components/Navbar";
import Feed from "./components/Feed";
import Notifications from "./components/Notifications";
import Profile from "./components/Profile";

// read saved data from the browser (or use the starting data)
function loadData(key, startingValue) {
  const saved = localStorage.getItem(key);
  if (saved) return JSON.parse(saved);
  return startingValue;
}

function App() {
  // ---------- data ----------
  const [users, setUsers] = useState(loadData("hub_users", starterUsers));
  const [posts, setPosts] = useState(loadData("hub_posts", starterPosts));
  const [notifications, setNotifications] = useState(loadData("hub_notes", starterNotifications));

  // name of the logged-in person. sessionStorage = each browser tab has its own login,
  // so you can open 2 tabs and log in as 2 different users.
  // (change sessionStorage to localStorage if you want the login to stay after closing the tab)
  const [currentName, setCurrentName] = useState(sessionStorage.getItem("hub_current") || "");

  // ---------- screen ----------
  const [page, setPage] = useState("home"); // home, notifications or profile
  const [profileName, setProfileName] = useState("");
  const [searchText, setSearchText] = useState("");

  // the full user object of the logged-in person
  const currentUser = users.find(function (u) {
    return u.name === currentName;
  });

  // ---------- save data whenever it changes ----------
  useEffect(
    function () {
      localStorage.setItem("hub_users", JSON.stringify(users));
    },
    [users]
  );
  useEffect(
    function () {
      localStorage.setItem("hub_posts", JSON.stringify(posts));
    },
    [posts]
  );
  useEffect(
    function () {
      localStorage.setItem("hub_notes", JSON.stringify(notifications));
    },
    [notifications]
  );

  // ---------- live updates between two browser tabs ----------
  useEffect(function () {
    function handleStorageChange(event) {
      if (!event.newValue) return;
      if (event.key === "hub_users") setUsers(JSON.parse(event.newValue));
      if (event.key === "hub_posts") setPosts(JSON.parse(event.newValue));
      if (event.key === "hub_notes") setNotifications(JSON.parse(event.newValue));
    }
    window.addEventListener("storage", handleStorageChange);
    return function () {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  // ---------- login / logout ----------
  function handleLogin(name) {
    sessionStorage.setItem("hub_current", name);
    setCurrentName(name);
    setPage("home");
  }

  function handleSignup(newUser) {
    setUsers([...users, newUser]);
    handleLogin(newUser.name);
  }

  function handleLogout() {
    sessionStorage.removeItem("hub_current");
    setCurrentName("");
  }

  // ---------- notifications ----------
  // adds a notification for another user (not for yourself)
  function addNotification(toUser, text) {
    if (toUser === currentUser.name) return;
    const note = {
      id: Date.now() + Math.random(),
      toUser: toUser,
      text: text,
      createdAt: Date.now(),
      read: false,
    };
    setNotifications(function (old) {
      return [note, ...old];
    });
  }

  function markAllRead() {
    const updated = notifications.map(function (note) {
      if (note.toUser === currentUser.name) return { ...note, read: true };
      return note;
    });
    setNotifications(updated);
  }

  // ---------- post actions ----------
  function handleNewPost(data) {
    const newPost = {
      id: Date.now(),
      username: currentUser.name,
      text: data.text,
      category: data.category,
      priority: data.priority,
      language: data.language,
      createdAt: Date.now(),
      likes: [],
      comments: [],
      shares: 0,
      sharedFrom: null,
    };
    setPosts([newPost, ...posts]);
  }

  function handleLike(postId) {
    const post = posts.find(function (p) {
      return p.id === postId;
    });
    const alreadyLiked = post.likes.includes(currentUser.name);

    const updated = posts.map(function (p) {
      if (p.id !== postId) return p;
      if (alreadyLiked) {
        // unlike: remove my name
        return {
          ...p,
          likes: p.likes.filter(function (n) {
            return n !== currentUser.name;
          }),
        };
      }
      // like: add my name
      return { ...p, likes: [...p.likes, currentUser.name] };
    });
    setPosts(updated);

    if (!alreadyLiked) {
      addNotification(post.username, currentUser.name + " liked your post");
    }
  }

  function handleComment(postId, text) {
    const post = posts.find(function (p) {
      return p.id === postId;
    });
    const newComment = {
      id: Date.now(),
      username: currentUser.name,
      text: text,
      createdAt: Date.now(),
    };
    const updated = posts.map(function (p) {
      if (p.id !== postId) return p;
      return { ...p, comments: [...p.comments, newComment] };
    });
    setPosts(updated);
    addNotification(post.username, currentUser.name + " commented on your post");
  }

  // share = copy the post to my own feed
  function handleShare(postId) {
    const original = posts.find(function (p) {
      return p.id === postId;
    });
    const sharedPost = {
      ...original,
      id: Date.now(),
      username: currentUser.name,
      priority: "normal",
      createdAt: Date.now(),
      likes: [],
      comments: [],
      shares: 0,
      sharedFrom: original.sharedFrom || original.username,
    };
    // add 1 to the share count of the original post
    const updated = posts.map(function (p) {
      if (p.id !== postId) return p;
      return { ...p, shares: p.shares + 1 };
    });
    setPosts([sharedPost, ...updated]);
    addNotification(original.username, currentUser.name + " shared your post");
  }

  function handleDelete(postId) {
    const updated = posts.filter(function (p) {
      return p.id !== postId;
    });
    setPosts(updated);
  }

  // ---------- user actions ----------
  function handleFollow(username) {
    const alreadyFollowing = currentUser.following.includes(username);
    const updated = users.map(function (u) {
      if (u.name !== currentUser.name) return u;
      if (alreadyFollowing) {
        return {
          ...u,
          following: u.following.filter(function (n) {
            return n !== username;
          }),
        };
      }
      return { ...u, following: [...u.following, username] };
    });
    setUsers(updated);
    if (!alreadyFollowing) {
      addNotification(username, currentUser.name + " started following you");
    }
  }

  function handleToggleInterest(category) {
    const updated = users.map(function (u) {
      if (u.name !== currentUser.name) return u;
      if (u.interests.includes(category)) {
        return {
          ...u,
          interests: u.interests.filter(function (i) {
            return i !== category;
          }),
        };
      }
      return { ...u, interests: [...u.interests, category] };
    });
    setUsers(updated);
  }

  function handleLanguageChange(code) {
    const updated = users.map(function (u) {
      if (u.name !== currentUser.name) return u;
      return { ...u, language: code };
    });
    setUsers(updated);
  }

  // ---------- navigation ----------
  function openProfile(username) {
    setProfileName(username);
    setPage("profile");
    window.scrollTo(0, 0);
  }

  // clicking a #hashtag searches for it on the home page
  function handleTagClick(tag) {
    setSearchText(tag);
    setPage("home");
    window.scrollTo(0, 0);
  }

  // ---------- show login page if nobody is logged in ----------
  if (!currentUser) {
    return <Login users={users} onLogin={handleLogin} onSignup={handleSignup} />;
  }

  // these are given to every PostCard (so we write them only once)
  const postProps = {
    users: users,
    currentUser: currentUser,
    onLike: handleLike,
    onComment: handleComment,
    onShare: handleShare,
    onDelete: handleDelete,
    onFollow: handleFollow,
    onOpenProfile: openProfile,
    onTagClick: handleTagClick,
  };

  const unreadCount = notifications.filter(function (n) {
    return n.toUser === currentUser.name && !n.read;
  }).length;

  return (
    <div>
      <Navbar
        currentUser={currentUser}
        page={page}
        unreadCount={unreadCount}
        onChangePage={setPage}
        onOpenProfile={openProfile}
        onLanguageChange={handleLanguageChange}
        onLogout={handleLogout}
      />

      <div className="page">
        {page === "home" && (
          <Feed
            posts={posts}
            currentUser={currentUser}
            searchText={searchText}
            onSearchChange={setSearchText}
            onNewPost={handleNewPost}
            postProps={postProps}
          />
        )}

        {page === "notifications" && (
          <Notifications
            notifications={notifications}
            currentUser={currentUser}
            onMarkAllRead={markAllRead}
          />
        )}

        {page === "profile" && (
          <Profile
            profileName={profileName}
            users={users}
            posts={posts}
            currentUser={currentUser}
            onFollow={handleFollow}
            onToggleInterest={handleToggleInterest}
            postProps={postProps}
          />
        )}
      </div>
    </div>
  );
}

export default App;
