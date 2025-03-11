import { FilterQuery, Query } from "mongoose";

class Queryuilder<T> {
  public queryModel: Query<T[], T>;
  public query: Record<string, unknown>;

  constructor(queryModel: Query<T[], T>, query: Record<string, unknown>) {
    this.queryModel = queryModel;
    this.query = query;
  }

  // ! for searching
  search(searchableFiels: string[]) {
    let searchTerm = this.query?.searchTerm;

    if (searchTerm) {
      this.queryModel = this.queryModel.find({
        $or: searchableFiels.map(
          (field) =>
            ({
              [field]: { $regex: searchTerm, $options: "i" },
            }) as FilterQuery<T>
        ),
      });
    }
    return this;
  }

  //   ! filter
  filter() {
    const queryObj = { ...this.query };

    const excludedQueryField = [
      "searchTerm",
      "sort",
      "limit",
      "page",
      "fields",
    ];

    excludedQueryField.forEach((value) => delete queryObj[value]);
    this.queryModel = this.queryModel.find(queryObj as FilterQuery<T>);

    return this;
  }

  //   ! sorting
  sort() {
    const sort =
      (this.query?.sort as string)?.split(",").join(" ") || "-createdAt";

    this.queryModel = this.queryModel.sort(sort as string);

    return this;
  }

  // ! pagination
  pagination() {
    const limit = Number(this.query?.limit) || 10;
    const page = Number(this.query?.page) || 1;
    const skip = (page - 1) * limit;
    this.queryModel = this.queryModel.skip(skip).limit(limit);
    return this;
  }

  // ! field
  field() {
    const fields =
      (this.query?.fields as string)?.split(",").join(" ") || "-__v";

    this.queryModel = this.queryModel.select(fields);
    return this;
  }

  //
}

export default Queryuilder;
