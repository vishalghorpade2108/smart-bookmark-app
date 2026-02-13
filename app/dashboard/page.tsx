"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { RealtimeChannel, User } from "@supabase/supabase-js";

interface Bookmark {
  id: string;
  title: string;
  url: string;
  user_id: string;
  created_at?: string;
}

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [adding, setAdding] = useState(false);
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    let channel: RealtimeChannel;

    const setup = async () => {
      setLoading(true);

      const { data: userData } = await supabase.auth.getUser();

      if (!userData.user) {
        router.replace("/");
        return;
      }

      setUser(userData.user);

      const { data } = await supabase
        .from("bookmarks")
        .select("*")
        .eq("user_id", userData.user.id)
        .order("created_at", { ascending: false });

      setBookmarks(data || []);
      setLoading(false);

      channel = supabase
        .channel("bookmarks-changes")
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "bookmarks",
            filter: `user_id=eq.${userData.user.id}`,
          },
          (payload) => {
            if (payload.eventType === "INSERT") {
              setBookmarks((prev) => [payload.new as Bookmark, ...prev]);
            }

            if (payload.eventType === "DELETE") {
              setBookmarks((prev) =>
                prev.filter((b) => b.id !== payload.old.id),
              );
            }

            if (payload.eventType === "UPDATE") {
              setBookmarks((prev) =>
                prev.map((b) =>
                  b.id === payload.new.id ? (payload.new as Bookmark) : b,
                ),
              );
            }
          },
        )
        .subscribe();
    };

    setup();

    return () => {
      if (channel) supabase.removeChannel(channel);
    };
  }, [router]);

  const handleAddBookmark = async () => {
    if (!title.trim() || !url.trim()) {
      setError("Please enter both title and URL.");
      return;
    }

    if (!/^https?:\/\/.+/i.test(url)) {
      setError("URL must start with http:// or https://");
      return;
    }

    setError("");
    setAdding(true);

    await supabase.from("bookmarks").insert([
      {
        title,
        url,
        user_id: user?.id,
      },
    ]);

    setTitle("");
    setUrl("");
    setAdding(false);
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);

    await supabase.from("bookmarks").delete().eq("id", id);

    setDeletingId(null);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 text-gray-900">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-gray-300 border-t-black rounded-full animate-spin"></div>
          <p className="text-gray-600 text-sm">Loading bookmarks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-10 text-gray-900">
      <div className="max-w-2xl mx-auto bg-white text-gray-900 p-8 rounded-2xl shadow-lg">
       
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-slate-800">My Bookmarks</h1>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition"
          >
            Logout
          </button>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <input
            type="text"
            placeholder="Bookmark title"
            className="border border-gray-300 p-3 flex-1 rounded-lg focus:ring-2 focus:ring-black outline-none"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <input
            type="text"
            placeholder="https://example.com"
            className="border border-gray-300 p-3 flex-1 rounded-lg focus:ring-2 focus:ring-black outline-none"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />

          <button
            onClick={handleAddBookmark}
            disabled={adding}
            className="bg-black hover:bg-gray-800 text-white px-6 rounded-lg transition flex items-center justify-center min-w-[80px]"
          >
            {adding ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              "Add"
            )}
          </button>
        </div>

        {error && (
          <div className="bg-red-100 text-red-600 px-4 py-2 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        {/* Empty State */}
        {bookmarks.length === 0 && (
          <div className="text-center text-gray-500 py-10">
            No bookmarks yet <br />
            Add your first one above.
          </div>
        )}

        {/* Bookmark List */}
        <ul className="space-y-3">
          {bookmarks.map((bookmark) => (
            <li
              key={bookmark.id}
              className="border border-gray-200 p-4 rounded-xl flex justify-between items-center hover:shadow-md transition bg-gray-50"
            >
              <div>
                <p className="font-semibold text-slate-800">{bookmark.title}</p>
                <a
                  href={bookmark.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 text-sm hover:underline break-all"
                >
                  {bookmark.url}
                </a>
              </div>

              <button
                onClick={() => handleDelete(bookmark.id)}
                disabled={deletingId === bookmark.id}
                className="flex items-center justify-center min-w-[70px] text-red-500 hover:text-red-700 transition disabled:opacity-50"
              >
                {deletingId === bookmark.id ? (
                  <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  "Delete"
                )}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
