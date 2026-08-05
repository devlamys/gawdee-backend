import { Schema, model } from 'mongoose';

const bannerSchema = new Schema({
  image: { 
    type: String, 
    required: true, 
},
});

const Banner = model('Banner', bannerSchema);

export default Banner;
