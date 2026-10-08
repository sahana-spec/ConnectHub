// The notifications page (likes, comments, follows, shares).
import { timeAgo } from "../helpers";

function Notifications(props) {
  // only my notifications, newest first
  const myNotes = props.notifications
    .filter(function (n) {
      return n.toUser === props.currentUser.name;
    })
    .sort(function (a, b) {
      return b.createdAt - a.createdAt;
    });

  return (
    <div className="narrow-page">
      <div className="row-between">
        <h2>🔔 Notifications</h2>
        <button className="small-button" onClick={props.onMarkAllRead}>
          Mark all as read
        </button>
      </div>

      {myNotes.length === 0 && <div className="card center small-text">Nothing yet. Post something!</div>}

      {myNotes.map(function (note) {
        return (
          <div key={note.id} className={note.read ? "card note" : "card note note-new"}>
            {note.text}
            <div className="small-text">{timeAgo(note.createdAt)}</div>
          </div>
        );
      })}
    </div>
  );
}

export default Notifications;
