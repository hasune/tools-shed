import { ImageResponse } from "next/og";
import { getToolBySlug, getCategoryBySlug } from "@/lib/tools";

export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OgImage({
  params,
}: {
  params: Promise<{ category: string; tool: string }>;
}) {
  const { category: categorySlug, tool: toolSlug } = await params;
  const tool = getToolBySlug(toolSlug);
  const category = getCategoryBySlug(categorySlug);

  const toolName = tool?.name ?? "Online Tool";
  const toolDesc = tool?.description ?? "Free online tool";
  const categoryName = category?.name ?? "Tools";
  const icon = tool?.icon ?? "🛠️";

  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          background: "linear-gradient(135deg, #030712 0%, #0f172a 60%, #1e1b4b 100%)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          fontFamily: "sans-serif",
          position: "relative",
          overflow: "hidden",
          padding: "60px 72px",
        }}
      >
        {/* Background grid */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(rgba(99,102,241,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.07) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        {/* Glow */}
        <div
          style={{
            position: "absolute",
            bottom: "-100px",
            right: "-100px",
            width: "500px",
            height: "500px",
            background: "radial-gradient(circle, rgba(99,102,241,0.25) 0%, transparent 70%)",
          }}
        />

        {/* Top: site name */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            position: "relative",
            zIndex: 10,
          }}
        >
          <span style={{ fontSize: "32px" }}>🛠️</span>
          <span style={{ color: "#ffffff", fontSize: "28px", fontWeight: 700 }}>
            Tools<span style={{ color: "#818cf8" }}>Shed</span>
          </span>
          <span style={{ color: "#334155", fontSize: "24px", marginLeft: "8px" }}>·</span>
          <span style={{ color: "#64748b", fontSize: "22px" }}>{categoryName}</span>
        </div>

        {/* Center: tool name */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "20px",
            position: "relative",
            zIndex: 10,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
            <div
              style={{
                background: "rgba(99,102,241,0.2)",
                border: "1px solid rgba(99,102,241,0.4)",
                borderRadius: "16px",
                width: "88px",
                height: "88px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "44px",
              }}
            >
              {icon}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <h1
                style={{
                  fontSize: "56px",
                  fontWeight: 800,
                  color: "#ffffff",
                  margin: 0,
                  letterSpacing: "-1px",
                  lineHeight: 1.1,
                }}
              >
                {toolName}
              </h1>
              <p
                style={{
                  fontSize: "24px",
                  color: "#94a3b8",
                  margin: 0,
                  maxWidth: "720px",
                  lineHeight: 1.4,
                }}
              >
                {toolDesc}
              </p>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            position: "relative",
            zIndex: 10,
          }}
        >
          <div style={{ display: "flex", gap: "12px" }}>
            {["Free", "No sign-up", "Browser-based"].map((tag) => (
              <div
                key={tag}
                style={{
                  background: "rgba(30,41,59,0.8)",
                  border: "1px solid rgba(51,65,85,0.8)",
                  borderRadius: "999px",
                  padding: "6px 16px",
                  color: "#64748b",
                  fontSize: "18px",
                }}
              >
                {tag}
              </div>
            ))}
          </div>
          <span style={{ color: "#334155", fontSize: "20px" }}>tools-shed.com</span>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
