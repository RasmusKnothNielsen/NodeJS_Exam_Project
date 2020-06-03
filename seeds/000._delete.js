
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('comments').del()
    .then(() => {
      return knex('tags').del()
        .then(() => {
          return knex('videos').del()
            .then(() => {
              return knex('users').del()
                .then(() => {
                  return knex('roles').del();
                });
            })
        })
    })
};
