const accountRepository = require("./account.repository");
const formatFilter = require("../../utils/format-filter");
const throwHttpError = require("../../utils/throw-http-error");
const formatReturnDataPagination = require("../../utils/format-return-data-pagination");

module.exports = {
    getAccounts: async (data) => {
        const options = {
            attributes: ["id", "username", "email", "rank", "role", "provider"],
            order: [["updated_at", "DESC"]]
        }

        const page = Number(data.page || "1");
        const limit = Number(data.limit || "20");
        const filterWhitelist = ["username", "rank"];
        const filter = formatFilter(data, filterWhitelist);

        const { count, rows } = await accountRepository.findAccounts({ page, limit, filter, options });
        return formatReturnDataPagination({ rows: { accounts: rows }, page, count, limit });
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