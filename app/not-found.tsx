import Link from "next/link";

export default function NotFound() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-24 text-center">
      <div className="text-6xl mb-6">🔧</div>
      <h1 className="text-4xl font-bold text-white mb-4">Tool Not Found</h1>
      <p className="text-gray-400 text-lg mb-8">
        The tool you&apos;re looking for doesn&apos;t exist yet — but we&apos;re always adding more!
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-6 py-3 rounded-lg transition-colors"
      >
        Browse all tools
      </Link>
    </div>
  );
}
