import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import CompoundInterest from "@/components/tools/CompoundInterest";

export const metadata: Metadata = {
  title: "Compound Interest Calculator",
  description: "Calculate compound interest growth for investments. Includes monthly contributions, different compounding frequencies. Free online calculator.",
  keywords: ["compound interest calculator", "investment calculator", "interest growth", "savings calculator"],
};

export default function CompoundInterestPage() {
  return (
    <ToolLayout
      toolName="Compound Interest Calculator"
      toolSlug="compound-interest"
      categoryName="Finance Tools"
      categorySlug="finance"
      description="Calculate how your investment grows over time with compound interest. Supports monthly contributions and various compounding frequencies."
    >
      <CompoundInterest />
    </ToolLayout>
  );
}
