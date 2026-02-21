import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import CaseConverter from "@/components/tools/CaseConverter";

export const metadata: Metadata = {
  title: "Case Converter",
  description: "Convert text to UPPERCASE, lowercase, Title Case, camelCase, snake_case, and kebab-case. Free online case converter.",
  keywords: ["case converter", "uppercase", "lowercase", "camelcase", "snake case", "title case"],
};

export default function CaseConverterPage() {
  return (
    <ToolLayout
      toolName="Case Converter"
      toolSlug="case-converter"
      categoryName="Text Tools"
      categorySlug="text"
      description="Convert text to any case format: UPPERCASE, lowercase, Title Case, camelCase, snake_case, kebab-case, and more."
    >
      <CaseConverter />
    </ToolLayout>
  );
}
