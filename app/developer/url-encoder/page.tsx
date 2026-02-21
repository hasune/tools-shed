import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import UrlEncoderDecoder from "@/components/tools/UrlEncoderDecoder";

export const metadata: Metadata = {
  title: "URL Encoder / Decoder",
  description:
    "Encode and decode URLs and query parameters. Supports encodeURIComponent and encodeURI. Free online tool — runs in your browser.",
  keywords: ["url encoder", "url decoder", "percent encoding", "uri encode", "url encode decode"],
};

export default function UrlEncoderPage() {
  return (
    <ToolLayout
      toolName="URL Encoder / Decoder"
      toolSlug="url-encoder"
      categoryName="Developer Tools"
      categorySlug="developer"
      description="Encode text or URLs using percent-encoding (URL encoding) or decode encoded URLs back to readable text. Supports both encodeURIComponent and encodeURI."
    >
      <UrlEncoderDecoder />
    </ToolLayout>
  );
}
