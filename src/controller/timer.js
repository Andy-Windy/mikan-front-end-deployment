export function change2Time(stamp) {
    if (!stamp) return "";
    const date = new Date(stamp * 1000); // 乘以 1000 转换为毫秒

    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1);
    const day = String(date.getUTCDate());
    const hours = String(date.getUTCHours());
    const minutes = String(date.getUTCMinutes());

    const formattedDate = `${year}年${month}月${day}日 ${hours}时${minutes}分`;
    return formattedDate;
}
