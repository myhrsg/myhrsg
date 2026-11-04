import { User } from "../models/User.js";
import { transporter, EMAIL_FROM } from "../config/email.js";

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────
const getOrdinalSuffix = (n) => {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
};

const calculateAge = (dob) => {
  const today = new Date();
  const birth = new Date(dob);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
};

// ─────────────────────────────────────────────────────────────────────────────
// Birthday Email Template (with age)
// ─────────────────────────────────────────────────────────────────────────────
const getBirthdayTemplate = (name, age) => {
  const ageText = age ? `${getOrdinalSuffix(age)} ` : "";

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background-color: #f4f7fa; -webkit-text-size-adjust: 100%;">
  <div style="padding: 40px 10px; background-color: #f1f4f8;">
    <div style="width: 100%; max-width: 520px; margin: 0 auto; border-radius: 40px; background-color: #ffffff; box-shadow: 0 30px 60px -12px rgba(50, 50, 93, 0.1), 0 18px 36px -18px rgba(0, 0, 0, 0.1); overflow: hidden;">
      
      <!-- Top accent gradient -->
      <div style="height: 6px; background: linear-gradient(90deg, #f59e0b, #ef4444, #ec4899, #8b5cf6, #3b82f6);"></div>

      <div style="padding: 50px 35px;">
        <!-- Celebration Icon -->
        <div style="text-align: center; margin-bottom: 30px;">
          <div style="display: inline-block; font-size: 64px; line-height: 1;">🎂</div>
        </div>

        <!-- Greeting -->
        <div style="text-align: center; margin-bottom: 35px;">
          <h1 style="font-size: 30px; font-weight: 900; color: #0f172a; margin: 0 0 8px 0; letter-spacing: -1.5px; line-height: 1.2;">Happy Birthday! 🎉</h1>
          <p style="font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 3px; color: #94a3b8; margin: 0;">From the myHRSG Family</p>
        </div>

        <!-- Message -->
        <div style="background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%); border-radius: 24px; padding: 30px; margin-bottom: 30px; border: 1px solid #fde68a;">
          <p style="font-size: 16px; color: #92400e; line-height: 1.8; margin: 0; text-align: center; font-weight: 500;">
            On this special day, we want you to know how much we value you as a part of the <strong style="color: #78350f;">myHRSG community</strong>. Your dedication to HR excellence inspires us all.
          </p>
        </div>

        <!-- Wishes -->
        <div style="text-align: center; margin-bottom: 35px;">
          <p style="font-size: 15px; color: #475569; line-height: 1.8; margin: 0 0 20px 0;">
            Wishing you a wonderful year ahead filled with success, growth, and exciting new opportunities in your HR journey. 🌟
          </p>
          <p style="font-size: 15px; color: #475569; line-height: 1.8; margin: 0;">
            May this birthday bring you joy and all the things you love!
          </p>
        </div>

        <!-- Decorative divider -->
        <div style="text-align: center; margin: 30px 0;">
          <span style="display: inline-block; font-size: 24px; letter-spacing: 8px;">🎈🎁🥳🎊🎈</span>
        </div>

        <!-- CTA -->
        <div style="text-align: center; margin-bottom: 10px;">
          <a href="https://www.myhrsg.org" style="display: inline-block; background: linear-gradient(135deg, #0A66C2 0%, #084e96 100%); color: #ffffff; padding: 16px 36px; border-radius: 16px; text-decoration: none; font-weight: 800; font-size: 13px; text-transform: uppercase; letter-spacing: 2px; box-shadow: 0 10px 25px rgba(10, 102, 194, 0.25);">
            Visit myHRSG
          </a>
        </div>
      </div>

      <!-- Footer -->
      <div style="background-color: #f8fafc; padding: 25px 35px; text-align: center; border-top: 1px solid #f1f5f9;">
        <div style="display: inline-block; padding: 8px 20px; background: linear-gradient(135deg, #0A66C2 0%, #084e96 100%); border-radius: 12px; margin-bottom: 12px;">
          <span style="color: #ffffff; font-size: 18px; font-weight: 900; letter-spacing: -0.5px;">myHRSG</span>
        </div>
        <p style="color: #94a3b8; font-size: 11px; font-weight: 600; margin: 8px 0 0 0; letter-spacing: 0.5px;">
          Stronger Relationships &bull; Stronger Communities
        </p>
        <p style="color: #cbd5e1; font-size: 10px; margin: 8px 0 0 0;">
          &copy; ${new Date().getFullYear()} myHRSG. All rights reserved.
        </p>
      </div>

    </div>
  </div>
</body>
</html>
`;
};

// ─────────────────────────────────────────────────────────────────────────────
// Check for today's birthdays and send wishes
// ─────────────────────────────────────────────────────────────────────────────
export const sendBirthdayWishes = async (req, res) => {
  try {
    // Verify cron secret to prevent unauthorized triggers
    const authHeader = req.headers["authorization"];
    const expectedHeader = `Bearer ${process.env.CRON_SECRET}`;
    
    if (authHeader !== expectedHeader) {
      console.warn(`[Birthday] Unauthorized access attempt. Received: ${authHeader?.substring(0, 15)}...`);
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Get target date in IST
    let now = new Date();
    
    // ALLOW MANUAL DATE OVERRIDE FOR TESTING (e.g. ?date=2026-05-04)
    if (req.query.date) {
      now = new Date(req.query.date);
      console.log(`[Birthday] Manual date override detected: ${req.query.date}`);
    }

    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: 'Asia/Kolkata',
      year: 'numeric',
      month: 'numeric',
      day: 'numeric'
    });
    
    const parts = formatter.formatToParts(now);
    const todayMonth = parseInt(parts.find(p => p.type === 'month').value);
    const todayDay = parseInt(parts.find(p => p.type === 'day').value);

    console.log(`[Birthday] Checking for birthdays on ${todayMonth}/${todayDay} (IST)`);

    // Find all accepted members whose birthday is today (match month and day in IST)
    const birthdayUsers = await User.aggregate([
      {
        $match: {
          dob: { $exists: true, $ne: null },
          status: "accepted",
        },
      },
      {
        $addFields: {
          // Explicitly use Asia/Kolkata timezone to avoid day-shifts (e.g. 00:00Z becoming 18:30 previous day)
          birthMonth: { $month: { date: "$dob", timezone: "Asia/Kolkata" } },
          birthDay: { $dayOfMonth: { date: "$dob", timezone: "Asia/Kolkata" } },
        },
      },
      {
        $match: {
          birthMonth: todayMonth,
          birthDay: todayDay,
        },
      },
    ]);

    console.log(`[Birthday] Found ${birthdayUsers.length} birthday(s) today (${todayMonth}/${todayDay})`);

    let sent = 0;
    let failed = 0;

    for (const user of birthdayUsers) {
      try {
        const firstName = user.name?.split(" ")[0] || "Member";
        const age = calculateAge(user.dob);
        const ageText = age ? `${getOrdinalSuffix(age)} ` : "";

        await transporter.sendMail({
          from: EMAIL_FROM,
          to: user.email,
          subject: `🎂 Happy Birthday! — From the myHRSG Family`,
          text: `Happy Birthday!\n\nOn this special day, we want you to know how much we value you as a part of the myHRSG community. Your dedication to HR excellence inspires us all.\n\nWishing you a wonderful year ahead filled with success, growth, and exciting new opportunities.\n\nWarm wishes,\nTeam myHRSG\nhttps://www.myhrsg.org`,
          html: getBirthdayTemplate(firstName, age),
          headers: {
            "X-Mailer": "myHRSG Mailer",
            "X-Priority": "3",
          },
        });

        sent++;
        console.log(`[Birthday] ✅ Sent to ${user.email} (age ${age})`);
      } catch (emailErr) {
        failed++;
        console.error(`[Birthday] ❌ Failed for ${user.email}:`, emailErr.message);
      }
    }

    res.json({
      success: true,
      date: `${todayMonth}/${todayDay}`,
      found: birthdayUsers.length,
      sent,
      failed,
    });
  } catch (error) {
    console.error("[Birthday] Cron error:", error.message);
    res.status(500).json({ error: error.message });
  }
};
