import { User } from "../models/User.js";
import { transporter, EMAIL_FROM } from "../config/email.js";
import jwt from "jsonwebtoken";

// Helper to generate 6-digit OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

const MAIN_ADMIN_EMAILS = ["myhrsg0@gmail.com", "sritesh77@gmail.com"];

// Helper to generate professional HTML email template
const getOtpTemplate = (name, otp) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background-color: #f4f7fa; -webkit-text-size-adjust: 100%;">
  <div style="padding: 40px 10px; background-color: #f1f4f8;">
    <div style="width: 100%; max-width: 480px; margin: 0 auto; padding: 50px 30px; border-radius: 40px; background-color: #ffffff; box-shadow: 0 30px 60px -12px rgba(50, 50, 93, 0.1), 0 18px 36px -18px rgba(0, 0, 0, 0.1);">
      
      <!-- Logo Section -->
      <div style="text-align: center; margin-bottom: 40px;">
        <div style="display: inline-block; padding: 12px 24px; background: linear-gradient(135deg, #0A66C2 0%, #084e96 100%); border-radius: 20px; box-shadow: 0 10px 20px rgba(10, 102, 194, 0.2);">
          <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 900; letter-spacing: -1.5px; line-height: 1;">myHRSG</h1>
        </div>
        <p style="color: #94a3b8; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 4px; margin-top: 20px; text-indent: 4px;">Sign In Code</p>
      </div>

      <!-- Content Section -->
      <div style="text-align: center;">
        <h2 style="font-size: 24px; font-weight: 900; color: #1e293b; margin-bottom: 20px; letter-spacing: -0.5px;">Welcome to myHRSG!</h2>
        <p style="font-size: 15px; color: #64748b; line-height: 1.8; margin-bottom: 40px;">Hi there, here is your one-time code to sign in to your account. We're glad to have you with us.</p>
        
        <!-- Premium OTP Grid -->
        <div style="margin: 40px 0;">
          <table border="0" cellpadding="0" cellspacing="0" align="center" style="margin: 0 auto;">
            <tr>
              ${otp.split('').map((char, index) => `
                <td align="center" valign="middle" style="width: 44px; height: 56px; background-color: #f8fafc; border: 2px solid #e2e8f0; border-radius: 16px; font-family: 'Courier New', Courier, monospace; font-size: 28px; font-weight: 900; color: #0A66C2;">
                  ${char}
                </td>
                ${index < 5 ? '<td style="width: 8px;"></td>' : ''}
              `).join('')}
            </tr>
          </table>
          <div style="margin-top: 30px;">
            <p style="display: inline-block; padding: 6px 16px; background-color: #fff1f2; color: #e11d48; font-size: 12px; font-weight: 800; border-radius: 100px; text-transform: uppercase;">Expires in 10 minutes</p>
          </div>
        </div>
      </div>

      <!-- Footer Section -->
      <div style="text-align: center; margin-top: 50px; padding-top: 35px; border-top: 1px solid #f1f5f9;">
        <p style="color: #94a3b8; font-size: 12px; line-height: 1.6; margin: 0;">&copy; ${new Date().getFullYear()} myHRSG • Elevating HR Excellence</p>
        <div style="margin-top: 15px;">
           <span style="display: inline-block; width: 4px; height: 4px; background-color: #e2e8f0; border-radius: 50%; margin: 0 10px; vertical-align: middle;"></span>
        </div>
      </div>

    </div>
  </div>
