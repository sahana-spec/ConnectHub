import { useEffect, useState } from "react";
import { supabase } from "./supabase";

function SupabaseTest() {
  const [message, setMessage] = useState("Testing...");

  useEffect(function () {
    async function testConnection() {
      const { error } = await supabase
        .from("profiles")
        .select("id")
        .limit(1);

      if (error) {
        setMessage("Supabase error: " + error.message);
        return;
      }

      setMessage("Supabase connected successfully!");
    }

    testConnection();
  }, []);

  return (
    <div>
      <h1>{message}</h1>
    </div>
  );
}

export default SupabaseTest;