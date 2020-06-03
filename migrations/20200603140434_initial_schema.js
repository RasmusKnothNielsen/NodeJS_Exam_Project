
exports.up = function(knex) {
  return knex.schema
        .createTable('roles', (table) => {
            table.increments('id').notNullable();
            table.string('role').unique().notNullable();
        })
        .createTable('users', (table) => {
            table.increments('id').notNullable();     //Using increments, promotes it to primary key
            table.string('username').unique().notNullable();
            table.string('password').notNullable();
            table.integer('age');
            table.string('email').unique();
            table.string('UUID').unique().notNullable();  // This is used to check what user is logged in, by setting the value in our cookie.
            // I chose this, so i don't have to use a username as identifier, which is too easy to "guess"

            // Make the role_id compatible with roles.id
            // and make it a foreign key that references roles.id
            table.integer('role_id').unsigned().notNullable();
            table.foreign('role_id').references('roles.id');

            table.dateTime('created_at').notNullable().defaultTo(knex.raw('CURRENT_TIMESTAMP'));
            table.dateTime('updated_at').defaultTo(knex.raw('NULL ON UPDATE CURRENT_TIMESTAMP'));
        })
        .createTable('videos', (table) => {
          table.increments('id').notNullable();
          table.string('title').notNullable();
          table.string('description');
          table.string('filename').unique().notNullable();
          table.string('thumbnail').unique();
          table.string('category');
          table.dateTime('created_at').notNullable().defaultTo(knex.raw('CURRENT_TIMESTAMP'));
          table.integer('views');

        })
        .createTable('tags', (table) => {
          table.increments('id').notNullable();
          // Foreign key that references id in videos
          table.integer('video_id').unsigned().notNullable();
          table.foreign('video_id').references('videos.id');

          table.string('tag').notNullable();
        })
        .createTable('comments', (table) => {
          table.increments('id').notNullable();
          // Foreign key that references id in videos
          table.integer('video_id').unsigned().notNullable();
          table.foreign('video_id').references('videos.id');

          table.string('username').notNullable();
          table.string('comment').notNullable();
          table.dateTime('created_at').notNullable().defaultTo(knex.raw('CURRENT_TIMESTAMP'));
        })
};

exports.down = function(knex) {
  // Rollback, like undoing some changes
  return knex.schema
        .dropTableIfExists('comments')
        .dropTableIfExists('tags')
        .dropTableIfExists('videos')
        .dropTableIfExists('users')
        .dropTableIfExists('roles');

};
