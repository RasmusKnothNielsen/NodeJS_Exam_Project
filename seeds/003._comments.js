
exports.seed = function(knex) {

    return knex('videos').select().then(videos => {
        
      // Inserts seed entries
      return knex('comments').insert([
        { 
          video_id: videos[0].id, 
          userId: 1, 
          userName: 'Admin',
          comment: 'What a lovely bridge, you got there' 
        },
        { 
          video_id: videos[1].id, 
          userId: 2, 
          userName: 'User',
          comment: 'Nice video, mate!' 
        },
        { 
          video_id: videos[2].id, 
          userId: 2, 
          userName: 'User',
          comment: 'Nice beanie, man' 
        },
        { 
          video_id: videos[3].id, 
          userId: 3, 
          userName: 'Anon',
          comment: 'Sounds like music!' 
        },
      ]);
    });
};
