import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import BmiCalculator from "@/components/tools/BmiCalculator";

export const metadata: Metadata = {
  title: "BMI Calculator",
  description: "Calculate your Body Mass Index (BMI) with metric or imperial units. Free online BMI calculator for adults.",
  keywords: ["bmi calculator", "body mass index", "weight calculator", "health calculator", "bmi metric imperial"],
};

export default function BmiCalculatorPage() {
  return (
    <ToolLayout
      toolName="BMI Calculator"
      toolSlug="bmi-calculator"
      categoryName="Health Tools"
      categorySlug="health"
      description="Calculate your Body Mass Index (BMI) using metric (kg/cm) or imperial (lb/ft) units. BMI is a general health indicator — consult a doctor for medical advice."
    >
      <BmiCalculator />
    </ToolLayout>
  );
}
