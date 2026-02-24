"use client";
import { useTranslations } from "next-intl";
import { useState } from "react";

const STATUS_CODES = [
  // 1xx
  { code: 100, name: "Continue", category: "1xx", desc: "The server has received the request headers and the client should proceed to send the request body.", useCase: "Used in POST requests with large bodies; client checks if server will accept before sending." },
  { code: 101, name: "Switching Protocols", category: "1xx", desc: "The server agrees to switch protocols as requested by the client.", useCase: "WebSocket upgrade from HTTP to WS protocol." },
  { code: 102, name: "Processing", category: "1xx", desc: "The server has received and is processing the request, but no response is available yet.", useCase: "Long-running operations to prevent client timeout." },
  { code: 103, name: "Early Hints", category: "1xx", desc: "Used to return some response headers before final HTTP message.", useCase: "Preloading resources before the main response is ready." },
  // 2xx
  { code: 200, name: "OK", category: "2xx", desc: "The request succeeded. The meaning depends on the HTTP method used.", useCase: "Standard success response for GET, POST, PUT requests." },
  { code: 201, name: "Created", category: "2xx", desc: "The request succeeded and a new resource was created as a result.", useCase: "Returned after a successful POST that creates a new resource." },
  { code: 202, name: "Accepted", category: "2xx", desc: "The request has been accepted for processing, but processing has not been completed.", useCase: "Async operations where processing happens in background." },
  { code: 204, name: "No Content", category: "2xx", desc: "The server successfully processed the request and is not returning any content.", useCase: "DELETE requests, or PUT/PATCH with no response body needed." },
  { code: 206, name: "Partial Content", category: "2xx", desc: "The server is delivering only part of the resource due to a Range header sent by the client.", useCase: "Video streaming, resumable file downloads." },
  // 3xx
  { code: 301, name: "Moved Permanently", category: "3xx", desc: "The requested resource has been permanently moved to a new URL.", useCase: "Permanent redirects; SEO-friendly for URL changes." },
  { code: 302, name: "Found", category: "3xx", desc: "The resource is temporarily under a different URI.", useCase: "Temporary redirects, login redirects." },
  { code: 304, name: "Not Modified", category: "3xx", desc: "The resource has not been modified since the last request.", useCase: "Browser caching; server confirms cached version is still valid." },
  { code: 307, name: "Temporary Redirect", category: "3xx", desc: "The request should be repeated with another URI but future requests can still use the original URI.", useCase: "Temporary redirect that preserves the HTTP method." },
  { code: 308, name: "Permanent Redirect", category: "3xx", desc: "The request and all future requests should be repeated using another URI.", useCase: "Permanent redirect that preserves the HTTP method." },
  // 4xx
  { code: 400, name: "Bad Request", category: "4xx", desc: "The server could not understand the request due to invalid syntax.", useCase: "Malformed JSON, missing required fields, invalid parameters." },
  { code: 401, name: "Unauthorized", category: "4xx", desc: "The client must authenticate itself to get the requested response.", useCase: "Missing or invalid authentication token." },
  { code: 403, name: "Forbidden", category: "4xx", desc: "The client does not have access rights to the content.", useCase: "Authenticated but not authorized; access denied to resource." },
  { code: 404, name: "Not Found", category: "4xx", desc: "The server can not find the requested resource.", useCase: "Invalid URL, deleted resource, or hidden resource." },
  { code: 405, name: "Method Not Allowed", category: "4xx", desc: "The request method is known by the server but is not supported by the target resource.", useCase: "POST to a read-only endpoint, DELETE on non-deletable resource." },
  { code: 408, name: "Request Timeout", category: "4xx", desc: "The server would like to shut down this unused connection.", useCase: "Client took too long to send a complete request." },
  { code: 409, name: "Conflict", category: "4xx", desc: "The request conflicts with the current state of the server.", useCase: "Duplicate resource creation, version conflicts." },
  { code: 410, name: "Gone", category: "4xx", desc: "The requested content has been permanently deleted from the server.", useCase: "Deliberately removed resources; stronger signal than 404." },
  { code: 422, name: "Unprocessable Entity", category: "4xx", desc: "The request was well-formed but was unable to be followed due to semantic errors.", useCase: "Validation errors — correct format but invalid data." },
  { code: 429, name: "Too Many Requests", category: "4xx", desc: "The user has sent too many requests in a given amount of time (rate limiting).", useCase: "API rate limiting, DDoS protection." },
  // 5xx
  { code: 500, name: "Internal Server Error", category: "5xx", desc: "The server encountered an unexpected condition that prevented it from fulfilling the request.", useCase: "Unhandled exceptions, server-side bugs." },
  { code: 501, name: "Not Implemented", category: "5xx", desc: "The server does not support the functionality required to fulfill the request.", useCase: "HTTP method not recognized or supported by server." },
  { code: 502, name: "Bad Gateway", category: "5xx", desc: "The server, while acting as a gateway, received an invalid response from an upstream server.", useCase: "Reverse proxy issues, upstream server errors." },
  { code: 503, name: "Service Unavailable", category: "5xx", desc: "The server is not ready to handle the request.", useCase: "Server maintenance, overloaded server." },
  { code: 504, name: "Gateway Timeout", category: "5xx", desc: "The server is acting as a gateway and cannot get a response in time.", useCase: "Upstream server too slow, network timeouts." },
  { code: 505, name: "HTTP Version Not Supported", category: "5xx", desc: "The HTTP version used in the request is not supported by the server.", useCase: "Client using unsupported HTTP version." },
];

const CATEGORY_COLORS: Record<string, string> = {
  "1xx": "bg-gray-600/40 text-gray-300 border-gray-600",
  "2xx": "bg-green-600/20 text-green-400 border-green-700",
  "3xx": "bg-blue-600/20 text-blue-400 border-blue-700",
  "4xx": "bg-yellow-600/20 text-yellow-400 border-yellow-700",
  "5xx": "bg-red-600/20 text-red-400 border-red-700",
};

export default function HttpStatusCodes() {
  const t = useTranslations("HttpStatusCodes");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const filtered = STATUS_CODES.filter((s) => {
    const q = search.toLowerCase();
    const matchSearch = !q || String(s.code).includes(q) || s.name.toLowerCase().includes(q) || s.desc.toLowerCase().includes(q);
    const matchCat = category === "All" || s.category === category;
    return matchSearch && matchCat;
  });

  return (
    <div className="space-y-4">
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder={t("searchPlaceholder")}
        className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
      />

      <div className="flex flex-wrap gap-2">
        {["All", "1xx", "2xx", "3xx", "4xx", "5xx"].map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-3 py-1 rounded-full text-sm border transition-colors ${
              category === cat
                ? "bg-indigo-600 border-indigo-500 text-white"
                : "bg-gray-900 border-gray-600 text-gray-400 hover:border-indigo-500"
            }`}
          >
            {cat === "All" ? t("categoryAll") : cat}
          </button>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-gray-500 text-center py-8">{t("noResults")}</p>
      )}

      <div className="space-y-3">
        {filtered.map((s) => (
          <div key={s.code} className={`rounded-xl border p-4 ${CATEGORY_COLORS[s.category]}`}>
            <div className="flex items-start gap-3">
              <span className="text-2xl font-bold font-mono shrink-0 w-14">{s.code}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-white">{s.name}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full border ${CATEGORY_COLORS[s.category]}`}>{s.category}</span>
                </div>
                <p className="text-sm text-gray-300 mb-2">{s.desc}</p>
                <p className="text-xs text-gray-400">
                  <span className="font-medium">{t("useCaseLabel")}:</span> {s.useCase}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
