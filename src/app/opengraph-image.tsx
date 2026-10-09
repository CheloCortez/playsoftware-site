import { ImageResponse } from "next/og";
import { site } from "@/content/site";

export const alt = site.seo.title;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          gap: 28,
          padding: "0 90px",
          backgroundColor: "#0a0e10",
          backgroundImage:
            "radial-gradient(ellipse 60% 60% at 78% 30%, rgba(0,227,155,0.16), transparent 70%)",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 108,
            fontWeight: 800,
            letterSpacing: -2,
            gap: 28,
          }}
        >
          <span style={{ color: "#00e39b" }}>{site.brand.nameAccent}</span>
          <span style={{ color: "#e8edef" }}>{site.brand.nameRest}</span>
        </div>
        <div
          style={{
            display: "flex",
            maxWidth: 900,
            fontSize: 34,
            lineHeight: 1.4,
            color: "#8a9ba3",
          }}
        >
          {site.brand.tagline}
        </div>
      </div>
    ),
    { ...size },
  );
}
