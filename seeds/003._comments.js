
exports.seed = function(knex) {

    return knex('videos').select().then(videos => {
        
      // Inserts seed entries
      return knex('comments').insert([
        { 
          video_id: videos[0].id, 
          userId: 1, 
          comment: 'What a lovely bridge, you got there' 
        },
        { 
          video_id: videos[1].id, 
          userId: 2, 
          comment: 'Nice video, mate!' 
        },
        { 
          video_id: videos[2].id, 
          userId: 2, 
          comment: 'Nice beanie, man' 
        },
        { 
          video_id: videos[3].id, 
          userId: 3, 
          comment: 'Sounds like music!' 
        },
      ]);
    });
};
