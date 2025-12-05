const transporter = require("../../configs/transporter.config");
const verificationEmailTemplate = require("./verification-email-template");
const resetPasswordEmailTemplate = require("./reset-password-email-template");

module.exports = async (emailTemplate, to, data) => {
    try {
        let content = { subject: "", html: "" };

        switch (emailTemplate) {
            case "verificationEmail":
                content = verificationEmailTemplate(data);
                break;
            case "resetPasswordEmail":
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