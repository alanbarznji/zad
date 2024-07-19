class Feature {
  constructor(mongooseDb, query) {
    this.mongooseDb = mongooseDb;

    this.query = query;
  }
  filter() {
    const query = { ...this.query };
    const exclude = ["page", "fields", "limit", "sort", "keyword"];
    exclude.forEach((value) => {
      delete query[value];
    });
    // console.log(query)
    let queryStr = JSON.stringify(query);
    let querysStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (mach) => {
      return `$${mach}`;
    });
    this.mongooseDb = this.mongooseDb.find(JSON.parse(querysStr));
    return this;
  }
  sort() {
    if (this.query.sort) {
      console.log(this.query.sort);
      const sort = this.query.sort;
      console.log(sort.replace(",", " "));
      this.mongooseDb = this.mongooseDb.sort(sort.replace(",", " "));
    } else {
      this.mongooseDb = this.mongooseDb.sort("-createdAt");
    }
    return this;
  }
  fields() { 
    if (this.query.fields) {
      console.log(this.query.fields);
      let fields = this.query.fields.replace(",", " ");
      console.log(fields);
      this.mongooseDb = this.mongooseDb.select(fields);
    } else {
      this.mongooseDb = this.mongooseDb.select("-__v");
    }
    return this;
  }
  search() {
    if (this.query.keyword) {
      let query = {};
        query.$or = [
          { name: { $regex: this.query.keyword, $options: "i" } },
          { description: { $regex: this.query.keyword, $options: "i" } },
        ];
      
      this.mongooseDb = this.mongooseDb.find(query);
    }
    return this;
  }
  // if (this.query.keyword) {
  //   const keyword = this.query.keyword;
  //   this.mongooseDb.or([
  //     { name: { $regex: new RegExp(keyword, "i") } },
  //     { description: { $regex: new RegExp(keyword, "i") } },
  //   ]);
  //   console.log(keyword);
  //   this.mongooseQuery = this.mongooseQuery.find(keyword);
  // }
  //      if (this.query.keyword) {
  //    let query = {
  //  }
  //     query.$or = [
  //      { name: { $regex: this.query.keyword, $options: "i" } },
  //      { description: { $regex: this.query.keyword, $options: "i" } },
  //    ]
  //    console.log(query);

 paginate(countDocuments) {
  console.log();
    const page = this.query.page * 1 || 1;
    const limit = this.query.limit * 1 || 50;
    const skip = (page - 1) * limit;
    const endIndex = page * limit;

    // Pagination result
    const pagination = {};
    pagination.currentPage = page;
    pagination.limit = limit;
    pagination.numberOfPages = Math.ceil(countDocuments / limit);

    // next page
    if (endIndex < countDocuments) {
      pagination.next = page + 1;
    }
    if (skip > 0) {
      pagination.prev = page - 1;
    }
    this.mongooseDb = this.mongooseDb.skip(skip).limit(limit);

    this.paginationResult = pagination;
    return this;
  }
}
module.exports = Feature;