
exports.seed = function(knex) {

  return knex('roles').select().then(roles => {

    // Inserts seed entries
    return knex('users').insert([
      {
        username: 'admin', 
        password: '$2b$10$QPLR8foTJYkWVK3x2ws0tuNc3OCrUjkBmW9/R.wDVDrPzixJzx7ca', 
        role_id: roles[0].id, 
        email: "admin@email.com", 
        uuid: "3864bcd8-d488-4cd3-b700-86d8fa440f97"
      },
      {
        username: 'user', 
        password: '$2b$10$zeqXl5kf.yZfkY2N3gvaUusMysTCYt1CkdSO1yg0xqZyQfuL66YJm', 
        role_id: roles[2].id, 
        email: "user@email.com", 
        uuid: "b64c447b-5a9f-4b01-b61e-e8cce2dd17bd"
      },
      {
        username: 'anon', 
        password: '$2b$10$FuNaKHcZD.3OdXFZacUMbeedX8T7rKkavTeMPHpwUSkqFcOcec2tO', 
        role_id: roles[1].id, 
        uuid: "e77c3376-8956-4e25-967b-19d1640be176"
      }
    ]);
  });
};
