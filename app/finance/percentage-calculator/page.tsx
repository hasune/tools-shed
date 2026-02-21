import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import PercentageCalculator from "@/components/tools/PercentageCalculator";

export const metadata: Metadata = {
  title: "Percentage Calculator",
  description: "Calculate percentages, percentage change, what percent X is of Y, and tip amounts. Free online percentage calculator.",
  keywords: ["percentage calculator", "percent of", "percent change", "tip calculator", "percentage tool"],
};

export default function PercentageCalculatorPage() {
  return (
    <ToolLayout
      toolName="Percentage Calculator"
      toolSlug="percentage-calculator"
      categoryName="Finance Tools"
      categorySlug="finance"
      description="Calculate percentages, find percentage change between values, determine what percent one number is of another, or split a bill with tip."
    >
      <PercentageCalculator />
    </ToolLayout>
  );
}
