// Login / signup page using Supabase Authentication

import { useState } from "react";
import {
  APP_NAME,
  TAGLINE,
  CATEGORIES,
  ROLES,
} from "../data";

import { supabase } from "../supabase";

function Login(props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [role, setRole] = useState("Member");
  const [interests, setInterests] = useState([]);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Select / unselect interest
  function toggleInterest(category) {
    if (interests.includes(category)) {
      setInterests(
        interests.filter(function (item) {
          return item !== category;
        })
      );
    } else {
      setInterests([...interests, category]);
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");

    const cleanName = name.trim().toLowerCase();
    const cleanEmail = email.trim().toLowerCase();

    // -----------------------------
    // Validation
    // -----------------------------

    if (cleanName.length < 3) {
      setError("Name must be at least 3 characters");
      return;
    }

    if (!/^[a-z0-9_]+$/.test(cleanName)) {
      setError("Use only letters, numbers and _ in the name");
      return;
    }

    if (cleanEmail === "") {
      setError("Please enter your email");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (interests.length === 0) {
      setError("Pick at least one interest");
      return;
    }

    setLoading(true);

    // --------------------------------
    // Check if profile already exists
    // --------------------------------

    const { data: existingProfile, error: checkError } =
      await supabase
        .from("profiles")
        .select("*")
        .eq("name", cleanName)
        .maybeSingle();

    if (checkError) {
      setError(checkError.message);
      setLoading(false);
      return;
    }

    // --------------------------------
    // Existing user -> LOGIN
    // --------------------------------

    if (existingProfile) {
      const { data, error: loginError } =
        await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password: password,
        });

      if (loginError) {
        setError(loginError.message);
        setLoading(false);
        return;
      }

      if (data.user) {
        /*
          Your existing App.jsx expects the username
          when calling onLogin().
        */
        props.onLogin(cleanName);
      }

      setLoading(false);
      return;
    }

    // --------------------------------
    // New user -> SIGN UP
    // --------------------------------

    const { data, error: signupError } =
      await supabase.auth.signUp({
        email: cleanEmail,
        password: password,
      });

    if (signupError) {
      setError(signupError.message);
      setLoading(false);
      return;
    }

    if (!data.user) {
      setError("Account could not be created");
      setLoading(false);
      return;
    }
if (!data.session) {
  setError(
    "Account created. Please verify your email, then log in."
  );
  setLoading(false);
  return;
}
    // --------------------------------
    // Create profile
    // --------------------------------

    const { error: profileError } =
      await supabase
        .from("profiles")
        .insert({
          id: data.user.id,
          name: cleanName,
          role: role,
          interests: interests,
          language: "en",
        });

    if (profileError) {
      setError(profileError.message);
      setLoading(false);
      return;
    }

    // Tell existing App.jsx about new user
    props.onSignup({
      name: cleanName,
      role: role,
      interests: interests,
      following: [],
      language: "en",
    });

    setLoading(false);
  }

  return (
    <div className="login-page">

      <form
        className="login-box"
        onSubmit={handleSubmit}
      >

        <h1 className="logo">
          📣 {APP_NAME}
        </h1>

        <p className="small-text">
          {TAGLINE}
        </p>

        {/* NAME */}

        <label>Your name</label>

        <input
          type="text"
          placeholder="Enter user name"
          value={name}
          onChange={function (e) {
            setName(e.target.value);
            setError("");
          }}
        />

        {/* EMAIL */}

        <label>Email</label>

        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={function (e) {
            setEmail(e.target.value);
            setError("");
          }}
        />

        {/* PASSWORD */}

        <label>Password</label>

        <input
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={function (e) {
            setPassword(e.target.value);
            setError("");
          }}
        />

        {/* ROLE */}

        <label>I am joining as</label>

        <select
          value={role}
          onChange={function (e) {
            setRole(e.target.value);
            setError("");
          }}
        >
          {ROLES.map(function (r) {
            return (
              <option
                key={r.name}
                value={r.name}
              >
                {r.name}
              </option>
            );
          })}
        </select>

        {/* INTERESTS */}

        <label>
          My interests
        </label>

        <div className="chip-row">

          {CATEGORIES.map(function (category) {

            const selected =
              interests.includes(category);

            return (
              <span
                key={category}
                className={
                  selected
                    ? "chip chip-selected"
                    : "chip"
                }
                onClick={function () {
                  toggleInterest(category);
                }}
              >
                {category}
              </span>
            );
          })}

        </div>

        {/* ERROR */}

        {error !== "" && (
          <p className="error">
            {error}
          </p>
        )}

        {/* BUTTON */}

        <button
          type="submit"
          className="main-button full-width"
          disabled={loading}
        >
          {loading ? "Please wait..." : "Enter"}
        </button>

      </form>

    </div>
  );
}

export default Login;