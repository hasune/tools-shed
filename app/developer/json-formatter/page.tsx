import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import JsonFormatter from "@/components/tools/JsonFormatter";

export const metadata: Metadata = {
  title: "JSON Formatter & Validator",
  description:
    "Format, validate, and beautify JSON data with syntax checking. Free online JSON formatter — works in your browser with no server uploads.",
  keywords: ["json formatter", "json validator", "json beautifier", "json minifier", "pretty print json"],
};

export default function JsonFormatterPage() {
  return (
    <ToolLayout
      toolName="JSON Formatter & Validator"
      toolSlug="json-formatter"
      categoryName="Developer Tools"
      categorySlug="developer"
      description="Format, validate, and beautify JSON data. Paste your JSON to check for syntax errors and pretty-print it with configurable indentation."
    >
      <JsonFormatter />
    </ToolLayout>
  );
}
