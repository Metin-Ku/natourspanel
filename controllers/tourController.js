const fs = require('fs');
const multer = require('multer');
const sharp = require('sharp');
const Tour = require('../models/tourModel');
const ImageSize = require('../models/imageSizeModel');
// const APIFeatures = require('../utils/apiFeatures');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const factory = require('./handlerFactory');

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! Please upload only images.', 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.uploadTourImages = upload.fields([
  { name: 'imageCover', maxCount: 1 },
  { name: 'images', maxCount: 3 },
]);

// // saderce image alanı tek resim olarak olsaydı
// upload.single('image') => req.file
// // sadece images alanı çok resimli olarak olsaydı
// upload.array('images', 5) => req.files

// exports.resizeTourImages = catchAsync(async (req, res, next) => {
//   if (!req.files.imageCover || !req.files.images) next();

//   // 1) Cover image
//   req.body.imageCover = `tour-${req.params.id}-${Date.now()}-cover.jpeg`;
//   // görseli kırpma
//   // 2000, 1333 => 2/3 ratio kullanımı yaygın
//   await sharp(req.files.imageCover[0].buffer)
//     .resize(2000, 1333)
//     .toFormat('jpeg')
//     .jpeg({ quality: 90 })
//     .toFile(`public/img/tours/${req.body.imageCover}`);

//   // 2) Images
//   req.body.images = [];

//   await Promise.all(
//     req.files.images.map(async (file, i) => {
//       const filename = `tour-${req.params.id}-${Date.now()}-${i + 1}.jpeg`;

//       await sharp(file.buffer)
//         .resize(2000, 1333)
//         .toFormat('jpeg')
//         .jpeg({ quality: 90 })
//         .toFile(`public/img/tours/${filename}`);

//       req.body.images.push(filename);
//     }),
//   );

//   next();
// });

exports.resizeTourImages = catchAsync(async (req, res, next) => {
  if (!req.files) return next();

  // 1) Cover image
  if (req.files.imageCover) {
    const imageCover = await Tour.findById(req.params.id).select('imageCover');
    if (imageCover) {
      fs.unlink(`public/img/tours/original/${imageCover.imageCover}`, () => {});
      fs.unlink(`public/img/tours/thumb/${imageCover.imageCover}`, () => {});
    }
    // req.body.imageCover = `tour-${req.params.id}-${Date.now()}-cover.jpeg`;
    req.body.imageCover = `tour-${Date.now()}-cover.jpeg`;
    // görseli kırpma
    // 2000, 1333 => 2/3 ratio kullanımı yaygın
    await sharp(req.files.imageCover[0].buffer)
      // .resize(2000, 1333)
      .toFormat('jpeg')
      .jpeg({ quality: 90 })
      .toFile(`public/img/tours/original/${req.body.imageCover}`);
      
    await sharp(req.files.imageCover[0].buffer)
      .resize(100, 100)
      .toFormat('jpeg')
      .jpeg({ quality: 90 })
      .toFile(`public/img/tours/thumb/${req.body.imageCover}`);
  }

  if (req.files.images) {
    // 2) Images
    // req.body.images = [];
    if (
      req.body.images === undefined ||
      req.body.images === null ||
      req.body.images.length === 0
    ) {
      req.body.images = [];
    }
    if (!Array.isArray(req.body.images)) {
      req.body.images = [req.body.images];
    }
    if (req.files.images.length > 3) {
      return next(new AppError('En fazla 3 resim yükleyebilirsiniz.', 400));
    }

    await Promise.all(
      req.files.images.map(async (file, i) => {
        // const filename = `tour-${req.params.id}-${Date.now()}-${i + 1}.jpeg`;
        const filename = `tour-${Date.now()}-${i + 1}.jpeg`;

        await sharp(file.buffer)
          // .resize(2000, 1333)
          .toFormat('jpeg')
          .jpeg({ quality: 90 })
          .toFile(`public/img/tours/original/${filename}`);

        req.body.images.push(filename);
      }),
    );
  }
  // ikiside çalışıyor
  // for (let i = 0; i < req.files.images.length; i++) {
  //   const filename = `tour-${req.params.id}-${Date.now()}-${i + 1}.jpeg`;

  //   await sharp(req.files.images[i].buffer) // Use 'images[i]' instead of 'imageCover[0]'
  //     .resize(2000, 1333)
  //     .toFormat('jpeg')
  //     .jpeg({ quality: 90 })
  //     .toFile(`public/img/tours/${filename}`);

  //   req.body.images.push(filename);
  // }

  next();
});

// exports.resizeTourImages = catchAsync(async (req, res, next) => {
//   if (!req.files) return next();

//   // 1) Cover image
//   if (req.files.imageCover) {
//     const imageCoverSize = await ImageSize.findOne({
//       name: 'imageCover',
//       folder: 'tours',
//     })
//       .select('-_id')
//       .select('-name')
//       .select('-folder');

//     const imageCover = await Tour.findById(req.params.id).select('imageCover');
//     const dateNow = Date.now();

