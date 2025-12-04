const transporter = require("../../configs/transporter.config");
const verificationEmailTokenTemplate = require("./verification-email-token-template");

const sendEmail = async (template, to, options) => {
    try {
        let content = { subject: "", html: "" };

        switch (template) {
            case "verificationEmailToken":
                content = verificationEmailTokenTemplate(options.username, options.verificationEmailToken);
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
}

module.exports = sendEmail;