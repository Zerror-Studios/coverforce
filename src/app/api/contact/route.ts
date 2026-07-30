import dotenv from "dotenv";
dotenv.config();
import { sheets_v4 } from "@googleapis/sheets";
import { GoogleAuth } from "google-auth-library";
import nodemailer from "nodemailer";
import { NextResponse } from "next/server";

const spreadsheetId = "1T-cBuTN17Z8ApTJwsFiMw9KMlY5j7hdUFl6LZ-d-47c";

interface ContactPayload {
  businessType: string[];
  problems: string;
  bookSize: string;
  fullName: string;
  phoneCode: string;
  countryCode: string;
  phone: string;
  email: string;
  jobTitle: string;
  companyName: string;
  heardAboutUs: string[];
  submittedAt: string;
}

function getAuth() {
  const clientEmail = "zerror-service-email@spartan-thunder-476511-r2.iam.gserviceaccount.com";
  const privateKey = "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCFq7veMKeJdcCn\nAbaXjT/Yn5JcOBTh4WR1bhCCUGaLOObem9kZ4AbCfeLRbow97WRNnGKwv+6Dm0xs\nmCZgJXpH6GAR1dkUYQfPLcXLnbWE7/bT5nHNlA/Zz2p9k6rcp2c8X9JgsSFyXsnd\nioBlNPA3vzQAjBtO5LFy7tKXk4Lyxwjh3MMtskHJBoiOMo8OJq6r2AnpDD3MBN/K\nJOhpcYD918FY15RJyOPWe6g4aZJqavOFE4U3bMIzDWiBgqsvuzZE9RTK9cWrS0pn\nI6P8HOqzV0wGhorTyiZBPOjcjCBT5hByT+wtBejD3x7IKM98ipIV7AKv0bN6MTHX\nFVsUiIt5AgMBAAECggEANLBHKqMh/rhX+lxeBSnLj08CyW/fp1OJHhKG1l7rtJf2\nxKtIrX7VG0e0ppm9FNHkdgUdD49v7BdETg/BHKfZJcvuRkl1OievBNaFfyeIe8B8\nmfTdScvBXbj4wEv7DuO7eRxKGAvp46OCTV2BE6OExmyLCmYvg274lRWXE+E0vg3t\nVaXmVhXjIQ8ykclEf1mT8rdbp2a7ZdaXChfq2eywADKXbsgzmzXhsfjScML6pVbt\nBzkoUyiewDOfkY3IE5jASwJWbt6l+EPzMRwrvJtJXDUFWqpQ+e0henPGJtL8EvX/\na5fWa8aCJVJ3eOAu0LHJIRmO9gVXzaZ75Opl9qf/0wKBgQC7Xjz8UV8fBV2isNX+\n/dAu0alxoywspEbMLc20ZsKvggyY3v2n7Rt7A5ENbTuQn5PB03Fb+WlLA16+9G8G\nSvAOosBspVXvRBFyKBVEOMy5qgfrD9SlantD7jQrl04KzlNJBcHbSnN9lPCHvPCQ\nfde1P6PRE6USQ56+pGl9NyUrCwKBgQC2ojqUvbDT5qxqKIpZXUsQtrTFwyD8BDrp\n/y7xwPlpXYXIKXcJmO4nBJwkpBIZ8yOOkaMd788w9LREyNNaCi5FT70E2looLm68\nGzVFt3sAyN8aVAuermoZDnMSlGg8vHWLshIuUlKecIPmqYzZzNmzoKCevjyn7BxH\nHUNK6K5WCwKBgAJmD3PPet9Dy1IU33h3OV4QExJAW4VqyPk+MN75Xc6vZIfkeuzW\nbT6i6g1484VDdbnKgi4CQGXUcjcRnAZBmVcmoD4D09jPT0Xd23/XFk/eLGHG/xrr\nBQ72krZoJnie8ZQCvduX1WirKnUiZxYCdmt8mBVKIhfcw8B/DFatCQ3HAoGBAJs6\noh4AaMaCvrLwSD8Si5XmJRod8vAhTE3NBoKWqabDxczOaY3vvSPOyERga75AqU0p\nPgJY7LrIklwQcYuLMa7ZymfQi2axqI8bdRkPjW2qTe6b1tCFoEoxvN7i4wIUkLgu\nn0Nd1zkxmvq3y67nbXY+paanPPjhN1u+ZI7L3DnnAoGAH1ZGXtmPWHKpsIgLIWpu\nVL0aJ3N2KxbV4kQ0sYoBThSxS1mrd93jIksk5xA3E2h+XdEjcsNHnlxwFjG+snIt\n4p4Gj2J6miAkoaXxAgCCW7s/8FD47bG6dKMIRX2vBUJqcWRG37Lql+KlFjIR8y8Y\nRd6D7dBgoifWynOd/eQpoLE=\n-----END PRIVATE KEY-----\n";

  if (!clientEmail || !privateKey) return null;

  return new GoogleAuth({
    credentials: { client_email: clientEmail, private_key: privateKey },
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
}

const isValidEmail = (value: string): boolean =>
  /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(value ?? "").trim());

const isValidName = (value: string): boolean =>
  /^[\p{L}][\p{L}\s'.-]{1,49}$/u.test(String(value ?? "").trim());

const isValidPhone = (phoneCode: string, phone: string): boolean => {
  const digits = String(phone ?? "").replace(/\D/g, "");
  if (digits.length < 7 || digits.length > 15) return false;
  const full = `${String(phoneCode ?? "").trim()}${digits}`;
  return /^\+\d{8,18}$/.test(full);
};

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));

    const payload: ContactPayload = {
      businessType: Array.isArray(body?.businessType) ? body.businessType.map(String) : [],
      problems: String(body?.problems ?? "").trim(),
      bookSize: String(body?.bookSize ?? "").trim(),
      fullName: String(body?.fullName ?? "").trim(),
      phoneCode: String(body?.phoneCode ?? "").trim(),
      countryCode: String(body?.countryCode ?? "").trim(),
      phone: String(body?.phone ?? "").trim(),
      email: String(body?.email ?? "").trim(),
      jobTitle: String(body?.jobTitle ?? "").trim(),
      companyName: String(body?.companyName ?? "").trim(),
      heardAboutUs: Array.isArray(body?.heardAboutUs)
        ? body.heardAboutUs.map(String)
        : [],
      submittedAt: String(body?.submittedAt ?? "").trim(),
    };

    const requiredFields: (keyof ContactPayload)[] = [
      "problems",
      "bookSize",
      "fullName",
      "phone",
      "email",
      "jobTitle",
      "companyName",
    ];

    const missingField = requiredFields.find((field) => !payload[field]);
    if (
      missingField ||
      payload.businessType.length === 0 ||
      payload.heardAboutUs.length === 0
    ) {
      return NextResponse.json({ error: "All required fields must be filled" }, { status: 400 });
    }

    if (payload.problems.length < 10) {
      return NextResponse.json(
        { error: "Please describe the problems in a few sentences" },
        { status: 400 },
      );
    }

    if (!isValidName(payload.fullName)) {
      return NextResponse.json({ error: "Please enter a valid name" }, { status: 400 });
    }

    if (!isValidEmail(payload.email)) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    if (!isValidPhone(payload.phoneCode, payload.phone)) {
      return NextResponse.json({ error: "Invalid phone number" }, { status: 400 });
    }

    if (payload.jobTitle.length < 2 || payload.companyName.length < 2) {
      return NextResponse.json(
        { error: "Please enter a valid job title and company name" },
        { status: 400 },
      );
    }

    if (!spreadsheetId) {
      return NextResponse.json({ error: "Contact spreadsheet ID missing" }, { status: 500 });
    }

    const auth = getAuth();
    if (!auth) {
      return NextResponse.json({ error: "Google credentials missing" }, { status: 500 });
    }

    // @googleapis/sheets bundles its own google-auth-library copy, whose types
    // don't structurally match the standalone google-auth-library package even
    // though they're compatible at runtime. Cast to bypass the duplicate-type clash.
    const sheets = new sheets_v4.Sheets({ auth: auth as unknown as sheets_v4.Options["auth"] });

    const kolkataTime = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
    const [datePart] = kolkataTime.split(",");
    const formattedDate = datePart.trim();

    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: "Sheet1!A:K",
      valueInputOption: "RAW",
      requestBody: {
        values: [
          [
            formattedDate,
            payload.fullName,
            "",
            payload.email,
            `${payload.phoneCode} ${payload.phone}`.trim(),
            payload.companyName,
            payload.jobTitle,
            payload.businessType.join(", "),
            payload.bookSize,
            payload.problems,
            payload.heardAboutUs.join(", "),
          ],
        ],
      },
    });

    const mailFrom = "hello@zerrorstudios.com";
    const mailPass = "byaqczanjvrarkan";
    const mailTo = "ayush.zerror@gmail.com";

    if (mailFrom && mailPass && mailTo) {
      const transport = nodemailer.createTransport({
        service: "gmail",
        auth: { user: mailFrom, pass: mailPass },
      });

      await transport.sendMail({
        from: mailFrom,
        to: [mailTo],
        subject: "New Contact Form Submission",
        html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Contact Submission</title>
        </head>
        <body style="margin:0;padding:0;font-family:'Segoe UI',Arial,sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr><td align="center" style="padding:0;">
            <table cellpadding="0" cellspacing="0"
              style="width:100%;max-width:560px;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e0ddd6;">

              <tr><td style="background:#121C49;padding:24px 20px 20px;">
                <h1 style="margin:0 0 4px;font-size:20px;font-weight:600;color:#ffffff;line-height:1.3;">
                  New contact form submission
                </h1>
                <p style="margin:0;font-size:11px;color:rgba(255,255,255,0.6);line-height:1.5;">
                  Someone reached out via the CoverForce contact form.
                </p>
              </td></tr>

              <tr><td style="padding:18px 20px 4px;">
                <p style="margin:0 0 12px;font-size:9px;font-weight:600;color:#888;letter-spacing:0.1em;text-transform:uppercase;">Contact info</p>

                <table width="100%" cellpadding="0" cellspacing="0" style="border-bottom:1px solid #f0ede8;padding-bottom:10px;margin-bottom:10px;">
                  <tr><td>
                    <p style="margin:0 0 2px;font-size:9px;color:#999;text-transform:uppercase;">Name</p>
                    <p style="margin:0;font-size:12px;color:#111;font-weight:500;">${payload.fullName}</p>
                  </td></tr>
                </table>

                <table width="100%" cellpadding="0" cellspacing="0" style="border-bottom:1px solid #f0ede8;padding-bottom:10px;margin-bottom:10px;">
                  <tr><td>
                    <p style="margin:0 0 2px;font-size:9px;color:#999;text-transform:uppercase;">Email</p>
                    <p style="margin:0;font-size:12px;color:#111;font-weight:500;">${payload.email}</p>
                  </td></tr>
                </table>

                <table width="100%" cellpadding="0" cellspacing="0" style="border-bottom:1px solid #f0ede8;padding-bottom:10px;margin-bottom:10px;">
                  <tr><td>
                    <p style="margin:0 0 2px;font-size:9px;color:#999;text-transform:uppercase;">Phone</p>
                    <p style="margin:0;font-size:12px;color:#111;font-weight:500;">${payload.phoneCode} ${payload.phone}</p>
                  </td></tr>
                </table>

                <table width="100%" cellpadding="0" cellspacing="0" style="border-bottom:1px solid #f0ede8;padding-bottom:10px;margin-bottom:10px;">
                  <tr><td>
                    <p style="margin:0 0 2px;font-size:9px;color:#999;text-transform:uppercase;">Company / Title</p>
                    <p style="margin:0;font-size:12px;color:#111;font-weight:500;">${payload.companyName} - ${payload.jobTitle}</p>
                  </td></tr>
                </table>

                <p style="margin:16px 0 12px;font-size:9px;font-weight:600;color:#888;letter-spacing:0.1em;text-transform:uppercase;">Business profile</p>

                <table width="100%" cellpadding="0" cellspacing="0" style="border-bottom:1px solid #f0ede8;padding-bottom:10px;margin-bottom:10px;">
                  <tr><td>
                    <p style="margin:0 0 2px;font-size:9px;color:#999;text-transform:uppercase;">Business type</p>
                    <p style="margin:0;font-size:12px;color:#111;font-weight:500;">${payload.businessType.join(", ")}</p>
                  </td></tr>
                </table>

                <table width="100%" cellpadding="0" cellspacing="0" style="border-bottom:1px solid #f0ede8;padding-bottom:10px;margin-bottom:10px;">
                  <tr><td>
                    <p style="margin:0 0 2px;font-size:9px;color:#999;text-transform:uppercase;">Book of business (GWP)</p>
                    <p style="margin:0;font-size:12px;color:#111;font-weight:500;">${payload.bookSize}</p>
                  </td></tr>
                </table>

                <table width="100%" cellpadding="0" cellspacing="0" style="border-bottom:1px solid #f0ede8;padding-bottom:10px;margin-bottom:10px;">
                  <tr><td>
                    <p style="margin:0 0 2px;font-size:9px;color:#999;text-transform:uppercase;">How they heard about us</p>
                    <p style="margin:0;font-size:12px;color:#111;font-weight:500;">${payload.heardAboutUs.join(", ")}</p>
                  </td></tr>
                </table>

                <p style="margin:16px 0 10px;font-size:9px;font-weight:600;color:#888;letter-spacing:0.1em;text-transform:uppercase;">What CoverForce would solve</p>
                <div style="background:#f7f6f2;border-radius:8px;padding:12px 14px;margin-bottom:14px;">
                  <p style="margin:0;font-size:12px;color:#444;line-height:1.6;">${payload.problems}</p>
                </div>

              </td></tr>

              <tr><td style="padding:12px 20px;border-top:1px solid #f0ede8;">
                <p style="margin:0;font-size:9px;color:#bbb;">Submitted ${formattedDate}</p>
              </td></tr>

            </table>
          </td></tr>
        </table>
        </body>
        </html>
        `,
      });
    }

    return NextResponse.json({ message: "Submitted" }, { status: 200 });
  } catch (error) {
    console.error("Contact form submission error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}