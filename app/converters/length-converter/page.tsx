import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import UnitConverter from "@/components/tools/UnitConverter";

export const metadata: Metadata = {
  title: "Length Converter",
  description: "Convert between meters, feet, inches, miles, kilometers, centimeters, and more. Free online length unit converter.",
  keywords: ["length converter", "meter to feet", "km to miles", "inch to cm", "unit conversion"],
};

export default function LengthConverterPage() {
  return (
    <ToolLayout
      toolName="Length Converter"
      toolSlug="length-converter"
      categoryName="Unit Converters"
      categorySlug="converters"
      description="Convert between kilometers, meters, miles, feet, inches, and more. Type in any field and all others update instantly."
    >
      <UnitConverter type="length" />
    </ToolLayout>
  );
}
