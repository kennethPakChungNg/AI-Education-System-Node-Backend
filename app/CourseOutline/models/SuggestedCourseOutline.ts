import mongoose from 'mongoose';

const collectionName = 'suggestedCourseOutline';

const suggestedCourseOutlineSchema = new mongoose.Schema(
  {
    courseName: String,
    courseOutline: Object
  },
  {
    collection: collectionName
  }
);

const db_related = mongoose.connection.useDb("aiEducation");
const SuggestedCourseOutline = db_related.model(collectionName, suggestedCourseOutlineSchema);

export { SuggestedCourseOutline };