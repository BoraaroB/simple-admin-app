const { v4: uuidv4 } = require('uuid');
const _ = require('lodash');
const error = require('./error');

const CHARACTERS = ['ABCDEFGHIJKLMNOPQRSTUVWXYZ', '0123456789', 'abcdefghijklmnopqrstuvwxyz', '!_'];

module.exports.generatePassword = () => {
    return [3, 3, 3, 1].map((len, i) => { return Array(len).fill(CHARACTERS[i]).map(x => { return x[Math.floor(Math.random() * x.length)]; }).join(''); }).concat().join('').split('').sort(() => { return 0.5 - Math.random(); }).join('');
};

const _repeatCharacters = (count, ch) => {
    if (count === 0) {
        return '';
    }
    const count2 = count / 2;
    let result = ch;

    // double the input until it is long enough.
    while (result.length <= count2) {
        result += result;
    }
    // use substring to hit the precise length target without
    // using extra memory
    return result + result.substring(0, count - result.length);
};
module.exports.repeatCharacters = _repeatCharacters;

module.exports.round = (value, places) => {
    const number = Number(value + ('e+' + places));
    return +(Math.round(number) + ('e-' + places));
};

module.exports.format = (amount, decimalCount = 2, decimal = '.', thousands = ',') => {
    try {
        decimalCount = Math.abs(decimalCount);
        decimalCount = isNaN(decimalCount) ? 2 : decimalCount;

        const negativeSign = amount < 0 ? '-' : '';

        const i = parseInt(amount = Math.abs(Number(amount) || 0).toFixed(decimalCount)).toString();
        const j = (i.length > 3) ? i.length % 3 : 0;
        return negativeSign + (j ? i.substr(0, j) + thousands : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, '$1' + thousands) + (decimalCount ? decimal + Math.abs(amount - i).toFixed(decimalCount).slice(2) : '');
    } catch (e) {
        return amount;
    }
};

module.exports.maskString = (string, lastN, symbol = '*') => {
    if (!string) return '';
    if (!lastN) return string;
    if (string.length < lastN) return string;

    return _repeatCharacters(string.length - lastN, symbol) + string.substr(string.length - lastN);
};

module.exports.returnBatchRequest = (user) => {
    return { user, api_id: uuidv4(), headers: { 'x-forwarded-for': ':LOCAL_BATCH' } };
};

module.exports.cloneBatchRequest = (req, initData) => {
    return _.defaults(initData || {}, req);
};

module.exports.getRequestIP = (req) => {
    if (req) {
        let ipData = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        ipData = ipData ? ipData.replace('::1', ':127.0.0.1').replace('::ffff', '') : 'UNKNOWN';
        return ipData;
    }
    return {};
};

module.exports.trimQuotes = string => {
    if (string.indexOf('`') >= 0) {
        return string.slice(1, -1);
    } else return string;
};
