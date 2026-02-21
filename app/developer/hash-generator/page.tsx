import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import HashGenerator from "@/components/tools/HashGenerator";

export const metadata: Metadata = {
  title: "Hash Generator — MD5, SHA-256, SHA-512",
  description:
    "Generate MD5, SHA-256, and SHA-512 cryptographic hashes from text. Free online hash generator — all computation in your browser.",
  keywords: ["hash generator", "md5", "sha256", "sha512", "checksum", "crypto hash"],
};

export default function HashGeneratorPage() {
  return (
    <ToolLayout
      toolName="Hash Generator"
      toolSlug="hash-generator"
      categoryName="Developer Tools"
      categorySlug="developer"
      description="Generate MD5, SHA-256, and SHA-512 hashes from any text input. Uses the browser's native Web Crypto API. No server-side processing."
    >
      <HashGenerator />
    </ToolLayout>
  );
}
