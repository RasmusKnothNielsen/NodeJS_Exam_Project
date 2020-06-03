const { Model } = require('objection');

const Video = require('./Video.js');

class Tag extends Model {
    static tableName = 'tags';

    static relationMappings = {
        video: {
            relation: Model.BelongsToOneRelation,
            modelClass: Video,
            join: {
                from: 'tags.videoId',
                to: 'videos.id'
            }
        }
    };
}

module.exports = Tag;