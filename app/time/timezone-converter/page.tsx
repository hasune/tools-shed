import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import TimezoneConverter from "@/components/tools/TimezoneConverter";

export const metadata: Metadata = {
  title: "Timezone Converter",
  description: "Convert time between different time zones worldwide. See current time in New York, London, Tokyo, Sydney, and more.",
  keywords: ["timezone converter", "time zone converter", "world time", "convert time zones", "utc converter"],
};

export default function TimezoneConverterPage() {
  return (
    <ToolLayout
      toolName="Timezone Converter"
      toolSlug="timezone-converter"
      categoryName="Time Tools"
      categorySlug="time"
      description="Convert any date and time between 15+ major time zones worldwide. See what time it is in New York, London, Tokyo, Sydney, and more."
    >
      <TimezoneConverter />
    </ToolLayout>
  );
}
