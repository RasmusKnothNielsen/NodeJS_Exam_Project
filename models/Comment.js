const { Model } = require('objection');

const Video = require('./Video.js');
const User = require('./User.js');

class Comment extends Model {
    static tableName = 'comments';

    static relationMappings = {
        video: {
            relation: Model.BelongsToOneRelation,
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

module.exports = Comment;