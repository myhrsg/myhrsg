import { Router } from "express";
import * as authController from "../controllers/authController.js";
import { isAuth } from "../middleware/authMiddleware.js";

const router = Router();

// ── Step 1: Redirect user to LinkedIn authorization page ──────────────────
router.get("/linkedin", (req, res) => {
  const csrf  = Math.random().toString(36).substring(7);
  const role  = req.query.role === "admin" ? "admin" : "member";
  const state = Buffer.from(JSON.stringify({ csrf, role })).toString("base64");

  const params = new URLSearchParams({
    response_type: "code",
    client_id: process.env.LINKEDIN_CLIENT_ID,
    redirect_uri: process.env.REDIRECT_URI || `${process.env.APP_URL}/api/auth/linkedin/callback`,
    scope: "openid profile email",
    state,
  });
  res.redirect(`https://www.linkedin.com/oauth/v2/authorization?${params}`);
});

// ── Step 2: LinkedIn redirects back here with a code ────────────────────
router.get("/linkedin/callback", async (req, res) => {
  try {
    const { code, state, error, error_description } = req.query;

    if (error) {
      throw new Error(error_description || error);
    }
    if (!code) {
      throw new Error("No authorization code returned from LinkedIn.");
    }

    // Decode state to get intended role
    let intendedRole = "member";
    try {
      const decoded = JSON.parse(Buffer.from(state, "base64").toString("utf8"));
      intendedRole  = decoded.role === "admin" ? "admin" : "member";
    } catch (_) { /* default to member on malformed state */ }

    // Exchange the code for an access token
    const tokenRes = await fetch("https://www.linkedin.com/oauth/v2/accessToken", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: process.env.REDIRECT_URI || `${process.env.APP_URL}/api/auth/linkedin/callback`,
        client_id: process.env.LINKEDIN_CLIENT_ID,
        client_secret: process.env.LINKEDIN_CLIENT_SECRET,
      }),
    });

    const tokenData = await tokenRes.json();
    if (tokenData.error) {
      throw new Error(tokenData.error_description || tokenData.error);
    }

    // Fetch the user's profile from LinkedIn's OIDC userinfo endpoint
    const userInfoRes = await fetch("https://api.linkedin.com/v2/userinfo", {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });

    const userInfo = await userInfoRes.json();
    console.log("LinkedIn userInfo:", userInfo); // helpful for debugging

    if (!userInfo.email) {
      throw new Error(
        "LinkedIn did not return an email. Please ensure your LinkedIn account has a verified email and that the 'email' scope is approved in your LinkedIn Developer App."
      );
    }

    // Attach the normalized profile to the request for the controller
    req.linkedinProfile = {
      id: userInfo.sub,
      name: userInfo.name || `${userInfo.given_name || ""} ${userInfo.family_name || ""}`.trim(),
      email: userInfo.email,
      photo: userInfo.picture || null,
      intendedRole, // "member" or "admin"
    };

    await authController.linkedinCallback(req, res);
  } catch (err) {
    console.error("LinkedIn OAuth error:", err.message);
    const redirectUrl = process.env.CLIENT_URL || process.env.APP_URL;
    res.redirect(`${redirectUrl}/login?error=${encodeURIComponent(err.message)}`);
  }
});

// ── Step 1: Redirect user to Google authorization page ────────────────────
router.get("/google", (req, res) => {
  const csrf  = Math.random().toString(36).substring(7);
  const role  = req.query.role === "admin" ? "admin" : "member";
  const state = Buffer.from(JSON.stringify({ csrf, role })).toString("base64");

  const params = new URLSearchParams({
    response_type: "code",
    client_id: process.env.GOOGLE_CLIENT_ID,
    redirect_uri: process.env.GOOGLE_REDIRECT_URI || `${process.env.APP_URL}/api/auth/google/callback`,
    scope: "openid profile email",
    state,
    access_type: "offline",
    prompt: "select_account",
  });
  res.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params}`);
});

// ── Step 2: Google redirects back here with a code ──────────────────────
router.get("/google/callback", async (req, res) => {
  try {
    const { code, state, error } = req.query;

    if (error) {
      throw new Error(error);
    }
    if (!code) {
      throw new Error("No authorization code returned from Google.");
    }

    // Decode state to get intended role
    let intendedRole = "member";
    try {
      const decoded = JSON.parse(Buffer.from(state, "base64").toString("utf8"));
      intendedRole  = decoded.role === "admin" ? "admin" : "member";
    } catch (_) { /* default to member on malformed state */ }

    // Exchange the code for an access token
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: process.env.GOOGLE_REDIRECT_URI || `${process.env.APP_URL}/api/auth/google/callback`,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
      }),
    });

    const tokenData = await tokenRes.json();
    if (tokenData.error) {
      throw new Error(tokenData.error_description || tokenData.error);
    }

    // Fetch the user's profile from Google's userinfo endpoint
    const userInfoRes = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });

    const userInfo = await userInfoRes.json();
    console.log("Google userInfo:", userInfo);

    if (!userInfo.email) {
      throw new Error("Google did not return an email.");
    }

    // Attach the normalized profile to the request for the controller
    req.googleProfile = {
      id: userInfo.sub,
      name: userInfo.name || `${userInfo.given_name || ""} ${userInfo.family_name || ""}`.trim(),
      email: userInfo.email,
      photo: userInfo.picture || null,
      intendedRole,
    };

    await authController.googleCallback(req, res);
  } catch (err) {
    console.error("Google OAuth error:", err.message);
    const redirectUrl = process.env.CLIENT_URL || process.env.APP_URL;
    res.redirect(`${redirectUrl}/login?error=${encodeURIComponent(err.message)}`);
  }
});

// ── OTP Verification ────────────────────────────────────────────────────
router.post("/verify-otp", authController.verifyOTP);
router.post("/resend-otp", authController.resendOTP);

// ── Manual Auth (Email Flow) ──────────────────────────────────────────
router.post("/manual", authController.manualAuth);

// ── Complete Profile (Phase 3) ────────────────────────────────────────
router.post("/complete-profile", authController.completeProfile);

// ── Get Current User ──────────────────────────────────────────────────
router.get("/me", isAuth, authController.getMe);

export default router;
