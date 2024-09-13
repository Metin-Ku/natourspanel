class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    const queryObj = { ...this.queryString };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((el) => delete queryObj[el]);

    // 1A) Simple string matching (like: /api/v1/tours?name=*Seven Hills*)
    Object.keys(queryObj).forEach((key) => {
      if (typeof queryObj[key] === 'string' && queryObj[key].includes('*')) {
        queryObj[key] = {
          $regex: queryObj[key].replace(/\*/g, '.*'),
          $options: 'i',
        };
      }
    });

    // 1B) Advanced filtering
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    this.query = this.query.find(JSON.parse(queryStr));

    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
      // *** sortlarken price'ı aynı olan iki obje olursa ratingsAverage'ı da dahil ederek sortla
      // sort('price ratingsAverage')
    } else {
      this.query = this.query.sort('-createdAt');
    }

    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields);
      // gelen request datasında sadece fieldslar gözüksün
    } else {
      this.query = this.query.select('-__v');
      // __v yi client'a gösterme
    }

    return this;
  }

  paginate() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 100;
    const skip = (page - 1) * limit;
    // page=2&limit=10, 1-10 for page 1, 11-20 for page 2, 21-30 for page 3
    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}

module.exports = APIFeatures;
