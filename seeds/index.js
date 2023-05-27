const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Campground = require('../models/campground');

mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp', {
    useNewUrlParser: true,
    // useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)];


const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 30) + 10;
        const camp = new Campground({
            author: '63b8653f8c6ed95ef26ca25a',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            images: [
                { url: 'https://res.cloudinary.com/dj5eqbwjc/image/upload/v1673446458/YelpCamp/x34salkwqaugkhu5n2ud.jpg', filename: 'YelpCamp/x34salkwqaugkhu5n2ud' },
                { url: 'https://res.cloudinary.com/dj5eqbwjc/image/upload/v1673446458/YelpCamp/pdtt8camertxptdxlwfk.jpg', filename: 'YelpCamp/pdtt8camertxptdxlwfk' }
            ],
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit.Maiores, possimus ex fugiat vitae ipsa accusamus quod id temporibus animi delectus facere debitis consectetur perferendis doloremque harum! Omnis maxime blanditiis voluptatum!',
            price
        })
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})