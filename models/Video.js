const { Model } = require('objection');

const Tag = require('./Tag.js');
const Comment = require('./Comment.js');

class Video extends Model {
    static tableName = 'videos';

    static relationMappings = {
        tags: {
            relation: Model.HasManyRelation,
            modelClass: Tag,
            join: {
                from: 'videos.id',
                to: 'tags.videoId'
            }
        },

        comments: {
            relation: Model.HasManyRelation,
            modelClass: Comment,
            join: {
                from: 'videos.id',
                to: 'comments.videoId'
            }
        }
    };
}

module.exports = Video;