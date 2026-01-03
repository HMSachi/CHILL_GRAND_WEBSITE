import startersImg from '../../assets/starters.jpg';
import riceImg from '../../assets/rice.jpg';
import seafoodImg from '../../assets/seafood.jpg';
import chickenImg from '../../assets/chicken.jpg';
import beefImg from '../../assets/beef.jpg';
import porkImg from '../../assets/pork.jpg';
import dessertImg from '../../assets/dessert.jpg';
import cocktailImg from '../../assets/cocktail.jpg';
import freshjuiceImg from '../../assets/freshjuice.jpg';
import saladImg from '../../assets/salad.jpg';

export const menuItems = [
    // Starters (Category ID: 1)
    { id: 101, categoryId: 1, name: 'Crispy Spring Rolls', price: 'Rs. 850', description: 'Vegetable spring rolls served with sweet chili sauce.', image: startersImg },
    { id: 102, categoryId: 1, name: 'Garlic Bread', price: 'Rs. 650', description: 'Toasted bread with garlic butter and herbs.', image: startersImg },
    { id: 103, categoryId: 1, name: 'Chicken Wings', price: 'Rs. 1200', description: 'Spicy buffalo wings with blue cheese dip.', image: startersImg },

    // Main Course (Category ID: 2)
    { id: 201, categoryId: 2, name: 'Mixed Fried Rice', price: 'Rs. 1850', description: 'Classic fried rice with chicken, shrimp, and vegetables.', image: riceImg },
    { id: 202, categoryId: 2, name: 'Vegetable Curry', price: 'Rs. 1450', description: 'Assorted vegetables cooked in traditional Sri Lankan spices.', image: riceImg },

    // Seafood (Category ID: 3)
    { id: 301, categoryId: 3, name: 'Grilled Lobster', price: 'Rs. 4500', description: 'Fresh lobster grilled with lemon butter sauce.', image: seafoodImg },
    { id: 302, categoryId: 3, name: 'Fish and Chips', price: 'Rs. 1950', description: 'Crispy battered fish served with fries and tartar sauce.', image: seafoodImg },

    // Chicken (Category ID: 4)
    { id: 401, categoryId: 4, name: 'Devilled Chicken', price: 'Rs. 1650', description: 'Spicy chicken stir-fry with onions and peppers.', image: chickenImg },
    { id: 402, categoryId: 4, name: 'Roast Chicken', price: 'Rs. 2200', description: 'Half chicken roasted with herbs and gravy.', image: chickenImg },

    // Beef (Category ID: 5)
    { id: 501, categoryId: 5, name: 'Beef Steak', price: 'Rs. 3200', description: 'Tender beef steak served with mashed potatoes.', image: beefImg },
    { id: 502, categoryId: 5, name: 'Beef Burger', price: 'Rs. 1850', description: 'Juicy beef patty with cheese and caramelized onions.', image: beefImg },

    // Pork (Category ID: 6)
    { id: 601, categoryId: 6, name: 'Pork Chops', price: 'Rs. 2400', description: 'Grilled pork chops with apple sauce.', image: porkImg },
    { id: 602, categoryId: 6, name: 'Devilled Pork', price: 'Rs. 1750', description: 'Spicy pork stir-fry with traditional spices.', image: porkImg },

    // Desserts (Category ID: 7)
    { id: 701, categoryId: 7, name: 'Chocolate Lava Cake', price: 'Rs. 950', description: 'Warm chocolate cake with a gooey center.', image: dessertImg },
    { id: 702, categoryId: 7, name: 'Fruit Salad', price: 'Rs. 750', description: 'Fresh seasonal fruit salad with honey.', image: dessertImg },

    // Cocktails (Category ID: 8)
    { id: 801, categoryId: 8, name: 'Classic Mojito', price: 'Rs. 1450', description: 'Rum, mint, lime, and soda water.', image: cocktailImg },
    { id: 802, categoryId: 8, name: 'Margarita', price: 'Rs. 1550', description: 'Tequila, lime juice, and triple sec.', image: cocktailImg },

    // Fresh Juices (Category ID: 9)
    { id: 901, categoryId: 9, name: 'Watermelon Juice', price: 'Rs. 650', description: 'Freshly squeezed watermelon juice.', image: freshjuiceImg },
    { id: 902, categoryId: 9, name: 'Orange Juice', price: 'Rs. 850', description: 'Freshly squeezed orange juice.', image: freshjuiceImg },

    // Salads (Category ID: 10)
    { id: 1001, categoryId: 10, name: 'Caesar Salad', price: 'Rs. 1250', description: 'Romaine lettuce, croutons, and parmesan cheese.', image: saladImg },
    { id: 1002, categoryId: 10, name: 'Greek Salad', price: 'Rs. 1150', description: 'Cucumber, tomato, olives, and feta cheese.', image: saladImg },
];
