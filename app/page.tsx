"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";


export default function Home() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();
  useEffect(() => {
  const getUser = async () => {
    const { data } = await supabase.auth.getUser();

    if (data.user) {
      setUser(data.user);
      router.push("/dashboard");
    }
  };

  getUser();
}, [router]);


  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
    });
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <div className="flex h-screen items-center justify-center flex-col gap-4">
      {user ? (
        <>
          <p className="text-lg">Welcome {user.email}</p>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-6 py-2 rounded"
          >
            Logout
          </button>
        </>
      ) : (
        <button
          onClick={handleLogin}
          className="bg-black text-white px-6 py-3 rounded"
        >
          Login with Google
        </button>
      )}
    </div>
  );
}
