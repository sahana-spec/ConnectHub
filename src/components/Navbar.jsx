// The bar at the top of the page.
import { APP_NAME, LANGUAGES } from "../data";

function Navbar(props) {
  return (
    <div className="navbar">
      <div className="navbar-inner">
        <h2
          className="logo clickable"
          onClick={function () {
            props.onChangePage("home");
          }}
        >
          📣 {APP_NAME}
        </h2>

        <div className="nav-buttons">
          <button
            className={props.page === "home" ? "nav-button active" : "nav-button"}
            onClick={function () {
              props.onChangePage("home");
            }}
          >
            🏠 Home
          </button>

          <button
            className={props.page === "notifications" ? "nav-button active" : "nav-button"}
            onClick={function () {
              props.onChangePage("notifications");
            }}
          >
            🔔 Alerts
            {props.unreadCount > 0 && <span className="badge-count">{props.unreadCount}</span>}
          </button>

          <button
            className={props.page === "profile" ? "nav-button active" : "nav-button"}
            onClick={function () {
              props.onOpenProfile(props.currentUser.name);
            }}
          >
            👤 @{props.currentUser.name}
          </button>

          {/* my language: used for translate and default post language */}
          <select
            value={props.currentUser.language}
            onChange={function (e) {
              props.onLanguageChange(e.target.value);
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

          <button className="small-button" onClick={props.onLogout}>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
