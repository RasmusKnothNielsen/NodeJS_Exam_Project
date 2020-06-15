const { Model } = require('objection');

const Video = require('./Video.js');
const User = require('./User.js');

class Comment extends Model {
    static get tableName() {
        return 'comments';
    } 

    static get relationMappings() {
        return {
            video: {
                relation: Model.BelongsToOneRelation, // Use BelongsToOneRelation because comment has the foreign key, else use HasOneRelation
                modelClass: Video,
                join: {
                    from: 'comments.videoId',
                    to: 'videos.id'
                }
            },
            user: {
                relation: Model.BelongsToOneRelation,
                modelClass: User,
                join: {
                    from: 'comments.userId',
                    to: 'users.id'
                }
            }
        };
    }
}

module.exports = Comment;