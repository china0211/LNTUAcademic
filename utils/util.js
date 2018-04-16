var base64 = require("base64.min.js");

//时间戳转日期
function formatDate(date) {
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();

    var hour = date.getHours();
    var minute = date.getMinutes();
    var second = date.getSeconds();

    return [year, month, day].map(formatNumber).join('-')
}

//日期转时间戳 毫秒
function formatDataToTimestamp(data) {
    return Date.parse(new Date(data));
}

function formatNumber(n) {
    n = n.toString();
    return n[1] ? n : '0' + n
}

function isStudentNoValid(studentNo) {
    return studentNo != null && studentNo !== '';
}

function isEmpty(data) {
    return data === undefined || data == null || data.length === 0;
}

function encodeAuthorization(studentNo, weChatOpenId) {
    return "Basic " + base64.encode(studentNo + ":" + weChatOpenId);
}

module.exports = {
    formatDate: formatDate,
    isStudentNoValid: isStudentNoValid,
    formatDataToTimestamp: formatDataToTimestamp,
    isEmpty: isEmpty,
    encodeAuthorization: encodeAuthorization
};
