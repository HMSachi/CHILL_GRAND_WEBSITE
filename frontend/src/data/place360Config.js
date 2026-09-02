// Configuration for Google Maps Street View style 360 Virtual Tour
// Map place names to multiple 360 images (nodes) with 360 navigation hotspots!
export const PLACE_360_MAP = {

    "Function Hall": [
        {
            id: 'function-1',
            title: 'Function Hall - Entrance View',
            image: '/360-images/Function_hall_01.png',
            hotspots: [
                { targetSceneId: 'function-2', yaw: 1.61, pitch: -0.52, label: 'Walk to Main Seating' },

            ]
        },
        { 
            id: 'function-2',
            title: 'Function Hall - Main Seating',
            image: '/360-images/Function_hall_02.png',
            hotspots: [
                { targetSceneId: 'function-1', yaw: 5.84, pitch: -0.25, label: 'Back to Entrance' },

            ]
        },

    ],
    "Main Hall": [
        {
            id: 'main-1',
            title: 'Main Hall - Entrance View',
            image: '/360-images/Main_hall_01.png',
            hotspots: [

                { targetSceneId: 'main-2',yaw: 5.25, pitch: -0.34 , label: 'Walk into Main Hall' }
            ]
        },
        {
            id: 'main-2',
            title: 'Main Hall - Central Dining',
            image: '/360-images/Main_hall_02.png',
            hotspots: [

                { targetSceneId: 'main-1',yaw: 0.67, pitch: -0.62 , label: 'Back to Entrance' },

            ]
        },


    ],
    "Pub": [
        {
            id: 'pub-1',
            title: 'Pub - Bar Counter',
            image: '/360-images/Pub.png',
            hotspots: [

            ]
        },

    ],
    "Vip Room 1": [
        {
            id: 'vip1-1',
            title: 'VIP Room 1 - Overview',
            image: '/360-images/VIP_room_01.png',
            hotspots: []
        }
    ],
    "Vip Room 2": [
        {
            id: 'vip2-1',
            title: 'VIP Room 2 - Overview',
            image: '/360-images/VIP_room_02.png',
            hotspots: []
        }
    ],
    "DEFAULT": [
        {
            id: 'default-1',
            title: 'General View',
            image: '/360-images/Entrance.png',
            hotspots: []
        }
    ]
};

// Custom manual table pin positions for each place.
// Supports per-scene positions (e.g. "main-1" for Image 1, "main-2" for Image 2)
export const TABLE_POSITIONS = {
    "Function Hall": {
        "function-1": {
            "2": { yaw: 4.21, pitch: -0.47 },
            "3": { yaw: 5.44, pitch: -0.26 },
            "4": { yaw: 5.86, pitch: -0.22 },
            "5": { yaw: 0.48, pitch: -0.24 }
        },

        "function-2": {
            "6": { yaw: 0.65, pitch: -0.06 },
            "7": { yaw: 1.19, pitch: -0.25 },
            "8": { yaw: 2.33, pitch: -0.23 },
            "9": { yaw: 4.57, pitch: -0.48 },
            "10": { yaw: 5.46, pitch: -0.24 }          
        }
    },
    "Main Hall": {
        "main-1": {
            "11": { yaw: 0.57, pitch: -0.29 },
            "12": { yaw: 0.31, pitch: -0.04 },
            "14": { yaw: 6.24, pitch: -0.07 }
        },
        "main-2": {
            "11": { yaw: 0.16, pitch: -0.03 },
            "12": { yaw: 6.12, pitch: -0.03 },
            "14": { yaw: 6.03, pitch: -0.1 }
        }
    },
    "Pub": {
        "1": { yaw: 1.36, pitch: -0.4 },
        "2": { yaw: 2.45, pitch: -0.49 },
        "3": { yaw: 4.71, pitch: -0.39 },
        "4": { yaw: 5.6, pitch: -0.21 }
    },
    "Vip Room 1": {
        "1": { yaw: 0.03, pitch: -0.36 }
    },
    "Vip Room 2": {
        "1": { yaw: 0.68, pitch: -0.45 }
    }
};

