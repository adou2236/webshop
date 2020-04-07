function normalRes(message,flag,data){
    return {
        message:message,
        flag:flag||false,
        data:data||""
    }
};
exports.normalRes = normalRes