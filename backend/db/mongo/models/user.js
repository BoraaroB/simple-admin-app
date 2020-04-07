
const schema = require('./schemas/user');
const base = require('./base');

const model = base(schema, 'user');

module.exports = model;