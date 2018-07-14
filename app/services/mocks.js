import faker from 'faker';
import ncp from 'ncp';

import User from '../models/user';
import Product from '../models/product';
import createError from './error';

const USERS_TOTAL = 3;
const PRODUCTS_TOTAL = 2;
const USER_EMAILS = ['baaraak@gmail.com', 'bartak@gmail.com', 'barak@gmail.com'];

export default async () => {
    try {
        await User.remove();
        await Product.remove();
        await ncp('static', 'uploads');

        await Array.from({ length: USERS_TOTAL }).forEach(async (_, i) => {
            const user = await User.create({
                firstName: faker.name.firstName(),
                lastName: faker.name.lastName(),
                email: USER_EMAILS[i],
                country: faker.address.countryCode(),
                avatar: 'uploads/avatar.png',
                password: '123123',
            });

            await Array.from({ length: PRODUCTS_TOTAL }).forEach(
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
                        images: [`uploads/product_image-${i}-${index}.jpg`],
                        category: '3',
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
