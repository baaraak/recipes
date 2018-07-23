import faker from 'faker';
import ncp from 'ncp';

import User from '../models/user';
import Product from '../models/product';
import createError from './error';

const USERS_TOTAL = 15;
const USER_EMAILS = ['baaraak@gmail.com', 'bartak@gmail.com', 'barak@gmail.com'];
const IMAGES = ['uploads/1.jpg', 'uploads/2.jpg', 'uploads/3.jpg', 'uploads/4.jpg', 'uploads/5.jpg', 'uploads/6.jpg'];

const getRandomImage = () => IMAGES[Math.floor(Math.random() * IMAGES.length)];

export default async () => {
    try {
        await User.remove();
        await Product.remove();
        await ncp('static', 'uploads');

        await Array.from({ length: USERS_TOTAL }).forEach(async (_, i) => {
            const user = await User.create({
                firstName: faker.name.firstName(),
                lastName: faker.name.lastName(),
                email: USER_EMAILS[i] || faker.internet.email(),
                country: faker.address.countryCode(),
                avatar: 'uploads/avatar.png',
                password: '123123',
            });

            await Array.from({ length: Math.floor(Math.random() * 3) + 1 }).forEach(
                async (_, index) => {
                    const product = await Product.create({
                        title: faker.name.title(),
                        description: faker.lorem.sentence(),
                        user: user._id,
                        price: {
                            min: faker.random.number(50, 200),
                            max: faker.random.number(250, 400),
                        },
                        location: {
                            lat: faker.address.latitude(),
                            lng: faker.address.longitude(),
                            address: faker.address.streetAddress(),
                        },
                        radius: 50,
                        images: Array.from({ length: Math.floor(Math.random() * 2) + 1 })
                            .map((_, i) => getRandomImage()),
                        category: Math.floor(Math.random() * 44),
                        wanted: ['2', '4'],
                    });
                    await User.findOneAndUpdate(
                        { _id: user._id },
                        { $addToSet: { products: product._id } },
                        { safe: true, upsert: true },
                    );
                }
            );
        });
    } catch (error) {
        throw error;
    }
};
