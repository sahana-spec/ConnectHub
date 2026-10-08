# ConnectHub

A trusted, organized and personalized information platform for ANY community: neighbourhoods, workplaces, colleges, clubs, cities.
Built with React + plain CSS. No backend needed to run the demo.

## Run it
```
npm install
npm run dev
```
Open the link it prints (usually http://localhost:5173). Use Chrome or Edge for voice typing.

## Demo login
- Quick demo buttons on the login page: ravi, priya (members), greenfuture (organization), dr_rao (expert), admin.
- Or type ANY new name and create an account.
- Organization / Expert / Admin accounts need the verification code: VERIFY2026 (change it in src/data.js).

## Features
| Feature | Where it is |
|---|---|
| Post (280 chars), categories, priority levels | PostBox.jsx |
| Interest-based "For You" feed, All, Following | Feed.jsx |
| Urgent alert banner | Feed.jsx |
| Like, comment, share, follow, delete | PostCard.jsx + App.jsx |
| Verified badges (Member, Organization, Expert, Admin) | data.js (ROLES) |
| Notifications | Notifications.jsx |
| Trending hashtags, categories, search | Feed.jsx |
| Profile + change interests | Profile.jsx |
| Voice typing, translate, listen, TL;DR | PostBox.jsx, PostCard.jsx, helpers.js |

## Two-tab live demo
Open the app in 2 browser tabs and log in as different users. Post, like or comment in one tab
and the other tab updates by itself. Notifications appear too.

## Files
```
src/
  data.js          settings: app name, categories, roles, sample data
  helpers.js       time, trending, translate, speech, TL;DR
  App.jsx          all data + all actions (like, comment, follow ...)
  index.css        all styling
  components/
    Login.jsx  Navbar.jsx  Feed.jsx  PostBox.jsx
    PostCard.jsx  Notifications.jsx  Profile.jsx
```

## Easy changes
| Change | Where |
|---|---|
| App name / tagline | APP_NAME, TAGLINE in data.js |
| Categories | CATEGORIES in data.js |
| Post length limit | MAX_CHARS in data.js |
| Verification code | VERIFY_CODE in data.js |
| Main color | #6c4cf1 in index.css |
| Sample posts | starterPosts in data.js |
| Who can post urgent | allowedPriorities in PostBox.jsx |

To reset all data: press F12 > Application > Local Storage > clear, then refresh.

## What is real and what is demo
- Real: voice typing, listen (browser), translate (free MyMemory API, needs internet).
- Demo: data is saved in the browser (localStorage), not a server. The TL;DR is a simple
  rule-based summary. Verification uses a demo code.
- Next step for production: Node + MongoDB backend, real login, an AI API for summaries.
