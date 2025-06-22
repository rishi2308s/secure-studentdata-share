//Landing Page
"use client";

import { useState } from "react";

export default function LandingPage() {
  const [loading, setLoading] = useState(false);

  //Simluate Login redirect
  const handleAdminClick = () => {
    setLoading(true);
    setTimeout(() => {
      window.location.href = "/admin";
    }, 500);
  };

  return (
    <main
      className="relative min-h-screen flex flex-col justify-center items-center px-6 py-12 overflow-hidden"
    >
      <div
        className="absolute inset-0 bg-cover bg-center opacity-40"
        style={{ backgroundImage: "url('/dtu.jpeg')" }}
      ></div>

      <div className="relative z-10 text-center">
        <h1 className="text-4xl font-extrabold mb-4 text-gray-900">
          Secure Student Data Sharing
        </h1>
        <p className="mb-8 text-gray-800 max-w-md mx-auto">
          Generate and share unique links to student data securely.
        </p>

        <button
          onClick={handleAdminClick}
          disabled={loading}
          className={`px-6 py-3 rounded-lg shadow transition ${
            loading
              ? "bg-blue-700 cursor-not-allowed text-white"
              : "bg-blue-600 hover:bg-blue-700 text-white"
          }`}
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
              Logging in...
            </div>
          ) : (
            "Admin Login"
          )}
        </button>
      </div>
    </main>
  );
}