//     await Promise.all(
//       Object.entries(imageCoverSize.toObject()).map(async ([folder, size]) => {
//         if (!size) return;
//         const [width, height] = size.split('x').map(Number);

//         if (imageCover) {
//           const imagePath = `public/img/tours/${folder}/${imageCover.imageCover}`;
//           fs.unlink(imagePath, () => {});
//         }

//         req.body.imageCover = `tour-${dateNow}-cover.jpeg`;

//         // görseli kırpma
//         // 2000, 1333 => 2/3 ratio kullanımı yaygın
//         await sharp(req.files.imageCover[0].buffer)
//           .resize(width, height)
//           .toFormat('jpeg')
//           .jpeg({ quality: 90 })
//           .toFile(`public/img/tours/${folder}/${req.body.imageCover}`);
//       }),
//     );
//   }

//   if (req.files.images) {
//     const imagesSize = await ImageSize.findOne({
//       name: 'images',
//       folder: 'tours',
//     })
//       .select('-_id')
//       .select('-name')
//       .select('-folder');

//     const dateNow = Date.now();
//     // 2) Images
//     // req.body.images = [];
//     if (
//       req.body.images === undefined ||
//       req.body.images === null ||
//       req.body.images.length === 0
//     ) {
//       req.body.images = [];
//     }
//     if (!Array.isArray(req.body.images)) {
//       req.body.images = [req.body.images];
//     }
//     if (req.files.images.length > 3) {
//       return next(new AppError('You can upload up to 3 images.', 400));
//     }

//     await Promise.all(
//       req.files.images.map(async (file, i) => {
//         const filename = `tour-${dateNow}-${i + 1}.jpeg`;

//         await Promise.all(
//           Object.entries(imagesSize.toObject()).map(async ([folder, size]) => {
//             if (!size) return;

//             const [width, height] = size.split('x').map(Number);

//             // const filename = `tour-${req.params.id}-${Date.now()}-${i + 1}.jpeg`;

//             await sharp(file.buffer)
//               .resize(width, height)
//               .toFormat('jpeg')
//               .jpeg({ quality: 90 })
//               .toFile(`public/img/tours/${folder}/${filename}`);

//             // Veritabanına eklemek yerine, images dizisine ekleyelim
//           }),
//         );

//         req.body.images.push(filename);
//       }),
//     );
//   }
//   // ikiside çalışıyor
//   // for (let i = 0; i < req.files.images.length; i++) {
//   //   const filename = `tour-${req.params.id}-${Date.now()}-${i + 1}.jpeg`;

//   //   await sharp(req.files.images[i].buffer) // Use 'images[i]' instead of 'imageCover[0]'
//   //     .resize(2000, 1333)
//   //     .toFormat('jpeg')
//   //     .jpeg({ quality: 90 })
//   //     .toFile(`public/img/tours/${filename}`);

//   //   req.body.images.push(filename);
//   // }

//   next();
// });

// middleware
exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

// exports.getAllTours = catchAsync(async (req, res, next) => {
//   // console.log(req.requestTime);
//   // BUILD QUERY
//   // 1A) Filtering
//   // const queryObj = { ...req.query };
//   // const excludedFields = ['page', 'sort', 'limit', 'fields'];
//   // excludedFields.forEach((el) => delete queryObj[el]);

//   // // 1B) Advanced filtering
//   // let queryStr = JSON.stringify(queryObj);
//   // queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

//   // // Yukardakiyle aynı işlevi görüyor. Mongoose'un özelliği
//   // // const tours = await Tour.find()
//   // //   .where('duration')
//   // //   .equals(5)
//   // //   .where('difficulty')
//   // //   .equalty('easy');

//   // let query = Tour.find(JSON.parse(queryStr));

//   // 2) Sorting
//   // if (req.query.sort) {
//   //   const sortBy = req.query.sort.split(',').join(' ');
//   //   query = query.sort(sortBy);
//   //   // *** sortlarken price'ı aynı olan iki obje olursa ratingsAverage'ı da dahil ederek sortla
//   //   // sort('price ratingsAverage')
//   // } else {
//   //   query = query.sort('-createdAt');
//   // }

//   // 3) Limiting

//   // if (req.query.fields) {
//   //   const fields = req.query.fields.split(',').join(' ');
//   //   query = query.select(fields);
//   //   // gelen request datasında sadece fieldslar gözüksün
//   // } else {
//   //   query = query.select('-__v');
//   //   // __v yi client'a gösterme
//   // }

//   // 4) Pagination

//   // const page = req.query.page * 1 || 1;
//   // const limit = req.query.limit * 1 || 100;
//   // const skip = (page - 1) * limit;
//   // // page=2&limit=10, 1-10 for page 1, 11-20 for page 2, 21-30 for page 3
//   // query = query.skip(skip).limit(limit);

//   // if (req.query.page) {
//   //   const numTours = await Tour.countDocuments();
//   //   if (skip >= numTours) throw new Error('This page does not exist');
//   // }

