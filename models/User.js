const { Model } = require('objection');

const Role = require('./Role.js');

class User extends Model {
    static get tableName() {
      return 'users';
    }

    static get relationMappings() {
      return {
          role: {
            relation: Model.BelongsToOneRelation,  // Use BelongsToOneRelation because user has the foreign key, else use HasOneRelation
            modelClass: Role,
            join: {
              from: 'users.roleId',
              to: 'roles.id'
            }
          }
        }
    };
}

module.exports = User;