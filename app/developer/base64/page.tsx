import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import Base64Tool from "@/components/tools/Base64Tool";

export const metadata: Metadata = {
  title: "Base64 Encoder / Decoder",
  description:
    "Encode text to Base64 or decode Base64 strings instantly. Supports Unicode. Free online tool — runs entirely in your browser.",
  keywords: ["base64 encoder", "base64 decoder", "base64 convert", "encode decode", "binary text"],
};

export default function Base64Page() {
  return (
    <ToolLayout
      toolName="Base64 Encoder / Decoder"
      toolSlug="base64"
      categoryName="Developer Tools"
      categorySlug="developer"
      description="Encode text to Base64 or decode Base64 strings back to plain text. Supports Unicode characters. No data leaves your browser."
    >
      <Base64Tool />
    </ToolLayout>
  );
}
