import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import TemperatureConverter from "@/components/tools/TemperatureConverter";

export const metadata: Metadata = {
  title: "Temperature Converter",
  description: "Convert between Celsius, Fahrenheit, and Kelvin instantly. Free online temperature converter.",
  keywords: ["temperature converter", "celsius to fahrenheit", "fahrenheit to celsius", "kelvin converter"],
};

export default function TemperatureConverterPage() {
  return (
    <ToolLayout
      toolName="Temperature Converter"
      toolSlug="temperature-converter"
      categoryName="Unit Converters"
      categorySlug="converters"
      description="Convert between Celsius, Fahrenheit, and Kelvin. Type in any field and all others update instantly."
    >
      <TemperatureConverter />
    </ToolLayout>
  );
}
