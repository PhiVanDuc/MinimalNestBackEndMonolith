module.exports = ({ rows, page, count, limit }) => {
    return {
        ...rows,
        page: page.toString(),
        totalPage: Math.max(1, Math.ceil(count / limit)).toString(),
    }
}