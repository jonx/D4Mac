import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

let _s3: S3Client | null = null;

function getS3(): S3Client | null {
  if (_s3) return _s3;
  if (
    !process.env.AWS_ENDPOINT_URL ||
    !process.env.AWS_ACCESS_KEY_ID ||
    !process.env.AWS_SECRET_ACCESS_KEY
  ) {
    return null;
  }
  _s3 = new S3Client({
    region: process.env.AWS_DEFAULT_REGION ?? "auto",
    endpoint: process.env.AWS_ENDPOINT_URL,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
    forcePathStyle: process.env.AWS_S3_URL_STYLE === "path",
  });
  return _s3;
}

/// Returns a 1-hour presigned URL for the latest release `.dmg`, or `null`
/// if the bucket isn't configured. Generated fresh per request — no env
/// var to rotate quarterly.
export async function getReleaseDownloadUrl(): Promise<string | null> {
  const s3 = getS3();
  const bucket = process.env.AWS_S3_BUCKET_NAME;
  const key = process.env.D4MAC_RELEASE_KEY ?? "D4Mac.dmg";
  if (!s3 || !bucket) return null;

  try {
    return await getSignedUrl(
      s3,
      new GetObjectCommand({ Bucket: bucket, Key: key }),
      { expiresIn: 3600 },
    );
  } catch (err) {
    console.warn("storage.getReleaseDownloadUrl failed", err);
    return null;
  }
}
