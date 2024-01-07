class ApiFeatures {
  constructor(query, queryStr) {
    (this.query = query), (this.queryStr = queryStr);
  }
  search() {
    const keyword = this.queryStr.keyword
      ? {
          name: {
            $regex: this.queryStr.keyword,
            $options: "i",
          },
        }
      : {};
    this.query = this.query.find({ ...keyword });
    return this;
  }

  filter() {
    const querycopy = { ...this.queryStr };
    const removefield = ["keyword", "page", "limit"];
    removefield.forEach((key) => delete querycopy[key]);

    // filter for price and rating
    let querystr = JSON.stringify(querycopy);
    const update = querystr.replace(/\b(gt|gte|lt|lte)\b/g, (key) => `$${key}`);
    this.query = this.query.find(JSON.parse(update));
    return this;
  }
  pagination(perpage) {
    const currentPage = Number(this.queryStr.page) || 1;
    const skip = perpage * (currentPage - 1);
    this.query = this.query.limit(perpage).skip(skip);
    return this;
  }
}

module.exports = ApiFeatures;
