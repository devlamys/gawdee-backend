import { Schema, model } from 'mongoose';

const heroSectionSchema = new Schema({
  image: { 
    type: String, 
    required: true, 
},
});

const ResponsiveHeroSection = model('ResponsiveHeroSection', heroSectionSchema);

export default ResponsiveHeroSection;
