import { Router } from 'express';
import articleRoutes from './articleRoutes.js'
import photoRoutes from './photoRoutes.js'
import userRoutes from './userRoutes.js'
import imageRoutes from './imageRoutes.js'
import orderRoutes from './orderRoutes.js'
import productRoutes from './productRoutes.js'
import videoRoutes from './videoRoutes.js'
import songRoutes from './songRoutes.js'
import countryRoutes from './countryRoutes.js'
import teamRoutes from './teamRoutes.js'


const baseRoutes = Router();

baseRoutes.use('/articles', articleRoutes);
baseRoutes.use('/photos', photoRoutes);
baseRoutes.use('/users', userRoutes);
baseRoutes.use('/images', imageRoutes);
baseRoutes.use('/orders', orderRoutes);
baseRoutes.use('/products', productRoutes);
baseRoutes.use('/videos', videoRoutes);
baseRoutes.use('/songs', songRoutes);
baseRoutes.use('/country', countryRoutes);
baseRoutes.use('/team', teamRoutes);


export default baseRoutes;