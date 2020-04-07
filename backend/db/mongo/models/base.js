
const mongoose = require('mongoose');
const _ = require('lodash');
// logger = require('../../../../logger');
const error = require('../../../lib/error');

module.exports = function (schema, name) {

  const checkMongoId = function (id, subsetName) {
    let mongoId;
    try {
      mongoId = mongoose.Types.ObjectId(id);
    } catch (e) {
      console.error(`Bd id format: ${id}`)
    }
    return mongoId;
  };

  /**
   * Returns one row for mongo id
   * @returns {}
   * @private
   */
  schema.statics.findById = function (id, options) {
    return new Promise((resolve, reject) => {
      const mongoID = checkMongoId(id);

      if (mongoID) {
        const params = _.defaults({ _id: mongoID });
        model.findOne(params, options, function (err, dbGroup) {
          if (err) {
            return reject(error('DATABASE_ERROR'));
          }
          resolve(dbGroup);
        });
      } else {
        reject(error('BAD_ID_FORMAT'));
      }
    })
  };

  /**
   * Returns all groups
   * @returns []
   * @private
   */
  schema.statics.findAll = function (options) {
    return new Promise((resolve, reject) => {
      model.find({}, options, function (err, rows) {
        if (err) {
          return reject(error('DATABASE_ERROR'));
        }
        resolve(rows);
      });
    })
  };

  /**
     * Returns for field filter
     * @returns []
     * @private
     */
  schema.statics.findOneByFields = function (fields, options) {
    return new Promise((resolve, reject) => {
      model.findOne(fields, options, function (err, rows) {
        if (err) {
          return reject(error('DATABASE_ERROR'));
        }
        resolve(rows);
      });
    })
  };

  /**
   * Returns for field filter
   * @returns []
   * @private
   */
  schema.statics.findByFields = function (fields, options) {
    return new Promise((resolve, reject) => {
      model.find(fields, options, function (err, rows) {
        if (err) {
          return reject(error('DATABASE_ERROR'));
        }
        resolve(rows);
      });
    })
  };

  /**
 * Returns for field filter and sort
 * @returns []
 * @private
 */
  schema.statics.findByFieldsAndSort = function (fields, options, sort) {
    return new Promise((resolve, reject) => {
      model.find(fields, options).sort(sort).exec(function (err, rows) {
        if (err) {
          return reject(error('DATABASE_ERROR'));
        }
        resolve(rows);
      });
    })
  };

  schema.statics.create = function (data) {
    return new Promise((resolve, reject) => {
      const record = new model(data);
      record.save(function (err, row) {
        if (err) {
          return reject(error('DATABASE_ERROR'));
        }
        resolve(row);
      });
    })
  };

  /**
   * Update
   * 
   * @param id      The identifier
   * @param data    The data
   * @param options The options
   */
  schema.statics.update = function (id, data, options) {
    return new Promise((resolve, reject) => {
      const mongoID = checkMongoId(id);

      if (mongoID) {
        options = _.defaults(options, { new: true });
        
        model.findByIdAndUpdate({ _id: mongoID },  data, options, function (err, row) {
          if (err) {
            console.log('ERRORRRRRRR:', err)
            return reject(error('DATABASE_ERROR'));
          }
          resolve(row);
        });
      } else {
        reject(error('BAD_ID_FORMAT'));
      }
    })
  };


  /**
   * Delete
   * 
   * param id The identifier
   */
  schema.statics.delete = function (id) {
    return new Promise((resolve, reject) => {
      const mongoID = checkMongoId(id);

      if (mongoID) {
        model.deleteOne({ _id: mongoID }, function (err, data) {
          if (err) {
            return reject(error('DATABASE_ERROR'));
          }
          resolve(data);
        });
      } else {
        reject(error('BAD_ID_FORMAT'));
      }
    })
  };


  const model = mongoose.model(name, schema);
  return model;
};
