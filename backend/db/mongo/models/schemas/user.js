const mongoose = require('mongoose');

module.exports = (function () {
  const schema = new mongoose.Schema({
    /**
     * Email of the user
     */
    email: {
      type: String,
      unique: true,
      sparse: true,
      required: true
    },
    /**
     * password of the user
     */
    password: {
      type: String,
      required: true
    },
    /**
     * role of the user, possible roles: ADMIN: 1, MANAGER: 2, USER: 3
     */
    role: {
      type: Number,
      required: true
    },
    /**
     * modifiedAt the time when user is modified
     */
    modifiedAt: {
      type: Date,
      default: new Date()
    },
    /**
     * createdAt the time when user was created
     */
    createdAt: {
      type: Date,
      default: new Date()
    }
  });

  return schema;
})();
