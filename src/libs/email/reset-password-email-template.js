module.exports = (data) => {
    const FE = process.env.FE;

    return {
        subject: "Minimal Nest - Đặt lại mật khẩu",
        html: `
            <main style="font-family: Google Sans, Roboto, RobotoDraft, Helvetica, Arial, sans-serif;">
                <div style="margin: 0 auto; width: 100%; max-width: 600px;">
                    <div style="padding: 20px; border-top-left-radius: 10px; border-top-right-radius: 10px; background: #12778A; color: white;">
                        <h1 style="margin: 0px; margin-bottom: 5px; font-size: 20px; text-align: center;">Minimal Nest</h1>
                        <p style="margin: 0px; font-size: 13px; text-align: center;">Đặt lại mật khẩu</p>
                    </div>

                    <div style="padding: 30px; border: 1px #e0e0e0 solid; border-top: none; border-bottom: none; text-align: center;">
                        <h2 class="sub-heading" style="margin: 0px; margin-bottom: 10px; color: #3b3b3b; font-size: 18px;">Xin chào ${data.username}!</h2>

                        <p class="desc" style="margin: 0px; margin-bottom: 30px; color: #5a5a5a; font-size: 14px; line-height: 20px;">Vui lòng nhấp vào nút bên dưới để tiến hành quá trình đặt lại mật khẩu của bạn.</p>

                        <a href="${FE}/reset-password?token=${data.authToken}" target="_blank" style="display: inline-block; padding: 15px 25px; font-size: 15px; color: #ffffff; background-color: #12778A; border-radius: 5px; text-decoration: none; font-weight: 600;">
                            Đặt lại mật khẩu
                        </a>
                    </div>

                    <div style="background-color: #f8f9fa; color: #6c757d; padding: 15px; font-size: 12px; text-align: center; border: 1px solid #e0e0e0; border-bottom-left-radius: 10px; border-bottom-right-radius: 10px;">
                        <p style="margin: 0;">Bạn có thể bỏ qua email này nếu đây không phải email do bạn gửi.</p>
                        <p style="margin: 5px 0 0;">&copy; ${new Date().getFullYear()} Minimal Nest. All rights reserved.</p>
                    </div>
                </div>
            </main>
        `
    };
};