</body>
</html>
`;

// ─────────────────────────────────────────────────────────────────────────────
// After LinkedIn OAuth succeeds, generate & email OTP, redirect to verify page
// ─────────────────────────────────────────────────────────────────────────────
export const linkedinCallback = async (req, res) => {
  try {
    const profile = req.linkedinProfile;
    const intendedRole = profile.intendedRole || "member";

    // Find or create the user
    let user = await User.findOne({
      $or: [{ linkedinId: profile.id }, { email: profile.email }],
    });

    if (!user) {
      user = new User({
        name: profile.name,
        email: profile.email,
        linkedinId: profile.id,
        profileImage: profile.photo,
        status: "pending",
        isEmailVerified: false,
        role: intendedRole,
      });

      if (MAIN_ADMIN_EMAILS.includes(profile.email.toLowerCase())) {
        user.isMainAdmin = true;
        user.status = "accepted";
        user.role = "admin";
      }

      await user.save();

      // Notify admin of new signup
      await transporter.sendMail({
        from: EMAIL_FROM,
        to: "hello@myhrsg.org",
        subject: "New myHRSG Registration",
        text: `New LinkedIn signup:\n\nEmail: ${user.email}\n`,
      }).catch(err => console.error("Admin alert error:", err));

    } else {
      const isMainAdmin = MAIN_ADMIN_EMAILS.includes(user.email.toLowerCase());
      // Existing user — Check for role consistency
      if (user.role !== intendedRole && !isMainAdmin) {
        throw new Error(`You are registered as ${user.role === 'admin' ? 'an admin' : 'a member'}. Please select "${user.role === 'admin' ? 'Admin' : 'Member'}" on the login page to sign in correctly.`);
      }

      if (isMainAdmin) {
        user.isMainAdmin = true;
        user.status = "accepted";
        user.role = "admin";
      }

      // Keep LinkedIn fields in sync
      if (!user.linkedinId) user.linkedinId = profile.id;
      if (profile.photo && !user.profileImage) user.profileImage = profile.photo;

      await user.save();
    }


    // Generate & save OTP (same flow for everyone)
    const otp = generateOTP();
    user.otp = otp;
    user.otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 min
    await user.save();

    // Email OTP
    await transporter.sendMail({
      from: EMAIL_FROM,
      to: user.email,
      subject: `${otp} is your myHRSG sign-in code`,
      text: `Hi ${user.name || "there"},\n\nWelcome to myHRSG! Your sign-in code is: ${otp}\n\nThis code expires in 10 minutes.\n\n– Team myHRSG\nhttps://www.myhrsg.org`,
      html: getOtpTemplate(user.name || "Member", otp),
      headers: {
        'X-Mailer': 'myHRSG Mailer',
        'X-Priority': '1',
      },
    }).catch(err => console.error("OTP email error:", err));

    // Short-lived temp token → redirects to /verify-otp
    const tempToken = jwt.sign(
      { id: user._id, type: "verification" },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    const redirectUrl = process.env.CLIENT_URL || process.env.APP_URL;
    res.redirect(`${redirectUrl}/verify-otp?token=${tempToken}`);
  } catch (error) {
    console.error("linkedinCallback error:", error.message);
    const redirectUrl = process.env.CLIENT_URL || process.env.APP_URL;
    res.redirect(`${redirectUrl}/login?error=${encodeURIComponent(error.message)}`);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// After Google OAuth succeeds, generate & email OTP, redirect to verify page
// ─────────────────────────────────────────────────────────────────────────────
export const googleCallback = async (req, res) => {
  try {
    const profile = req.googleProfile;
    const intendedRole = profile.intendedRole || "member";

    // Find or create the user
    let user = await User.findOne({
      $or: [{ googleId: profile.id }, { email: profile.email }],
    });

    if (!user) {
      user = new User({
        name: profile.name,
        email: profile.email,
        googleId: profile.id,
        profileImage: profile.photo,
        status: "pending",
        isEmailVerified: false,
        role: intendedRole,
      });

      if (MAIN_ADMIN_EMAILS.includes(profile.email.toLowerCase())) {
        user.isMainAdmin = true;
        user.status = "accepted";
        user.role = "admin";
      }

      await user.save();

      // Notify admin of new signup
      await transporter.sendMail({
        from: EMAIL_FROM,
        to: "hello@myhrsg.org",
        subject: "New myHRSG Registration",
        text: `New Google signup:\n\nEmail: ${user.email}\n`,
      }).catch(err => console.error("Admin alert error:", err));

    } else {
      const isMainAdmin = MAIN_ADMIN_EMAILS.includes(user.email.toLowerCase());
      // Existing user — Check for role consistency
      if (user.role !== intendedRole && !isMainAdmin) {
        throw new Error(`You are registered as ${user.role === 'admin' ? 'an admin' : 'a member'}. Please select "${user.role === 'admin' ? 'Admin' : 'Member'}" on the login page to sign in correctly.`);
      }

      if (isMainAdmin) {
        user.isMainAdmin = true;
        user.status = "accepted";
        user.role = "admin";
      }

      // Keep Google fields in sync
      if (!user.googleId) user.googleId = profile.id;
      if (profile.photo && !user.profileImage) user.profileImage = profile.photo;

      await user.save();
    }


    // Generate & save OTP (same flow for everyone)
    const otp = generateOTP();
    user.otp = otp;
    user.otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 min
    await user.save();

    // Email OTP
    await transporter.sendMail({
      from: EMAIL_FROM,
      to: user.email,
      subject: `${otp} is your myHRSG verification code`,
      text: `Hi ${user.name || "Member"},\n\nYour myHRSG verification code is: ${otp}\n\nThis code expires in 10 minutes.\n\nIf you did not request this, please ignore this email.\n\n– Team myHRSG\nhttps://www.myhrsg.org`,
      html: getOtpTemplate(user.name || "Member", otp),
      headers: {
        'List-Unsubscribe': '<mailto:hello@myhrsg.org?subject=unsubscribe>',
        'Precedence': 'bulk',
        'X-Mailer': 'myHRSG Mailer',
      },
    }).catch(err => console.error("OTP email error:", err));

    // Short-lived temp token → redirects to /verify-otp
    const tempToken = jwt.sign(
      { id: user._id, type: "verification" },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    const redirectUrl = process.env.CLIENT_URL || process.env.APP_URL;
    res.redirect(`${redirectUrl}/verify-otp?token=${tempToken}`);
  } catch (error) {
    console.error("googleCallback error:", error.message);
    const redirectUrl = process.env.CLIENT_URL || process.env.APP_URL;
    res.redirect(`${redirectUrl}/login?error=${encodeURIComponent(error.message)}`);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// Verify the 6-digit OTP and issue the final session JWT
// ─────────────────────────────────────────────────────────────────────────────
export const verifyOTP = async (req, res) => {
  try {
    const { otp, token } = req.body;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.type !== "verification") throw new Error("Invalid token type");

    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    if (user.otp !== otp || user.otpExpires < Date.now()) {
      return res.status(400).json({ error: "Invalid or expired OTP" });
    }

    // Clear OTP
    user.otp = undefined;
    user.otpExpires = undefined;
    user.isEmailVerified = true;

    if (MAIN_ADMIN_EMAILS.includes(user.email.toLowerCase())) {
      user.isMainAdmin = true;
      user.status = "accepted";
      user.role = "admin";
    }

    await user.save();

    // Issue final 1-day session token
    const finalToken = jwt.sign(
      { id: user._id, role: user.role, isMainAdmin: user.isMainAdmin || false },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );

    // Dynamic profile completeness check (same logic as getMe)
    const isProfileComplete = !!(
      user.profileComplete &&
      user.dob &&
      user.position &&
      user.company &&
      user.linkedin
    );

    res.json({
      token: finalToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        profileImage: user.profileImage,
        linkedinId:   user.linkedinId,
        googleId:     user.googleId,
        isLinkedIn:   !!user.linkedinId,
        isMainAdmin:  user.isMainAdmin || false,
        isProfileComplete,
        dob: user.dob,
        city: user.city,
        pincode: user.pincode,
        company: user.company,
        position: user.position,
        createdAt: user.createdAt,
        linkedin: user.linkedin,
      },
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// Resend a fresh OTP to the same email
// ─────────────────────────────────────────────────────────────────────────────
export const resendOTP = async (req, res) => {
  try {
    const { token } = req.body;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    const otp = generateOTP();
    user.otp = otp;
    user.otpExpires = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();

    await transporter.sendMail({
      from: EMAIL_FROM,
      to: user.email,
      subject: `${otp} is your myHRSG sign-in code`,
      text: `Hi ${user.name || "there"},\n\nWelcome back to myHRSG! Your new sign-in code is: ${otp}\n\nThis code expires in 10 minutes.\n\n– Team myHRSG\nhttps://www.myhrsg.org`,
      html: getOtpTemplate(user.name || "Member", otp),
      headers: {
        'X-Mailer': 'myHRSG Mailer',
        'X-Priority': '1',
      },
    });

    res.json({ message: "OTP resent successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// Manual Authentication Flow (Email + Details)
// ─────────────────────────────────────────────────────────────────────────────
export const manualAuth = async (req, res) => {
  try {
    const { email, role } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email is required." });
    }

    const intendedRole = role || "member";
    let user = await User.findOne({ email });

    if (!user) {
      user = new User({
        name: req.body.name || email.split("@")[0],
        email,
        linkedin: req.body.linkedin || "",
        status: "pending",
        isEmailVerified: false,
        role: intendedRole,
      });

      if (MAIN_ADMIN_EMAILS.includes(email.toLowerCase())) {
        user.isMainAdmin = true;
        user.status = "accepted";
        user.role = "admin";
      }

      await user.save();

      // Notify admin
      await transporter.sendMail({
        from: EMAIL_FROM,
        to: "hello@myhrsg.org",
        subject: "New myHRSG Registration",
        text: `New manual signup started:\n\nEmail: ${user.email}\nRole: ${user.role}\n`,
      }).catch(err => console.error("Admin alert error:", err));

    } else {
      const isMainAdmin = MAIN_ADMIN_EMAILS.includes(email.toLowerCase());
      // User exists, Check for role consistency
      if (user.role !== intendedRole && !isMainAdmin) {
        throw new Error(`You are registered as ${user.role === 'admin' ? 'an admin' : 'a member'}. Please select "${user.role === 'admin' ? 'Admin' : 'Member'}" on the login page to sign in correctly.`);
      }

      if (isMainAdmin) {
        user.isMainAdmin = true;
        user.status = "accepted";
        user.role = "admin";
      }
      try {
        await user.save();
      } catch (err) {
        console.error("Error updating manual user:", err);
        return res.status(500).json({ error: "Internal server error" });
      }
    }

    // Generate & save OTP
    const otp = generateOTP();
    user.otp = otp;
    user.otpExpires = new Date(Date.now() + 10 * 60 * 1000);
    try {
      await user.save();
    } catch (err) {
      console.error("Error saving OTP:", err);
      return res.status(500).json({ error: "Internal server error" });
    }

    // Email OTP
    await transporter.sendMail({
      from: EMAIL_FROM,
      to: user.email,
      subject: `${otp} is your myHRSG verification code`,
      text: `Hi ${user.name || "Member"},\n\nYour myHRSG verification code is: ${otp}\n\nThis code expires in 10 minutes.\n\nIf you did not request this, please ignore this email.\n\n– Team myHRSG\nhttps://www.myhrsg.org`,
      html: getOtpTemplate(user.name || "Member", otp),
      headers: {
        'List-Unsubscribe': '<mailto:hello@myhrsg.org?subject=unsubscribe>',
        'Precedence': 'bulk',
        'X-Mailer': 'myHRSG Mailer',
      },
    }).catch(err => console.error("OTP email error:", err));

    // Generate temp verification token
    const tempToken = jwt.sign(
      { id: user._id, type: "verification" },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    res.json({ token: tempToken });
  } catch (error) {
    console.error("manualAuth error:", error.message);
    res.status(500).json({ error: error.message });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// Complete Profile Phase (Step 3)
// ─────────────────────────────────────────────────────────────────────────────
export const completeProfile = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Access denied. No token provided." });
    }
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    const { name, city, pincode, company, linkedin, position, dob } = req.body;

    user.name = name || user.name;
    user.company = company || user.company;
    user.linkedin = linkedin || user.linkedin;
    user.city = city || user.city;
    user.pincode = pincode || user.pincode;
    user.position = position || user.position;
    if (dob) user.dob = new Date(dob);

    user.profileComplete = true;
    await user.save();

    res.json({
      message: "Profile completed",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        profileImage: user.profileImage,
        linkedinId:   user.linkedinId,
        googleId:     user.googleId,
        isLinkedIn:   !!user.linkedinId,
        isMainAdmin:  user.isMainAdmin || false,
        isProfileComplete: user.profileComplete,
        dob: user.dob,
        city: user.city,
        pincode: user.pincode,
        company: user.company,
        position: user.position,
        createdAt: user.createdAt,
        linkedin: user.linkedin,
      }
    });

  } catch (error) {
    console.error("completeProfile error:", error.message);
    res.status(500).json({ error: error.message });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = req.user;
    console.log(`[GetMe] User ${user.email} status is: ${user.status}`);

    // Dynamically check profile completeness — ensures existing members
    // who are missing new required fields (dob, position) get re-prompted
    const isProfileComplete = !!(
      user.profileComplete &&
      user.dob &&
      user.position &&
      user.company &&
      user.linkedin
    );

    // If the DB flag is out of sync, fix it gracefully
    if (user.profileComplete && !isProfileComplete) {
      try {
        user.profileComplete = false;
        await user.save();
        console.log(`[GetMe] Updated profileComplete status for ${user.email}`);
      } catch (saveErr) {
        console.error(`[GetMe] Background save failed for ${user.email}:`, saveErr.message);
        // Continue even if save fails — returning user data is more important
      }
    }

    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        profileImage: user.profileImage,
        linkedinId:   user.linkedinId,
        googleId:     user.googleId,
        isLinkedIn:   !!user.linkedinId,
        isMainAdmin:  user.isMainAdmin || false,
        isProfileComplete,
        dob: user.dob,
        city: user.city,
        pincode: user.pincode,
        company: user.company,
        position: user.position,
        createdAt: user.createdAt,
        linkedin: user.linkedin
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
