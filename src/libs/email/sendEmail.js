const transporter = require("../../configs/transporter.config");
const EMAIL_TEMPLATES = require("../../consts/email-templates.const");
const verificationEmailTemplate = require("./verification-email-template");
const resetPasswordEmailTemplate = require("./reset-password-email-template");

module.exports = async (emailTemplate, to, data) => {
    try {
        let content = { subject: "", html: "" };

        switch (emailTemplate) {
            case EMAIL_TEMPLATES.VERIFICATION_EMAIL:
                content = verificationEmailTemplate(data);
                break;
            case EMAIL_TEMPLATES.RESET_PASSWORD_EMAIL:
                content = resetPasswordEmailTemplate(data);
                break;
            default:
                content = { subject: "", html: "" };
        }

        await transporter.sendMail({
            from: process.env.EMAIL_FROM,
            to,
            subject: content.subject,
            html: content.html,
        });
    }
    catch (err) {
        const error = new Error(`Lỗi gửi email -- ${err.message}`);
        error.status = 500;
        throw error;
    }
};