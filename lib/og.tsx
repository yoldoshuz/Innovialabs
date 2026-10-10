import "server-only";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

/**
 * Shared Open Graph renderer (1200×630) in brand style: Night cover with the
 * «> ✦» pattern, official mark, Manrope 800 title (guideline p.17/p.18).
 */
export const ogSize = { width: 1200, height: 630 };
export const ogContentType = "image/png";

const fontDir = join(process.cwd(), "node_modules/@fontsource");

async function fonts() {
  const load = (pkg: string, file: string) => readFile(join(fontDir, pkg, "files", file));
  const [m800l, m800c, i500l, i500c] = await Promise.all([
    load("manrope", "manrope-latin-800-normal.woff"),
    load("manrope", "manrope-cyrillic-800-normal.woff"),
    load("inter", "inter-latin-500-normal.woff"),
    load("inter", "inter-cyrillic-500-normal.woff"),
  ]);
  return [
    { name: "Manrope", data: m800l, weight: 800 as const, style: "normal" as const },
    { name: "Manrope", data: m800c, weight: 800 as const, style: "normal" as const },
    { name: "Inter", data: i500l, weight: 500 as const, style: "normal" as const },
    { name: "Inter", data: i500c, weight: 500 as const, style: "normal" as const },
  ];
}

async function dataUri(publicPath: string, mime: string) {
  const buf = await readFile(join(process.cwd(), "public", publicPath));
  return `data:${mime};base64,${buf.toString("base64")}`;
}

const PATTERN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='60' viewBox='0 0 120 60'%3E%3Cpath d='M24 23l7 7-7 7' fill='none' stroke='%23A78BFA' stroke-opacity='0.22' stroke-width='2.4' stroke-linecap='round' stroke-linejoin='round'/%3E%3Cpath d='M90 22.5q.9 6.6 7.5 7.5-6.6.9-7.5 7.5-.9-6.6-7.5-7.5 6.6-.9 7.5-7.5z' fill='%23A78BFA' fill-opacity='0.22'/%3E%3C/svg%3E\")";

export async function renderOg({
  title,
  subtitle,
  kicker,
  stat,
}: {
  title: string;
  subtitle?: string;
  kicker?: string;
  /** Headline number shown big on the right (cases). */
  stat?: { value: string; label: string };
}) {
  const [logo, fontList] = await Promise.all([
    dataUri("/Innovialabs-logo/svg/innovialabs-logo-horizontal-white.svg", "image/svg+xml"),
    fonts(),
  ]);

  const titleSize = title.length > 34 ? 64 : title.length > 20 ? 80 : 104;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          backgroundColor: "#120B24",
          backgroundImage: PATTERN,
          backgroundSize: "120px 60px",
          fontFamily: "Inter",
          color: "#fff",
        }}
      >
        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "64px 72px",
            width: stat ? 760 : "100%",
          }}
        >
          <div style={{ display: "flex" }}>
            {/* Official white horizontal logo file — never retyped. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={logo} width={312} height={80} alt="" />
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            {kicker ? (
              <div style={{ fontSize: 26, color: "#A78BFA", marginBottom: 18 }}>{kicker}</div>
            ) : null}
            <div
              style={{
                fontFamily: "Manrope",
                fontSize: titleSize,
                lineHeight: 0.98,
                letterSpacing: "-0.04em",
              }}
            >
              {title}
            </div>
            {subtitle ? (
              <div
                style={{
                  marginTop: 24,
                  fontSize: 28,
                  lineHeight: 1.35,
                  color: "#D9D2F2",
                  maxWidth: 980,
                }}
              >
                {subtitle}
              </div>
            ) : null}
          </div>

          <div style={{ display: "flex", fontSize: 22, color: "#A39CBD" }}>
            Innovation via Lab
          </div>
        </div>

        {stat ? (
          <div
            style={{
              position: "absolute",
              right: 64,
              top: 150,
              width: 360,
              height: 330,
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-end",
              padding: 36,
              borderRadius: 40,
              backgroundColor: "#7C3AED",
            }}
          >
            <div style={{ fontFamily: "Manrope", fontSize: 120, lineHeight: 0.9, letterSpacing: "-0.05em" }}>
              {stat.value}
            </div>
            <div style={{ marginTop: 16, fontSize: 28, lineHeight: 1.25, color: "#EDE9FE" }}>{stat.label}</div>
          </div>
        ) : null}
      </div>
    ),
    { ...ogSize, fonts: fontList },
  );
}
