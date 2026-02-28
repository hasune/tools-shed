import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "ToolsShed - Free Online Tools";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          background: "linear-gradient(135deg, #030712 0%, #0f172a 50%, #1e1b4b 100%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background grid pattern */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(rgba(99,102,241,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.07) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        {/* Glow effect */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "600px",
            height: "300px",
            background: "radial-gradient(ellipse, rgba(99,102,241,0.2) 0%, transparent 70%)",
          }}
        />

        {/* Content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "24px",
            position: "relative",
            zIndex: 10,
          }}
        >
          {/* Icon + Title */}
          <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
            <div
              style={{
                fontSize: "80px",
                lineHeight: 1,
              }}
            >
              🛠️
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              <span
                style={{
                  fontSize: "72px",
                  fontWeight: 800,
                  color: "#ffffff",
                  letterSpacing: "-2px",
                  lineHeight: 1,
                }}
              >
                Tools<span style={{ color: "#818cf8" }}>Shed</span>
              </span>
            </div>
          </div>

          {/* Tagline */}
          <p
            style={{
              fontSize: "28px",
              color: "#94a3b8",
              margin: 0,
              textAlign: "center",
              maxWidth: "700px",
              lineHeight: 1.4,
            }}
          >
            Free online tools for developers & professionals
          </p>

          {/* Pills */}
          <div style={{ display: "flex", gap: "12px", marginTop: "8px" }}>
            {["JSON Formatter", "UUID Generator", "BMI Calculator", "Unit Converters"].map(
              (label) => (
                <div
                  key={label}
                  style={{
                    background: "rgba(99,102,241,0.15)",
                    border: "1px solid rgba(99,102,241,0.4)",
                    borderRadius: "999px",
                    padding: "8px 20px",
                    color: "#a5b4fc",
                    fontSize: "18px",
                  }}
                >
                  {label}
                </div>
              )
            )}
          </div>
        </div>

        {/* Bottom URL */}
        <div
          style={{
            position: "absolute",
            bottom: "36px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            color: "#475569",
            fontSize: "20px",
          }}
        >
          tools-shed.com
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
