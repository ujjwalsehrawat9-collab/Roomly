const mongoose = require('mongoose');
const Listing = require('../models/listing');
const MONGO_URL = process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/Locasa';

(async function(){
  try{
    await mongoose.connect(MONGO_URL);
    const updates = [
      {title: 'Amazing Pool Villa in Bali', url: 'https://images.unsplash.com/photo-1505691723518-36a3d6a9a3b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'},
      {title: 'Beachside Rooms Retreat', url: 'https://images.unsplash.com/photo-1505691723518-36a3d6a9a3b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'}
    ];
    for(const u of updates){
      const l = await Listing.findOne({title: u.title});
      if(l){
        l.image = l.image || {};
        l.image.url = u.url;
        await l.save();
        console.log('Updated', u.title);
      } else {
        console.log('Not found:', u.title);
      }
    }
    await mongoose.disconnect();
  }catch(err){
    console.error(err);
    process.exit(1);
  }
})();
