import Head from "next/head";
import Link from "next/link";
import { SeoHead } from "@/components/shared/SeoHead";

export default function NotFoundPage() {
  return (
    <>
      <SeoHead
        title="Page not found | Dr. Vikram"
        description="The page you are looking for could not be found. Return to Dr. Vikram's urology and robotic surgery website."
      />
      <Head>
        <meta content="noindex, follow" name="robots" />
      </Head>
      <main style={{ minHeight: "58vh", padding: "180px 24px 96px", textAlign: "center" }}>
        <p style={{ color: "#89939a", fontWeight: 600, marginBottom: 16 }}>404</p>
        <h1 style={{ color: "#29293d", fontSize: "clamp(40px, 7vw, 76px)", lineHeight: 1.05, margin: 0 }}>
          Page not found
        </h1>
        <p style={{ color: "#6f7b82", fontSize: 18, margin: "20px auto 32px", maxWidth: 560 }}>
          The page may have moved, or the address may be incorrect.
        </p>
        <Link
          href="/"
          style={{
            background: "#28b8b7",
            borderRadius: 999,
            color: "#fff",
            display: "inline-block",
            fontWeight: 700,
            padding: "14px 28px",
            textDecoration: "none",
          }}
        >
          Go home
        </Link>
      </main>
    </>
  );
}
