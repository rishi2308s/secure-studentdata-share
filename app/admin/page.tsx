//Admin Page
"use client"; 

import { useState } from "react";

// Structure of Login response
type LoginResponse = {
  accessToken: string;
};
type ShareTokenResponse = {
  shareToken: string;
};

export default function AdminPage() {
  // Form & Auth states
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("admin");
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [shareToken, setShareToken] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Handles admin login
  async function handleLogin() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("https://tnp-recruitment-challenge.manitvig.live/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      if (!res.ok) throw new Error("Login failed");
      const data: LoginResponse = await res.json();
      setAccessToken(data.accessToken);
      setShareToken(null); 
    } 
    catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Unknown error");
      }
    }
    finally {
      setLoading(false);
    }
  }

  // Requests a new share token using current access token
  async function generateShareToken() {
    if (!accessToken) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("https://tnp-recruitment-challenge.manitvig.live/share", {
        method: "POST",
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (!res.ok) throw new Error("Failed to generate share token");
      const data: ShareTokenResponse = await res.json();
      setShareToken(data.shareToken);
    } 
    catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Unknown error");
      }
    } 
    finally {
      setLoading(false);
    }
  }

  function handleLogout() {
    setAccessToken(null);
    setShareToken(null);
    setError(null);
    setUsername("admin");
    setPassword("admin");
  }

  // Loading
  const Spinner = () => (
    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mx-auto"></div>
  );

  return (
    <main className="max-w-xl mx-auto bg-white p-8 rounded shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-center">Admin Panel</h1>

      {!accessToken ? (
        <>
          {/* Login Form */}
          <div className="mb-4">
            <label className="block font-semibold mb-1">Username</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
            />
          </div>

          <div className="mb-6">
            <label className="block font-semibold mb-1">Password</label>
            <input
              type="password"
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </div>

          {error && (
            <p className="mb-4 text-red-600 font-semibold text-center">{error}</p>
          )}

          <button
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition disabled:opacity-50 flex justify-center items-center"
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? <Spinner /> : "Login"}
          </button>
        </>
      ) : (
        <>
          {/* Authenticated View */}
          <p className="mb-4 text-green-700 font-semibold text-center">
            Logged in successfully!
          </p>

          <button
            className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition disabled:opacity-50 flex justify-center items-center"
            onClick={generateShareToken}
            disabled={loading}
          >
            {loading ? <Spinner /> : "Generate Share Link"}
          </button>

          <button
            className="mt-4 w-full bg-red-600 text-white py-2 rounded hover:bg-red-700 transition disabled:opacity-50"
            onClick={handleLogout}
            disabled={loading}
          >
            Logout
          </button>

          {shareToken && (
            <div className="mt-6 p-4 bg-gray-100 rounded break-words text-center">
              <p className="mb-2 font-semibold">Shareable Link:</p>

              {/* Link + Copy */}
              <div className="flex items-center justify-center gap-2 flex-wrap">
                <a
                  href={`${window.location.origin}/shared?shareToken=${shareToken}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline break-all"
                >
                  {`${window.location.origin}/shared?shareToken=${shareToken}`}
                </a>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(
                      `${window.location.origin}/shared?shareToken=${shareToken}`
                    );
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  }}
                  className="text-sm px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                >
                  {copied ? "Copied!" : "Copy"}
                </button>
              </div>
            </div>
          )}

          {error && (
            <p className="mt-4 text-red-600 font-semibold text-center">{error}</p>
          )}
        </>
      )}
    </main>
  );
}
