//时间戳转日期
function formatDate(date) {
    var year = date.getFullYear()
    var month = date.getMonth() + 1
    var day = date.getDate()

    var hour = date.getHours()
    var minute = date.getMinutes()
    var second = date.getSeconds();


    return [year, month, day].map(formatNumber).join('-')
}

//日期转时间戳
function formatDataToTimestamp(data) {
    return Date.parse(new Date(data)) / 1000;
}

function formatNumber(n) {
    n = n.toString()
    return n[1] ? n : '0' + n
}

function isStudentNoValid(studentNo) {
    if (studentNo != null && studentNo != '') {
        return true;
    }
    else {
        return false;
    }
}

module.exports = {
    formatDate: formatDate,
    isStudentNoValid: isStudentNoValid,
    formatDataToTimestamp: formatDataToTimestamp
}
