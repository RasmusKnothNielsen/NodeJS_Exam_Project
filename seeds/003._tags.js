
exports.seed = function(knex) {

    return knex('videos').select().then(videos => {
      
      // Inserts seed entries
      return knex('tags').insert([
        { 
          video_id: videos[0].id, 
          tag: 'shovel' 
        },
        { 
          video_id: videos[0].id, 
          tag: 'ski' 
        },
        { 
          video_id: videos[1].id, 
          tag: 'waves' 
        },
        { 
          video_id: videos[1].id, 
          tag: 'ocean' 
        },
        { 
          video_id: videos[1].id, 
          tag: 'coast' 
        },
        { 
          video_id: videos[2].id, 
          tag: 'waves' 
        },
        { 
          video_id: videos[2].id, 
          tag: 'beanie' 
        },
        { 
          video_id: videos[2].id, 
          tag: 'man' 
        },
        { 
          video_id: videos[3].id, 
          tag: 'safety pin' 
        },
        { 
          video_id: videos[3].id, 
          tag: 'sunscreen' 
        },
        { 
          video_id: videos[4].id, 
          tag: 'blue jean' 
        },
        { 
          video_id: videos[4].id, 
          tag: 'plastic bag' 
        },
        { 
          video_id: videos[5].id, 
          tag: 'alp' 
        },
        { 
          video_id: videos[5].id, 
          tag: 'seashore' 
        },
        { 
          video_id: videos[6].id, 
          tag: 'volcano' 
        },
        { 
          video_id: videos[6].id, 
          tag: 'alp' 
        },
        { 
          video_id: videos[7].id, 
          tag: 'Arabian camel' 
        },
        { 
          video_id: videos[7].id, 
          tag: 'lighthouse' 
        },
        { 
          video_id: videos[8].id, 
          tag: 'bell cote' 
        },
        { 
          video_id: videos[8].id, 
          tag: 'monastery' 
        },
        { 
          video_id: videos[8].id, 
          tag: 'gong' 
        },
        { 
          video_id: videos[9].id, 
          tag: 'macaw' 
        },
        { 
          video_id: videos[9].id, 
          tag: 'banana' 
        },
        { 
          video_id: videos[10].id, 
          tag: 'gown' 
        },
        { 
          video_id: videos[10].id, 
          tag: 'suit' 
        },
      ]); 
    });
};
