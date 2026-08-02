const mongoose = require('mongoose');
const Listing = require('../models/listing');

const MONGO_URL = process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/Locasa';

(async function(){
  try{
    await mongoose.connect(MONGO_URL);
    const listings = await Listing.find({}).lean();
    for(const l of listings){
      console.log(l.title, '->', l.image && l.image.url ? l.image.url : '[NO IMAGE]');
    }
    await mongoose.disconnect();
  }catch(err){
    console.error('Error:', err.message);
  }
})();
