import ImageKit from "imagekit";

let imagekit = null;

try {
  if (process.env.IMAGEKIT_PUBLIC_KEY && process.env.IMAGEKIT_PRIVATE_KEY && process.env.IMAGEKIT_URL_ENDPOINT) {
    imagekit = new ImageKit({
      publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
      privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
      urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
    });
  } else {
    console.warn("ImageKit env vars missing — upload feature disabled.");
  }
} catch (err) {
  console.warn("ImageKit initialization failed:", err.message);
}

export const getAuthParams = (req, res) => {
  if (!imagekit) {
    return res.status(503).json({ error: "ImageKit is not configured." });
  }
  const result = imagekit.getAuthenticationParameters();
  res.send(result);
};