//   // EXECUTE QUERY
//   // Tour.find() koleksiyondaki tüm belgeleri çeker(query object)
//   // filter() APIFeatures methodu
//   const features = new APIFeatures(Tour.find(), req.query)
//     .filter()
//     .sort()
//     .limitFields()
//     .paginate();

//   const tours = await features.query;
//   // Yukardaki tüm işlemlerin özeti
//   // query.sort().select().skip().limit()
//   res.status(200).json({
//     status: 'success',
//     // requestedAt: req.requestTime,
//     results: tours.length,
//     data: {
//       tours,
//     },
//   });
// });

// exports.getTour = catchAsync(async (req, res, next) => {
//   const tour = await Tour.findById(req.params.id).populate('reviews');

//   // yukardaki fieldları çekerken göstermesin. "-" işareti unselect oluyor
//   // Tour.findById(req.params.id) => Tour.findOne({ _id: req.params.id })

//   if (!tour) {
//     return next(new AppError('No tour found with that ID', 404));
//   }

//   res.status(200).json({
//     status: 'success',
//     data: {
//       tour,
//     },
//   });
// });

// utils'e taındı
// const catchAsync = (fn) => (req, res, next) => {
//   fn(req, res, next).catch((err) => next(err));
// };

// exports.createTour = catchAsync(async (req, res, next) => {
//   console.log(req.body);
//   const newTour = await Tour.create(req.body);

//   res.status(201).json({
//     status: 'success',
//     data: {
//       tour: newTour,
//     },
//   });
// });

exports.getAllTours = factory.getAll(Tour);
exports.getTour = factory.getOne(Tour, { path: 'reviews' });
exports.createTour = factory.createOne(Tour);
exports.updateTour = factory.updateOne(Tour);
exports.deleteTourImage = factory.deleteImage(Tour, 'tours');
exports.deleteAllImages = factory.deleteAllImages(Tour, 'tours');
exports.deleteTour = factory.deleteOne(Tour);

// exports.updateTour = catchAsync(async (req, res, next) => {
//   const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
//     new: true,
//     runValidators: true,
//   });

//   if (!tour) {
//     return next(new AppError('No tour found with that ID', 404));
//   }

//   res.status(200).json({
//     status: 'success',
//     data: {
//       tour,
//     },
//   });
// });

// exports.deleteTour = catchAsync(async (req, res, next) => {
//   const tour = await Tour.findByIdAndDelete(req.params.id);

//   if (!tour) {
//     return next(new AppError('No tour found with that ID', 404));
//   }

//   res.status(204).json({
//     status: 'success',
//     data: null,
//   });
// });

exports.getTourStats = catchAsync(async (req, res, next) => {
  const stats = await Tour.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } },
    },
    {
      $group: {
        _id: { $toUpper: '$difficulty' },
        // _id: '$difficulty',
        numTours: { $sum: 1 },
        numRatings: { $sum: '$ratingsQuantity' },
        avgRating: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
      },
    },
    {
      $sort: { avgPrice: -1 },
    },
    {
      $match: { _id: { $ne: 'EASY' } },
    },
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      stats,
    },
  });
});

exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
  const year = req.params.year * 1; // 2021-2022

  const plan = await Tour.aggregate([
    {
      $unwind: '$startDates',
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        numTourStarts: { $sum: 1 },
        tours: { $push: '$name' },
      },
    },
    {
      $addFields: { month: '$_id' },
    },
    {
      $project: {
        _id: 0,
      },
    },
    {
      $sort: { numTourStarts: -1 },
    },
    {
      $limit: 12,
    },
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      plan,
    },
  });
});

// /tours-within/:distance/center/:latlng/unit/:unit
// /tours-distance/233/center/34.127815,-118.128062/unit/km
exports.getToursWithin = catchAsync(async (req, res, next) => {
  const { distance, latlng, unit } = req.params;
  const [lat, lng] = latlng.split(',');

  // 3963.2 => Dünya'nın yarıçapı, mil olarak
  // 6378.1 => Dünya'nın yarıçapı, km olarak
  const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1;

  if (!lat || !lng) {
    next(
      new AppError(
        'Please provide latitutr and longitude in the format lat,lng.',
        400,
      ),
    );
  }

  const tours = await Tour.find({
    startLocation: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
  });

  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      data: tours,
    },
  });
});

exports.getDistances = catchAsync(async (req, res, next) => {
  const { latlng, unit } = req.params;
  const [lat, lng] = latlng.split(',');

  const multiplier = unit === 'mi' ? 0.000621371 : 0.001;

  if (!lat || !lng) {
    next(
      new AppError(
        'Please provide latitutr and longitude in the format lat,lng.',
        400,
      ),
    );
  }

  const distances = await Tour.aggregate([
    {
      $geoNear: {
        near: {
          type: 'Point',
          coordinates: [lng * 1, lat * 1],
        },
        distanceField: 'distance',
        distanceMultiplier: multiplier,
      },
    },
    {
      $project: {
        distance: 1,
        name: 1,
      },
    },
  ]);

  // *** $project sql'deki select gibi

  res.status(200).json({
    status: 'success',
    data: {
      data: distances,
    },
  });
});
