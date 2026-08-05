import { Schema, model } from 'mongoose';

const quickfixSchema = new Schema({
  productId: { type: Schema.Types.ObjectId,  ref: "Product", required: true, },
  problemId: { type: Schema.Types.ObjectId, ref: "Problem", required: true},
  banner: {type: String}
});

const QuickFix = model('QuickFix', quickfixSchema);

export default QuickFix;
