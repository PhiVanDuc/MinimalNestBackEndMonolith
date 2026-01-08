const accountRepository = require("./account.repository");
const formatFilter = require("../../utils/format-filter");
const throwHttpError = require("../../utils/throw-http-error");
const formatOutputPagination = require("../../utils/format-output-pagination");

module.exports = {
    getAccounts: async (data) => {
        const options = {
            attributes: ["id", "username", "email", "rank", "role", "provider"],
            order: [["updatedAt", "DESC"]]
        }

        const page = data.page;
        const limit = data.limit;
        const filter = formatFilter(data, ["username", "rank"]);

        const { count, rows } = await accountRepository.paginateAccounts({ page, limit, filter, options });
        return formatOutputPagination({ rows: { accounts: rows }, page, count, limit });
    },

    updateAccountRole: async (data) => {
        const account = await accountRepository.findById({
            id: data.id,
            options: { attributes: ["id"] }
        });

        if (!account) throwHttpError(404, "Không tìm thấy tài khoản!");

        await accountRepository.update({
            id: data.id,
            data: { role: data.role }
        });
    }
}