import mongoose from "mongoose";
import { User } from "../models/User.js";
import { transporter, EMAIL_FROM } from "../config/email.js";

export const getMembers = async (req, res) => {
  try {
    const { city, pincode, company, role, status, search } = req.query;
    const query = {};


    if (role) {
      query.role = role;
    } else if (!req.user?.isMainAdmin) {
      query.role = "member";
    }

    if (status) query.status = status;

    if (search) {
      query.$or = [
        { name: new RegExp(search, "i") },
        { email: new RegExp(search, "i") },
        { company: new RegExp(search, "i") }
      ];
    }

    if (city) query.city = new RegExp(city, "i");
    if (pincode) query.pincode = pincode;
    if (company) query.company = new RegExp(company, "i");

    const members = await User.find(query).sort({ createdAt: -1 });
    res.json(members);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateMemberStatus = async (req, res) => {
  try {
    const { status, reason } = req.body;
    const normalizedStatus = status.toLowerCase();

    // Diagnostic logs 
    console.log(`[StatusUpdate] Target ID: ${req.params.id}, New Status: ${normalizedStatus}, Action by: ${req.user.email}`);

    // Fetch target user to check role 
    const targetUser = await User.findById(req.params.id);
    if (!targetUser) {
      console.log(`[StatusUpdate] Error: Target user ${req.params.id} not found.`);
      return res.status(404).json({ error: "User not found" });
    }

    // Role-based safeguard: Secondary admins can only update "members"
    if (!req.user.isMainAdmin && targetUser.role !== 'member') {
      console.log(`[StatusUpdate] Forbidden: Secondary admin ${req.user.email} tried to update Admin ${targetUser.email}.`);
      return res.status(403).json({ error: "Secondary admins can only manage members." });
    }

    // Perform update
    targetUser.status = normalizedStatus;
    const member = await targetUser.save();

    console.log(`[StatusUpdate] Success: ${member.email} is now ${member.status}`);

    if (member) {
      let subject = "";
      let html = "";

      const getHtmlTemplate = (title, message) => `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; border: 1px solid #eaebec; border-radius: 12px; background-color: #ffffff;">
          <div style="text-align: center; padding-bottom: 25px; border-bottom: 1px solid #eaebec;">
            <h1 style="color: #0A66C2; margin: 0; font-size: 28px; font-weight: 800; letter-spacing: -1px;">myHRSG</h1>
            <p style="color: #64748b; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 2.5px; margin-top: 5px;">${title}</p>
          </div>
          <div style="padding: 35px 10px;">
            <h2 style="font-size: 20px; color: #0f172a; margin-bottom: 15px;">Hello ${member.name},</h2>
            <div style="font-size: 15px; color: #475569; line-height: 1.6;">${message}</div>
          </div>
          <div style="text-align: center; padding-top: 25px; border-top: 1px solid #eaebec; color: #94a3b8; font-size: 12px; font-weight: 500;">
            &copy; ${new Date().getFullYear()} myHRSG. All rights reserved.<br/>Elevating HR Professionals
          </div>
        </div>
      `;

      if (normalizedStatus === "accepted") {
        subject = "Welcome to myHRSG - Membership Approved";
        const message = `
          Your ${member.role === 'admin' ? 'admin privileges' : 'membership'} for myHRSG has been officially Approved. Welcome to our community!
          <br /><br />
          You can now explore the platform, connect with other members, and access exclusive resources.
          <br /><br />
          <div style="text-align: center; margin: 30px 0;">
            <a href="https://www.myhrsg.org/login" style="background-color: #0A66C2; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 14px; display: inline-block;">Login to Dashboard</a>
          </div>
        `;
        html = getHtmlTemplate("Account Approved", message);
      } else if (normalizedStatus === "rejected") {
        subject = "myHRSG - Application Update";
        const message = `
          Thank you for your interest in myHRSG. After careful review, we are unable to approve your application at this time.
          <br /><br />
          <strong>Reason:</strong> ${reason || "Does not meet current membership criteria."}
          <br /><br />
          If you have further questions, please feel free to reach out to our team.
        `;
        html = getHtmlTemplate("Application Update", message);
      }

      if (subject) {
        const mailOptions = {
          from: EMAIL_FROM,
          to: member.email,
          subject,
          html
        };
        await transporter.sendMail(mailOptions).catch(err => console.error("Email error:", err));
      }
    }

    res.json(member);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
export const getAdminStats = async (req, res) => {
  try {
    const acceptedQuery = { status: "accepted", role: "member" };
    console.log(`[AdminStats] Fetching stats in parallel...`);

    const [cityStats, pincodeStats, companyStats, totalMembers] = await Promise.all([
      User.aggregate([
        { $match: acceptedQuery },
        { $group: { _id: "$city", count: { $sum: 1 } } },
        { $project: { name: "$_id", value: "$count", _id: 0 } },
        { $sort: { value: -1 } }
      ]),
      User.aggregate([
        { $match: acceptedQuery },
        { $group: { _id: "$pincode", count: { $sum: 1 } } },
        { $project: { name: "$_id", value: "$count", _id: 0 } },
        { $sort: { value: -1 } }
      ]),
      User.aggregate([
        { $match: acceptedQuery },
        { $group: { _id: "$company", count: { $sum: 1 } } },
        { $project: { name: "$_id", value: "$count", _id: 0 } },
        { $sort: { value: -1 } },
        { $limit: 10 }
      ]),
      User.countDocuments(acceptedQuery)
    ]);

    console.log(`[AdminStats] Parallel fetch success. Total: ${totalMembers}`);
    res.json({ cityStats, pincodeStats, companyStats, totalMembers });
  } catch (error) {
    console.error("[AdminStats] Error:", error.message);
    res.status(500).json({ error: error.message });
  }
};

export const promoteAdmin = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    // Set to Main Admin status
    user.isMainAdmin = true;
    user.role = "admin";
    user.status = "accepted";
    await user.save();

    // Send promotion email
    const mailOptions = {
      from: EMAIL_FROM,
      to: user.email,
      subject: "Promotion: myHRSG Main Admin Privileges",
      html: `
          <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
            <h2 style="color: #0A66C2;">Privileges Updated</h2>
            <p>Hello ${user.name},</p>
            <p>We are pleased to inform you that you have been promoted to <strong>Main Admin</strong> at myHRSG. You now have full administrative control over the platform, including member management and chapter updates.</p>
            <br />
            <a href="https://www.myhrsg.org/login" style="background-color: #0A66C2; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Go to Admin Dashboard</a>
          </div>
        `
    };
    await transporter.sendMail(mailOptions).catch(err => console.error("Promotion email error:", err));

    res.json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteMember = async (req, res) => {
  try {
    const { reason } = req.query;
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    // Send revocation email before deleting
    const mailOptions = {
      from: EMAIL_FROM,
      to: user.email,
      subject: "myHRSG Membership Update",
      html: `
          <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
            <h2 style="color: #e11d48;">Membership Revoked</h2>
            <p>Hello ${user.name},</p>
            <p>We regret to inform you that your membership access to myHRSG has been revoked and your account has been removed from our database.</p>
            <p><strong>Reason provided:</strong> ${reason || "Account no longer meets community standards or criteria."}</p>
            <p>If you believe this was an error, please reach out to our team.</p>
          </div>
        `
    };

    await transporter.sendMail(mailOptions);
    await User.findByIdAndDelete(req.params.id);

    res.json({ success: true, message: "Member removed and deleted." });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const undoMemberStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    user.status = "pending";
    await user.save();

    res.json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    if (!["member", "admin"].includes(role)) {
      return res.status(400).json({ error: "Invalid role. Must be 'member' or 'admin'." });
    }

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    // Safeguard: Don't allow changing role if they are a Main Admin unless specifically handled
    // (Usually Main Admins stay Main Admins)
    if (user.isMainAdmin) {
      return res.status(403).json({ error: "Cannot change role of a Main Admin." });
    }

    user.role = role;
    await user.save();

    res.json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const sendMassMail = async (req, res) => {
  try {
    const { subject, message } = req.body;
    if (!subject || !message) {
      return res.status(400).json({ error: "Subject and message are required." });
    }
    
    const acceptedMembers = await User.find({ status: "accepted" }).select("email");
    const emails = acceptedMembers.map(m => m.email).filter(e => e);
    
    if (emails.length === 0) {
      return res.status(404).json({ error: "No accepted members found." });
    }
    
    // Convert newlines to <br/> tags
    const formattedMessage = message.replace(/\n/g, '<br />');

    const htmlTemplate = `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; border: 1px solid #eaebec; border-radius: 12px; background-color: #ffffff;">
        <div style="text-align: center; padding-bottom: 25px; border-bottom: 1px solid #eaebec;">
          <h1 style="color: #0A66C2; margin: 0; font-size: 28px; font-weight: 800; letter-spacing: -1px;">myHRSG</h1>
          <p style="color: #64748b; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 2.5px; margin-top: 5px;">Mass Communication</p>
        </div>
        <div style="padding: 35px 10px;">
          <h2 style="font-size: 20px; color: #0f172a; margin-bottom: 15px;">Hello Members,</h2>
          <div style="font-size: 15px; color: #475569; line-height: 1.6;">${formattedMessage}</div>
        </div>
        <div style="text-align: center; padding-top: 25px; border-top: 1px solid #eaebec; color: #94a3b8; font-size: 12px; font-weight: 500;">
          &copy; ${new Date().getFullYear()} myHRSG. All rights reserved.<br/>Elevating HR Professionals
        </div>
      </div>
    `;

    const sendPromises = emails.map(email => {
      const mailOptions = {
        from: EMAIL_FROM,
        to: email,
        subject,
        html: htmlTemplate
      };
      return transporter.sendMail(mailOptions).catch(err => {
        console.error(`[MassMail] Failed to send to ${email}:`, err.message);
      });
    });
    
    await Promise.all(sendPromises);
    
    res.json({ success: true, message: `Mass mail sent to ${emails.length} members.` });
  } catch (error) {
    console.error("[MassMail] Error:", error.message);
    res.status(500).json({ error: error.message });
  }
};

