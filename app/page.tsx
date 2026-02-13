"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser();

      if (data.user) {
        router.replace("/dashboard");
      } else {
        setLoading(false);
      }
    };

    checkUser();
  }, [router]);

  const handleLogin = async () => {
    setAuthLoading(true);

    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
      },
    });
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md text-center">
        <h1 className="text-2xl font-bold mb-2 text-gray-700 ">
          Smart Bookmark App
        </h1>

        <p className="text-gray-500 mb-6">
          Securely save and manage your private bookmarks
        </p>

        <button
          onClick={handleLogin}
          disabled={authLoading}
          className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 py-3 rounded-lg shadow-sm hover:shadow-md active:scale-95 transition"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 48 48"
            className="w-5 h-5"
          >
            <path
              fill="#EA4335"
              d="M24 9.5c3.4 0 6.4 1.2 8.8 3.2l6.6-6.6C35.2 2.4 30 0 24 0 14.6 0 6.6 5.4 2.6 13.2l7.8 6C12.4 13.4 17.7 9.5 24 9.5z"
            />
            <path
              fill="#4285F4"
              d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v8.5h12.7c-.6 3-2.3 5.6-4.9 7.3l7.8 6c4.6-4.3 7.3-10.7 7.3-17.3z"
            />
            <path
              fill="#FBBC05"
              d="M10.4 28.2c-1-3-1-6.3 0-9.3l-7.8-6C-1 20.4-1 27.6 2.6 34.8l7.8-6.6z"
            />
            <path
              fill="#34A853"
              d="M24 48c6.5 0 11.9-2.1 15.8-5.7l-7.8-6c-2.2 1.5-5 2.3-8 2.3-6.3 0-11.6-3.9-13.6-9.7l-7.8 6C6.6 42.6 14.6 48 24 48z"
            />
          </svg>

          <span className="font-medium text-gray-700">
            {authLoading ? "Redirecting..." : "Continue with Google"}
          </span>
        </button>
      </div>
    </div>
  );
}
