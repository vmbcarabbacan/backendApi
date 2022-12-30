const containUndefined = (arr) => {
    return arr.some(element => element === undefined)
}

const containNull = (arr) => {
    return arr.some(element => element === null)
}

const containEmpty = (arr) => {
    return arr.some(element => element === '')
}

const isEmpty = (arr) => {
    if(containUndefined(arr)) return true
    if(containNull(arr)) return true
    if(containEmpty(arr)) return true

    return false
}

const sendStatus = (res, code, msg) => {
    return res.status(code).json({ message: msg })
}


module.exports = {
    containUndefined,
    containNull,
    containEmpty,
    sendStatus,
    isEmpty
}