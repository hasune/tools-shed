import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import PasswordGenerator from "@/components/tools/PasswordGenerator";

export const metadata: Metadata = {
  title: "Password Generator",
  description: "Generate strong, secure passwords with customizable length and character types. Free online password generator.",
  keywords: ["password generator", "secure password", "random password", "strong password", "password creator"],
};

export default function PasswordGeneratorPage() {
  return (
    <ToolLayout
      toolName="Password Generator"
      toolSlug="password-generator"
      categoryName="Text Tools"
      categorySlug="text"
      description="Generate cryptographically secure passwords using the Web Crypto API. Customize length and character types. No passwords are stored or transmitted."
    >
      <PasswordGenerator />
    </ToolLayout>
  );
}
