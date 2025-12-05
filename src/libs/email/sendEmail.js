const transporter = require("../../configs/transporter.config");
const emailTemplatesConst = require("../../consts/email-templates.const");
const verificationEmailTemplate = require("./verification-email-template");
const resetPasswordEmailTemplate = require("./reset-password-email-template");

module.exports = async (emailTemplate, to, data) => {
    try {
        let content = { subject: "", html: "" };

        switch (emailTemplate) {
            case emailTemplatesConst.VERIFICATION_EMAIL:
                content = verificationEmailTemplate(data);
                break;
            case emailTemplatesConst.RESET_PASSWORD_EMAIL:
                content = resetPasswordEmailTemplate(data);
                break;
            default:
                content = { subject: "", html: "" };
        }

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to,
            subject: content.subject,
            html: content.html,
        });
    }
    catch (error) {
        console.error(error);
        throw new Error("Lỗi gửi email!");
    }
};