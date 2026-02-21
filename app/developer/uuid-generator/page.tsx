import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import UuidGenerator from "@/components/tools/UuidGenerator";

export const metadata: Metadata = {
  title: "UUID Generator",
  description:
    "Generate random UUIDs (v4) instantly in your browser. Bulk generate up to 50 UUIDs, with options for uppercase and hyphen formatting.",
  keywords: ["uuid generator", "guid generator", "uuid v4", "random uuid", "unique identifier"],
};

export default function UuidGeneratorPage() {
  return (
    <ToolLayout
      toolName="UUID Generator"
      toolSlug="uuid-generator"
      categoryName="Developer Tools"
      categorySlug="developer"
      description="Generate cryptographically random UUID v4 identifiers. Generate one or in bulk — all in your browser using the Web Crypto API."
    >
      <UuidGenerator />
    </ToolLayout>
  );
}
