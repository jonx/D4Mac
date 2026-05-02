import { NextResponse } from "next/server";
import { incrementDownloads } from "@/lib/downloads";
import { getReleaseDownloadUrl } from "@/lib/storage";

/// `GET /api/download`:
///   1. Generate a fresh 1-hour presigned URL for the .dmg in the
///      Railway Bucket.
///   2. INCR the Postgres counter.
///   3. 302-redirect the browser at the presigned URL.
///
/// Returns 503 if the bucket isn't configured (no AWS_* env vars set).
export async function GET() {
  const target = await getReleaseDownloadUrl();
  if (!target) {
    return NextResponse.json(
      { error: "Release not available. Bucket credentials missing." },
      { status: 503 },
    );
  }
  const count = await incrementDownloads();
  console.log("download_click", {
    count,
    ts: new Date().toISOString(),
  });
  return NextResponse.redirect(target, 302);
}
