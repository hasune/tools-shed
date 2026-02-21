import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import JwtDecoder from "@/components/tools/JwtDecoder";

export const metadata: Metadata = {
  title: "JWT Decoder",
  description:
    "Decode and inspect JSON Web Token (JWT) headers and payloads without signature verification. Free, browser-based JWT inspector.",
  keywords: ["jwt decoder", "json web token", "jwt inspector", "decode jwt", "jwt payload", "jwt header"],
};

export default function JwtDecoderPage() {
  return (
    <ToolLayout
      toolName="JWT Decoder"
      toolSlug="jwt-decoder"
      categoryName="Developer Tools"
      categorySlug="developer"
      description="Decode and inspect JWT (JSON Web Token) payloads and headers. Detects expiry status. Signature is NOT verified — payload decoding only."
    >
      <JwtDecoder />
    </ToolLayout>
  );
}
