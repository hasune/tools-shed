import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import AgeCalculator from "@/components/tools/AgeCalculator";

export const metadata: Metadata = {
  title: "Age Calculator",
  description: "Calculate exact age in years, months, and days from a birth date. Find total days lived and days until next birthday.",
  keywords: ["age calculator", "birthday calculator", "how old am i", "age in days", "date calculator"],
};

export default function AgeCalculatorPage() {
  return (
    <ToolLayout
      toolName="Age Calculator"
      toolSlug="age-calculator"
      categoryName="Time Tools"
      categorySlug="time"
      description="Calculate your exact age in years, months, and days. Also shows total days lived and how many days until your next birthday."
    >
      <AgeCalculator />
    </ToolLayout>
  );
}
