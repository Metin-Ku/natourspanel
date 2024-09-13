const fs = require('fs');
const multer = require('multer');
const sharp = require('sharp');
const Slider = require('../models/sliderModel');
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

exports.uploadSliderImages = upload.fields([
  { name: 'imageOriginal', maxCount: 1 },
  { name: 'imageLarge', maxCount: 1 },
  { name: 'imageMedium', maxCount: 1 },
  { name: 'imageSmall', maxCount: 1 },
]);

exports.resizeSliderImages = catchAsync(async (req, res, next) => {
  if (!req.files) return next();

  if (req.files.imageOriginal) {
    const imageOriginal = await Slider.findById(req.params.id).select(
      'imageOriginal',
    );

    if (imageOriginal) {
      fs.unlink(
        `public/img/sliders/original/${imageOriginal.imageOriginal}`,
        () => {},
      );
      fs.unlink(
        `public/img/sliders/thumb/${imageOriginal.imageOriginal}`,
        () => {},
      );
    }
    req.body.imageOriginal = `slider-${Date.now()}.jpeg`;
    await sharp(req.files.imageOriginal[0].buffer)
      .resize(2000, 1333)
      .toFormat('jpeg')
      .jpeg({ quality: 90 })
      .toFile(`public/img/sliders/original/${req.body.imageOriginal}`);

    await sharp(req.files.imageOriginal[0].buffer)
      .resize(100, 100)
      .toFormat('jpeg')
      .jpeg({ quality: 90 })
      .toFile(`public/img/sliders/thumb/${req.body.imageOriginal}`);
  }
  if (req.files.imageLarge) {
    const imageLarge = await Slider.findById(req.params.id).select(
      'imageLarge',
    );
    if (imageLarge) {
      fs.unlink(`public/img/sliders/large/${imageLarge.imageLarge}`, () => {});
    }
    req.body.imageLarge = `slider-${Date.now()}.jpeg`;
    await sharp(req.files.imageLarge[0].buffer)
      .resize(1280, 800)
      .toFormat('jpeg')
      .jpeg({ quality: 90 })
      .toFile(`public/img/sliders/large/${req.body.imageLarge}`);
  }
  if (req.files.imageMedium) {
    const imageMedium = await Slider.findById(req.params.id).select(
      'imageMedium',
    );
    if (imageMedium) {
      fs.unlink(
        `public/img/sliders/medium/${imageMedium.imageMedium}`,
        () => {},
      );
    }
    req.body.imageMedium = `slider-${Date.now()}.jpeg`;
    await sharp(req.files.imageMedium[0].buffer)
      .resize(768, 1024)
      .toFormat('jpeg')
      .jpeg({ quality: 90 })
      .toFile(`public/img/sliders/medium/${req.body.imageMedium}`);
  }
  if (req.files.imageSmall) {
    const imageSmall = await Slider.findById(req.params.id).select(
      'imageSmall',
    );

    if (imageSmall) {
      fs.unlink(`public/img/sliders/small/${imageSmall.imageSmall}`, () => {});
    }
    req.body.imageSmall = `slider-${Date.now()}.jpeg`;
    await sharp(req.files.imageSmall[0].buffer)
      .resize(480, 640)
      .toFormat('jpeg')
      .jpeg({ quality: 90 })
      .toFile(`public/img/sliders/small/${req.body.imageSmall}`);
  }

  next();
});

/* 
exports.resizeSliderImages = catchAsync(async (req, res, next) => {
  if (!req.files) return next();

  // 1) Cover image
  if (req.files.imageCover) {
    const imageCoverSize = await ImageSize.findOne({
      name: 'imageCover',
      folder: 'sliders',
    })
      .select('-_id')
      .select('-name')
      .select('-folder');

    const imageCover = await Slider.findById(req.params.id).select('imageCover');
    const dateNow = Date.now();

    await Promise.all(
      Object.entries(imageCoverSize.toObject()).map(async ([folder, size]) => {
        if (!size) return;
        const [width, height] = size.split('x').map(Number);

        if (imageCover) {
          const imagePath = `public/img/sliders/${folder}/${imageCover.imageCover}`;
          fs.unlink(imagePath, () => {});
        }

        req.body.imageCover = `slider-${dateNow}.jpeg`;

        // görseli kırpma
        // 2000, 1333 => 2/3 ratio kullanımı yaygın
        await sharp(req.files.imageCover[0].buffer)
          .resize(width, height)
          .toFormat('jpeg')
          .jpeg({ quality: 90 })
          .toFile(`public/img/sliders/${folder}/${req.body.imageCover}`);
      }),
    );
  }

  if (req.files.images) {
    const imagesSize = await ImageSize.findOne({
      name: 'images',
      folder: 'sliders',
    })
      .select('-_id')
      .select('-name')
      .select('-folder');

    const dateNow = Date.now();
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
      return next(new AppError('You can upload up to 3 images.', 400));
    }

    await Promise.all(
      req.files.images.map(async (file, i) => {
        const filename = `slider-${dateNow}-${i + 1}.jpeg`;

        await Promise.all(
          Object.entries(imagesSize.toObject()).map(async ([folder, size]) => {
            if (!size) return;

            const [width, height] = size.split('x').map(Number);

            // const filename = `slider-${req.params.id}-${Date.now()}-${i + 1}.jpeg`;

            await sharp(file.buffer)
              .resize(width, height)
              .toFormat('jpeg')
              .jpeg({ quality: 90 })
              .toFile(`public/img/sliders/${folder}/${filename}`);

            // Veritabanına eklemek yerine, images dizisine ekleyelim
          }),
        );

        req.body.images.push(filename);
      }),
    );
  }
  // ikiside çalışıyor
  // for (let i = 0; i < req.files.images.length; i++) {
  //   const filename = `slider-${req.params.id}-${Date.now()}-${i + 1}.jpeg`;

  //   await sharp(req.files.images[i].buffer) // Use 'images[i]' instead of 'imageCover[0]'
  //     .resize(2000, 1333)
  //     .toFormat('jpeg')
  //     .jpeg({ quality: 90 })
  //     .toFile(`public/img/sliders/${filename}`);

  //   req.body.images.push(filename);
  // }

  next();
});
*/

exports.getAllSliders = factory.getAll(Slider);
exports.getSlider = factory.getOne(Slider, { path: 'reviews' });
exports.createSlider = factory.createOne(Slider);
exports.updateSlider = factory.updateOne(Slider);
exports.deleteSliderImage = factory.deleteImage(Slider, 'sliders');
exports.deleteAllImages = factory.deleteAllImages(Slider, 'sliders');
exports.deleteSlider = factory.deleteOne(Slider);
