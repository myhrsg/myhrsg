import { transporter } from "../config/email.js";

const getPartnerEmailTemplate = (data) => {
    const { name, email, phone, designation, company, city, background } = data;
    const timestamp = new Date().toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata",
        dateStyle: "long",
        timeStyle: "short",
    });

    return `
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>New Partner Inquiry</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f1f5f9; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; -webkit-font-smoothing: antialiased;">

    <!-- Outer Wrapper -->
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #f1f5f9;">
        <tr>
            <td align="center" style="padding: 40px 16px;">

                <!-- Main Container -->
                <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; width: 100%; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);">

                    <!-- Header -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #0051A1 100%); padding: 48px 40px 44px; text-align: center;">
                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td align="center" style="padding-bottom: 16px;">
                                        <table role="presentation" cellpadding="0" cellspacing="0">
                                            <tr>
                                                <td style="width: 56px; height: 56px; background-color: rgba(255,255,255,0.15); border-radius: 16px; text-align: center; vertical-align: middle;">
                                                    <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiNmZmZmZmYiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48cmVjdCB3aWR0aD0iMjAiIGhlaWdodD0iMTQiIHg9IjIiIHk9IjciIHJ4PSIyIiByeT0iMiIvPjxwYXRoIGQ9Ik0xNiAyMVY1YTIgMiAwIDAgMC0yLTJoLTRhMiAyIDAgMCAwLTIgMnYxNiIvPjwvc3ZnPg==" width="24" height="24" alt="Partner" style="display: block; margin: 0 auto; outline: none;" border="0" />
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                                <tr>
                                    <td align="center" style="color: #ffffff; font-size: 26px; font-weight: 800; letter-spacing: -0.5px; line-height: 1.2; padding-bottom: 8px;">
                                        New Partner Inquiry
                                    </td>
                                </tr>
                                <tr>
                                    <td align="center" style="color: rgba(255,255,255,0.6); font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 3px;">
                                        myHRSG Platform
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- Timestamp Badge -->
                    <tr>
                        <td align="center" style="padding: 0;">
                            <table role="presentation" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td style="background-color: #0051A1; color: #ffffff; font-size: 11px; font-weight: 700; letter-spacing: 1px; padding: 8px 20px; border-radius: 0 0 10px 10px; text-transform: uppercase;">
                                        ${timestamp}
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- Body Content -->
                    <tr>
                        <td style="padding: 40px 40px 32px;">

                            <!-- Applicant Profile Card -->
                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #f8fafc 0%, #eef2ff 100%); border-radius: 16px; border: 1px solid #e2e8f0; margin-bottom: 24px;">
                                <tr>
                                    <td style="padding: 28px;">
                                        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                                            <!-- Name & Company Header -->
                                            <tr>
                                                <td style="padding-bottom: 20px; border-bottom: 1px solid #e2e8f0;">
                                                    <table role="presentation" cellpadding="0" cellspacing="0">
                                                        <tr>
                                                            <td style="width: 52px; height: 52px; background: linear-gradient(135deg, #0051A1, #0A66C2); border-radius: 14px; text-align: center; vertical-align: middle; color: #ffffff; font-size: 20px; font-weight: 800;">
                                                                ${name.charAt(0).toUpperCase()}
                                                            </td>
                                                            <td style="padding-left: 16px; vertical-align: middle;">
                                                                <div style="font-size: 20px; font-weight: 800; color: #0f172a; line-height: 1.2;">${name}</div>
                                                                <div style="font-size: 13px; color: #64748b; font-weight: 600; margin-top: 3px;">${designation ? designation + ' • ' : ''}${company || 'Company not specified'}</div>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </td>
                                            </tr>

                                            <!-- Contact Details - 2 Column -->
                                            <tr>
                                                <td style="padding-top: 18px;">
                                                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                                                        <tr>
                                                            <td width="50%" style="vertical-align: top; padding-right: 12px;">
                                                                <div style="font-size: 10px; font-weight: 800; color: #94a3b8; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 6px;">Email</div>
                                                                <div style="font-size: 14px; font-weight: 700; color: #0051A1; word-break: break-all;">
                                                                    <a href="mailto:${email}" style="color: #0051A1; text-decoration: none;">${email}</a>
                                                                </div>
                                                            </td>
                                                            <td width="50%" style="vertical-align: top; padding-left: 12px;">
                                                                <div style="font-size: 10px; font-weight: 800; color: #94a3b8; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 6px;">Phone</div>
                                                                <div style="font-size: 14px; font-weight: 700; color: #0f172a;">
                                                                    ${phone ? `<a href="tel:${phone}" style="color: #0f172a; text-decoration: none;">${phone}</a>` : '<span style="color: #94a3b8; font-style: italic;">Not provided</span>'}
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </td>
                                            </tr>

                                            <!-- Company & City Row -->
                                            <tr>
                                                <td style="padding-top: 18px;">
                                                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                                                        <tr>
                                                            <td width="50%" style="vertical-align: top; padding-right: 12px;">
                                                                <div style="font-size: 10px; font-weight: 800; color: #94a3b8; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 6px;">Company</div>
                                                                <div style="font-size: 14px; font-weight: 700; color: #0f172a;">${company || '<span style="color: #94a3b8; font-style: italic;">Not specified</span>'}</div>
                                                            </td>
                                                            <td width="50%" style="vertical-align: top; padding-left: 12px;">
                                                                <div style="font-size: 10px; font-weight: 800; color: #94a3b8; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 6px;">City</div>
                                                                <div style="font-size: 14px; font-weight: 700; color: #0f172a;">${city || '<span style="color: #94a3b8; font-style: italic;">Not specified</span>'}</div>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>

                            <!-- Professional Background -->
                            ${background ? `
                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 24px;">
                                <tr>
                                    <td>
                                        <div style="font-size: 10px; font-weight: 800; color: #94a3b8; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 12px;">Professional Background</div>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="background-color: #f8fafc; border-left: 4px solid #0051A1; border-radius: 0 12px 12px 0; padding: 24px 28px;">
                                        <div style="font-size: 15px; color: #334155; line-height: 1.8; font-weight: 500;">
                                            ${background.replace(/\n/g, '<br>')}
                                        </div>
                                    </td>
                                </tr>
                            </table>
                            ` : ''}

                        </td>
                    </tr>

                    <!-- Reply CTA -->
                    <tr>
                        <td style="padding: 0 40px 36px;" align="center">
                            <table role="presentation" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td style="background: linear-gradient(135deg, #0051A1, #0A66C2); border-radius: 12px; text-align: center;">
                                        <a href="mailto:${email}" style="display: inline-flex; align-items: center; justify-content: center; padding: 16px 40px; color: #ffffff; font-size: 14px; font-weight: 800; text-decoration: none; text-transform: uppercase; letter-spacing: 1.5px;">
                                            Reply to ${name.split(' ')[0]}
                                        </a>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- Divider -->
                    <tr>
                        <td style="padding: 0 40px;">
                            <div style="height: 1px; background: linear-gradient(to right, transparent, #e2e8f0, transparent);"></div>
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style="padding: 30px 40px; text-align: center;">
                            <div style="font-size: 13px; font-weight: 700; color: #0f172a; margin-bottom: 4px;">myHRSG</div>
                            <div style="font-size: 12px; color: #94a3b8; font-weight: 500;">Connecting HR Professionals Globally</div>
                            <div style="font-size: 11px; color: #cbd5e1; margin-top: 12px;">&copy; ${new Date().getFullYear()} myHRSG. All rights reserved.</div>
                        </td>
                    </tr>

                </table>

            </td>
        </tr>
    </table>

</body>
</html>
`;
};

export const createPartnerInquiry = async (req, res) => {
    try {
        const { name, email, phone, designation, company, city, background } = req.body;

        if (!name || !email || !company) {
            return res.status(400).json({ error: "Name, email, and company are required." });
        }

        const mailOptions = {
            from: `"${name} via myHRSG" <${process.env.EMAIL_USER}>`,
            to: "myhrsg0@gmail.com",
            replyTo: email,
            subject: `New Partner Inquiry from ${name} — ${company}`,
            html: getPartnerEmailTemplate({ name, email, phone, designation, company, city, background }),
        };

        await transporter.sendMail(mailOptions);
        res.json({ message: "Your partnership inquiry has been submitted successfully. Our team will be in touch shortly!" });
    } catch (error) {
        console.error("Partner inquiry email error:", error);
        res.status(500).json({ error: "Failed to send inquiry. Please try again later." });
    }
};
