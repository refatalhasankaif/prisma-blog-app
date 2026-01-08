import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.APP_USER,
        pass: process.env.APP_PASS,
    },
});

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),
    trustedOrigins: [process.env.APP_URL!],
    user: {
        additionalFields: {
            role: {
                type: "string",
                defaultValue: "USER",
                required: false,
            },
            phone: {
                type: "string",
                required: false,
            },
            status: {
                type: "string",
                defaultValue: "ACTIVE",
                required: false,
            },
        },
    },
    emailAndPassword: {
        enabled: true,
        autoSignIn: false,
        requireEmailVerification: true,
    },
    emailVerification: {
        sendOnSignUp: true,
        autoSignInAfterVerification: true,
        sendVerificationEmail: async ({ user, url, token }, request) => {
            try {

                const VerificationUrl = `${process.env.APP_URL}/verify-email?token=${token}`

                const htmlTemplate = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verify Your Email</title>
</head>
<body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; margin: 20px 0; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
          <tr>
            <td style="padding: 40px; text-align: center;">
              <h1 style="color: #333333; margin-bottom: 10px;">Hello, ${user.name}!</h1>
              <p style="color: #555555; font-size: 16px; line-height: 1.5;">
                Thank you for signing up. To get started, please verify your email address by clicking the button below:
              </p>
              <a href="${VerificationUrl}" style="
                display: inline-block;
                padding: 15px 35px;
                margin: 25px 0;
                font-size: 16px;
                font-weight: bold;
                color: #ffffff;
                background-color: #007BFF;
                text-decoration: none;
                border-radius: 6px;
              ">Verify Email</a>
              <p style="color: #555555; font-size: 14px; line-height: 1.5;">
                If the button above does not work, copy and paste the link below into your web browser:
              </p>
              <p style="word-break: break-all;"><a href="${VerificationUrl}" style="color: #007BFF;">${VerificationUrl}</a></p>
              <hr style="border: none; border-top: 1px solid #eeeeee; margin: 30px 0;">
              <p style="color: #999999; font-size: 12px;">
                If you did not request this email, you can safely ignore it.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;
                const info = await transporter.sendMail({
                    from: 'Prisma Blog',
                    to: user.email,
                    subject: "Email Verification",
                    html: htmlTemplate,
                });

                console.log("Verification email sent", info.messageId);

            } catch (err) {
                console.log(err)
            }
        },
    },
    socialProviders: {
        google: {
            prompt: "select_account consent",
            accessType: "offline",
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,  
        },
    },
});
