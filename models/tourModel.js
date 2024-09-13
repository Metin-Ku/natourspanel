const mongoose = require('mongoose');
const slugify = require('slugify');
// const User = require('./userModel');
// const validator = require('validator');

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: true,
      trim: true,
      maxlength: [40, 'A tour name mush have less or equal then 40 characters'],
      minlength: [10, 'A tour name mush have more or equal then 10 characters'],
      // validate: [validator.isAlpha, 'Tour name must only contain characters'],
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, 'A tour must have a duration'],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a group size'],
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have a difficulty'],
      enum: {
        values: ['Easy', 'Medium', 'Difficult'],
        message: 'Difficulty is either: easy, medium, difficult',
      },
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be below 5.0'],
      set: (val) => Math.round(val * 10) / 10,
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (val) {
          return val < this.price; // 100 < 200
          // *** this only point top current doc on NEW document creation
        },
        message: 'Discount price ({VALUE}) should be below regular price',
      },
    },
    summary: {
      type: String,
      trim: true,
      required: [true, 'A tour must have a summary'],
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a price'],
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: String,
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    // select: false ise clienta'gelen requestte gösterilmez. Şifre vb için kullanılabilir
    startDates: {
      type: [Date],
      default: Date.now(),
    },
    secretTour: {
      type: Boolean,
      default: false,
    },
    startLocation: {
      // GeoJSON
      type: {
        type: String,
        default: 'Point',
        enum: ['Point'],
      },
      coordinates: {
        type: [Number],
        default: [0, 0],
      },
      address: String,
      description: String,
    },
    locations: [
      {
        type: {
          type: String,
          default: 'Point',
          enum: ['Point'],
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number,
      },
    ],
    guides: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
      },
    ],
    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    toJSON: { virtuals: true },
    toOBject: { virtuals: true },
  },
);

// *** price'ı filterlarken sadece price'a bakıyor tüm dökümana değil. Buda performansı arttırıyor
// Write için değil ama read için arttırıyor. Write'ın çok yapıldığı collectionlarda kullanmak mantıklı olmayabilir
// bu indexleme _id için default olarak var
// tourSchema.index({price: 1})
// compound index iki ve ya daha fazla filtre beraber kullanıcaksa performans için mantıklı
tourSchema.index({ price: 1, ratingsAverage: -1 });
tourSchema.index({ slug: 1 });
tourSchema.index({ startLocation: '2dsphere' });

tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});

// Virtual populate. parent referencing var
// Bir tour'ın belki binlerce yorumu olabilir bu da sistemi yavaşlatır
// Bunun önüne geçmek için virtual kullanılıyor
tourSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'tour',
  localField: '_id',
});

// DOCUMENT MIDDLEWARE: runs before for only  .save() and .create()

tourSchema.pre('save', function (next) {
  // *** save etmöeden hemen önce alias oluşturuyorum
  this.slug = slugify(this.name, { lower: true });
  // tek middleware varsa next'e gerek yok ama alışkanlık olması için koymakta fayda var
  next();
});

// update slug during tour update
tourSchema.post(/^findOneAnd/, async (doc) => {
  if (doc) {
    const slugCheck = slugify(doc.name, { lower: true });
    if (doc.slug !== slugCheck) {
      await doc.save();
    }
  }
});

// embedded için yapılmıştı en son reference olarak yapınca alttakine gerek kalmadı
// tourSchema.pre('save', async function (next) {
//   const guidesPromises = this.guides.map(async (id) => await User.findById(id));
//   this.guides = await Promise.all(guidesPromises);
//   next();
// });

// tourSchema.pre('save', (next) => {
//   console.log('Will save document...');
//   next();
// });

// tourSchema.post('save', (doc, next) => {
//   console.log(doc);
//   next();
// });

// QUERY MIDDLEWARE
// tourSchema.pre('find', function (next) {
//   this.find({ secretTour: { $ne: true } });
//   next();
// });

// yukardaki kodda secretTour false olanlar getAllTours da gözükmüyordu fakat getTour da gözüküyordu
/*
tourSchema.pre(/^find/, function (next)) - Bu satır, find türündeki sorguları ele almak üzere 
bir ön middleware işlevi tanımlar. /^find/ ifadesi, "find" ile başlayan herhangi bir sorguyu 
eşleştirecektir. Örneğin, find, findOne, findOneAndUpdate gibi sorgu türleri bu kurala uyar.

Yani hem getAllTours için hem de getTour için çalışıyor
*/
tourSchema.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } });
  this.start = Date.now();
  next();
});

tourSchema.post(/^find/, function (docs, next) {
  console.log(`Query took ${Date.now() - this.start} milliseconds!`);
  // console.log(docs);
  next();
});
// aşağıdaki populate'i, getTour içinde kullanmıştım fakat başka yerlerde de kullanılacağı için ve duplicate olmaması için query middleware içine ekledim
/*
 const tour = await Tour.findById(req.params.id).  this.populate({
    path: 'guides',
    select: '-__v -passswordChangedAt',
  }); 
*/
tourSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'guides',
    select: '-__v -passswordChangedAt',
  });
  next();
});

// AGGREGATION MIDDLEWARE

// tourSchema.pre('aggregate', function (next) {
//   this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
//   console.log(this.pipeline);

//   next();
// });

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
