
exports.up = function(knex) {
    return knex.schema.table('videos', (table) => {
        // Adding user id to videos, to link videos to the user who uploaded it
        table.integer('user_id').unsigned().notNullable();
        table.foreign('user_id').references('users.id');
    })
  
};

exports.down = function(knex) {
    return knex.schema.table('videos', (table) => {
        
    })
  
};
