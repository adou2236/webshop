//生成订单编号工具
const moment = require('moment');

const createOrderId = (userId,payMethod) => {
    const date = moment(new Date()).format('YYYYMMDDhhmmss');
    const r1 = Math.floor(Math.random() * 10);
    return date + r1 + payMethod ;
};
//格式为当前时间+随机数+支付方式（暂时如此）

module.exports = createOrderId;
