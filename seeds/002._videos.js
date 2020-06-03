exports.seed = function(knex) {

    // Inserts seed entries
    return knex('videos').insert([
        { 
            title: 'Winter Bridge', 
            description: 'Look at my beautiful bridge', 
            filename: 'd50bfc7e329146899913f8f8be856f193bd392e3.mp4', 
            thumbnail: 'd50bfc7e329146899913f8f8be856f193bd392e3.mp4.png', 
            category: 'nature', 
            views: 5
        },
        { 
            title: 'Ocean Waves', 
            description: 'Watch the waves and enjoy', 
            filename: '1fb249005a44d5bbdf9788b7e0f6e0c4d8e758e1.mp4', 
            thumbnail: '1fb249005a44d5bbdf9788b7e0f6e0c4d8e758e1.mp4.png', 
            category: 'nature', 
            views: 2
        },
        { 
            title: 'Man enjoys Ocean Waves', 
            description: 'Watch a man enjoying watching the waves', 
            filename: 'd430ccb3be606a29d259b95cbc850b4ae78b75ce.mp4', 
            thumbnail: 'd430ccb3be606a29d259b95cbc850b4ae78b75ce.mp4.png', 
            category: 'nature', 
            views: 10
        },
        { 
            title: 'How to wash hands', 
            description: 'Video demonstrating how to wash hands properly.', 
            filename: 'f3c14e27d589f4c59b9138dbae16498ec6eb62a2.mp4', 
            thumbnail: 'f3c14e27d589f4c59b9138dbae16498ec6eb62a2.mp4.png', 
            category: 'howtostyle', 
            views: 672
        },
        { 
            title: 'How to put on a mask', 
            description: 'Informational movie about how to put on a mask in case of Corona virus outbreak.', 
            filename: '7c376d9474958b29cbb2bc1e1eedea1386685d52.mp4', 
            thumbnail: '7c376d9474958b29cbb2bc1e1eedea1386685d52.mp4.png', 
            category: 'howtostyle', 
            views: 25
        },
        { 
            title: 'Drone footage of small town', 
            description: '', 
            filename: '342a298c0a5fb0305329d4d54406a47f34ce44bd.mp4', 
            thumbnail: '342a298c0a5fb0305329d4d54406a47f34ce44bd.mp4.png', 
            category: 'nature', 
            views: 12
        },
        { 
            title: 'Forest in wintertime', 
            description: 'Drone footage of forest', 
            filename: '5b7aa6e0487f03a3c563e8c1586f27ecf739a0bc.mp4', 
            thumbnail: '5b7aa6e0487f03a3c563e8c1586f27ecf739a0bc.mp4.png', 
            category: 'nature', 
            views: 1
        },
        { 
            title: 'Cello at sun down', 
            description: '', 
            filename: '3618f6ee2b0089c632179a4c37175c05c64d7bf1.mp4', 
            thumbnail: '3618f6ee2b0089c632179a4c37175c05c64d7bf1.mp4.png', 
            category: 'music', 
            views: 64
        },
        { 
            title: 'Medieval Castle', 
            description: '', 
            filename: '409d9be0db4e1f7da72c07b61e81033d94bb3e56.mp4', 
            thumbnail: '409d9be0db4e1f7da72c07b61e81033d94bb3e56.mp4.png', 
            category: 'entertainment', 
            views: 1
        },
        { 
            title: 'Blooming Daffodil', 
            description: '', 
            filename: '9ac8c098133a4e5b604503261b5a55f158ed0af5.mp4', 
            thumbnail: '9ac8c098133a4e5b604503261b5a55f158ed0af5.mp4.png', 
            category: 'nature', 
            views: 2
        },
        { 
            title: 'Divine Peace', 
            description: '', 
            filename: '91954c9136e5e388f25b8d799549e4c1835471d0.mp4', 
            thumbnail: '91954c9136e5e388f25b8d799549e4c1835471d0.mp4.png', 
            category: 'education', 
            views: 42
        },
        { 
            title: 'Heart Beats', 
            description: '', 
            filename: '36ee28917a547a55674332212a9529fee0929236.mp4', 
            thumbnail: '36ee28917a547a55674332212a9529fee0929236.mp4.png', 
            category: '', 
            views: 7
        },
    ]);
};
