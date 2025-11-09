const { MAIL_ID } = process.env;

export const accountVerificationMail = (to, token) => ({
  from: MAIL_ID,
  to,
  subject: "Verify Your Account - OTP Inside",
  text: `Welcome to Lekha!

Your OTP for account verification is: ${token}

If you didn't request this, simply ignore this mail.`,
  html: `
    <p>Welcome to <strong>Lekha</strong> 🚀</p>
    <p>Your OTP for account (${to}) verification is:</p>
    <h2 style="margin: 10px 0; font-size: 24px;">${token}</h2>
    <p>If you didn't request this, please ignore this email.</p>
  `
});

export const adminPinSetupMail = (to, token) => ({
  from: MAIL_ID,
  to,
  subject: "Admin PIN Setup - OTP Inside",
  text: `${to} has requested to set up or reset Admin PIN.
The OTP for Admin PIN setup is: ${token}

If you didn't request this, simply ignore this mail.`,
  html: `
    <p>${to} has requested to set up or reset <strong>Admin PIN</strong>.</p>
    <p>The OTP for Admin PIN setup is:</p>
    <h2 style="margin: 10px 0; font-size: 24px;">${token}</h2>
    <p>If you didn't request this, please ignore this email.</p>
  `
});