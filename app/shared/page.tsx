//Shared Page
"use client"; 

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

type Student = {
  first_name: string;
  last_name: string;
  email: string;
  roll_no: string;
};

export default function SharedPage() {
  const searchParams = useSearchParams();
  const shareToken = searchParams.get("shareToken"); // Get token from URL
  const [data, setData] = useState<Student[]>([]);        // All data
  const [filtered, setFiltered] = useState<Student[]>([]); // Filtered view
  const [query, setQuery] = useState("");                 // Search input
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!shareToken) {
      setError("No share token provided.");
      setLoading(false);
      return;
    }

    // Fetch data using the share token
    fetch(`https://tnp-recruitment-challenge.manitvig.live/share?shareToken=${shareToken}`)
      .then((res) => {
        if (!res.ok) throw new Error("Invalid or expired token");
        return res.json();
      })
      .then((data: Student[]) => {
        setData(data);
        setFiltered(data);
        setError(null);
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => setLoading(false));
  }, [shareToken]);

  // Filter based on search query
  useEffect(() => {
    if (query.trim() === "") {
      setFiltered(data);
    } else {
      const lower = query.toLowerCase();
      setFiltered(
        data.filter((student) =>
          student.email.toLowerCase().includes(lower)
        )
      );
    }
  }, [query, data]);

  // Loading
  if (loading) {
    return (
      <main className="flex flex-col items-center justify-center h-screen text-xl font-semibold">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-600 border-t-transparent"></div>
        <span className="mt-4">Loading...</span>
      </main>
    );
  }

  return (
    <main className="max-w-4xl mx-auto bg-white p-6 rounded shadow">
      <h1 className="text-2xl font-bold mb-4 text-center">
        Shared Student Data
      </h1>

      {error ? (
        <div className="text-center">
          <p className="text-red-600 font-semibold">{error}</p>
          {error.toLowerCase().includes("expired") && (
            <p className="mt-2 text-gray-700 text-sm">
              The link may have expired. Please request a new one from the admin
              panel.
            </p>
          )}
        </div>
      ) : (
        <>
          {/* Search bar */}
          <input
            type="text"
            placeholder="Filter by email"
            className="w-full border border-gray-300 rounded px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />

          {/* Table display */}
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto border border-gray-300">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="px-4 py-2 border">First Name</th>
                  <th className="px-4 py-2 border">Last Name</th>
                  <th className="px-4 py-2 border">Email</th>
                  <th className="px-4 py-2 border">Roll No</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((s, idx) => (
                  <tr key={idx} className="border-t border-gray-300">
                    <td className="px-4 py-2 border">{s.first_name}</td>
                    <td className="px-4 py-2 border">{s.last_name}</td>
                    <td className="px-4 py-2 border">{s.email}</td>
                    <td className="px-4 py-2 border">{s.roll_no}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </main>
  );
}


