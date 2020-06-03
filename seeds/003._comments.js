
exports.seed = function(knex) {

    return knex('videos').select().then(videos => {
        
      // Inserts seed entries
      return knex('comments').insert([
        { 
          video_id: videos[0].id, 
          username: 'Hagrid', 
          comment: 'What a lovely bridge, you got there' 
        },
        { 
          video_id: videos[1].id, 
          username: 'Camus', 
          comment: 'Nice video, mate!' 
        },
        { 
          video_id: videos[2].id, 
          username: 'Beanieman', 
          comment: 'Nice beanie, man' 
        },
        { 
          video_id: videos[3].id, 
          username: 'MrDoc', 
          comment: 'Sounds like music!' 
        },
      ]);
    });
};
