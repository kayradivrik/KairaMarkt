import mongoose from 'mongoose';

const customerSegmentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, default: '' },
    ruleType: { type: String, default: 'manual' }, // manual / automatic
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model('CustomerSegment', customerSegmentSchema);

