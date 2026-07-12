import mongoose from "mongoose";

const convertToMongoId = (str: string): mongoose.Types.ObjectId => {
  return new mongoose.Types.ObjectId(str);
};

export default convertToMongoId;
