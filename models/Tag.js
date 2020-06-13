const { Model } = require('objection');

const Video = require('./Video.js');

class Tag extends Model {
    static get tableName() {
        return 'tags';
    }

    static get relationMappings() {
        return {
            video: {
                relation: Model.BelongsToOneRelation,
                modelClass: Video,
                join: {
                    from: 'tags.videoId',
                    to: 'videos.id'
                }
            }
        }
    };
}

module.exports = Tag;