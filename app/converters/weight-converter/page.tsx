import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import UnitConverter from "@/components/tools/UnitConverter";

export const metadata: Metadata = {
  title: "Weight Converter",
  description: "Convert between kilograms, pounds, ounces, grams, tons, and more. Free online weight unit converter.",
  keywords: ["weight converter", "kg to lbs", "pounds to kg", "gram to ounce", "mass converter"],
};

export default function WeightConverterPage() {
  return (
    <ToolLayout
      toolName="Weight Converter"
      toolSlug="weight-converter"
      categoryName="Unit Converters"
      categorySlug="converters"
      description="Convert between kilograms, pounds, ounces, grams, stones, and more. Type in any field and all others update instantly."
    >
      <UnitConverter type="weight" />
    </ToolLayout>
  );
}
