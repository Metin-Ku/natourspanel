const fs = require('fs');
const path = require('path');
const catchAsync = require('../utils/catchAsync');
const APIFeatures = require('../utils/apiFeatures');
const AppError = require('../utils/appError');

exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc) {
      return next(new AppError('No document found with that ID', 404));
    }

    res.status(204).json({
      status: 'success',
      data: null,
    });
  });

exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!doc) {
      return next(new AppError('No document found with that ID', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        data: doc,
      },
    });
  });

exports.deleteImage = (Model, folder) =>
  catchAsync(async (req, res, next) => {
    const { images } = req.body;
    const { imageDeleted } = req.body;

    const newImages = images.filter((image) => image !== imageDeleted);
    const doc = await Model.findByIdAndUpdate(
      req.params.id,
      { images: newImages },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!doc) {
      return next(new AppError('No document found with that ID', 404));
    }

    const imagePath = imageDeleted;
    const thumbPath = path.join(
      __dirname,
      `../public/img/${folder}/thumb`,
      imagePath,
    );
    const smallPath = path.join(
      __dirname,
      `../public/img/${folder}/small`,
      imagePath,
    );
    const mediumPath = path.join(
      __dirname,
      `../public/img/${folder}/medium`,
      imagePath,
    );
    const largePath = path.join(
      __dirname,
      `../public/img/${folder}/large`,
      imagePath,
    );
    const originalPath = path.join(
      __dirname,
      `../public/img/${folder}/original`,
      imagePath,
    );

    fs.unlink(thumbPath, (err) => {
      if (err) {
        return next(new AppError('Image deletion failed', 500));
      }
    });
    fs.unlink(smallPath, (err) => {
      if (err) {
        return next(new AppError('Image deletion failed', 500));
      }
    });
    fs.unlink(mediumPath, (err) => {
      if (err) {
        return next(new AppError('Image deletion failed', 500));
      }
    });
    fs.unlink(largePath, (err) => {
      if (err) {
        return next(new AppError('Image deletion failed', 500));
      }
    });
    fs.unlink(originalPath, (err) => {
      if (err) {
        return next(new AppError('Image deletion failed', 500));
      }
    });

    res.status(200).json({
      status: 'success',
      data: {
        data: doc,
      },
    });
  });

exports.deleteAllImages = (Model, folder) =>
  catchAsync(async (req, res, next) => {
    // console.log('---------req.params.id---------');
    // console.log(req.params.id);
    // console.log('---------req.params.id---------');
    // const { images } = req.body;
    // const { imageDeleted } = req.body;

    // const newImages = images.filter((image) => image !== imageDeleted);
    const doc = await Model.findById(req.params.id);

    if (!doc) {
      return next(new AppError('No document found with that ID', 404));
    }

    const { images } = doc;
    const { imageCover } = doc;

    if (imageCover) {
      const imagePath = imageCover;

      const thumbPath = path.join(
        __dirname,
        `../public/img/${folder}/thumb`,
        imagePath,
      );
      const smallPath = path.join(
        __dirname,
        `../public/img/${folder}/small`,
        imagePath,
      );
      const mediumPath = path.join(
        __dirname,
        `../public/img/${folder}/medium`,
        imagePath,
      );
      const largePath = path.join(
        __dirname,
        `../public/img/${folder}/large`,
        imagePath,
      );
      const originalPath = path.join(
        __dirname,
        `../public/img/${folder}/original`,
        imagePath,
      );

      if (thumbPath) {
        fs.unlink(thumbPath, (err) => {
          // if (err) {
          //   return next(new AppError('Image deletion failed', 500));
          // }
        });
      }
      if (smallPath) {
        fs.unlink(smallPath, (err) => {});
      }
      if (mediumPath) {
        fs.unlink(mediumPath, (err) => {});
      }
      if (largePath) {
        fs.unlink(largePath, (err) => {});
      }
      if (originalPath) {
        fs.unlink(originalPath, (err) => {});
      }
    }

    if (images) {
      images.forEach((image) => {
        const imagePath = image;

        const thumbPath = path.join(
          __dirname,
          `../public/img/${folder}/thumb`,
          imagePath,
        );
        const smallPath = path.join(
          __dirname,
          `../public/img/${folder}/small`,
          imagePath,
        );
        const mediumPath = path.join(
          __dirname,
          `../public/img/${folder}/medium`,
          imagePath,
        );
        const largePath = path.join(
          __dirname,
          `../public/img/${folder}/large`,
          imagePath,
        );
        const originalPath = path.join(
          __dirname,
          `../public/img/${folder}/original`,
          imagePath,
        );

        if (thumbPath) {
          fs.unlink(thumbPath, (err) => {});
        }
        if (smallPath) {
          fs.unlink(smallPath, (err) => {});
        }
        if (mediumPath) {
          fs.unlink(mediumPath, (err) => {});
        }
        if (largePath) {
          fs.unlink(largePath, (err) => {});
        }
        if (originalPath) {
          fs.unlink(originalPath, (err) => {});
        }
      });
    }

    next();
  });

exports.createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.create(req.body);
    res.status(201).json({
      status: 'success',
      data: {
        data: doc,
      },
    });
  });

exports.getOne = (Model, popOptions) =>
  catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if (popOptions) query = query.populate(popOptions);
    const doc = await query;
    
    if (!doc) {
      return next(new AppError('No document found with that ID', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        data: doc,
      },
    });
  });

exports.getAll = (Model) =>
  catchAsync(async (req, res, next) => {
    // To allow for nested GET reviews on tour
    let filter = {};
    // id varsa o review'a ulaş yoksa bütün review'ları getir
    if (req.params.tourId) filter = { tour: req.params.tourId };

    const features = new APIFeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const doc = await features.query;
    // explain executionStats field'ı oluşturuyor. Kaç dosya tarandı kaç tanesi döndü gibi bilgiler veriyor
    // const doc = await features.query.explain();
    
    res.status(200).json({
      status: 'success',
      results: doc.length,
      data: doc,
    });
  });

// exports.getCoverImage = (Model) =>
// catchAsync(async (req, res, next) => {
//   let query = Model.findById(req.params.id);
//   if (popOptions) query = query.populate(popOptions);
//   const doc = await query;

//   if (!doc) {
//     return next(new AppError('No image found', 404));
//   }

//   res.status(200).json({
//     status: 'success',
//     data: {
//       data: doc,
//     },
//   });
// });
