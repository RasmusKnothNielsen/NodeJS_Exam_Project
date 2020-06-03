const { Model } = require('objection');

const Video = require('./Video.js');

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
        }
    };
}

module.exports = Comment;