import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IAIGeneration extends Document {
  _id: Types.ObjectId;
  user: Types.ObjectId;
  prompt: string;
  result: string;
  wordLimit: number;
  createdAt: Date;
  updatedAt: Date;
}

const aiGenerationSchema = new Schema<IAIGeneration>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    prompt: {
      type: String,
      required: true,
    },
    result: {
      type: String,
      required: true,
    },
    wordLimit: {
      type: Number,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

const AIGeneration = mongoose.model<IAIGeneration>('AIGeneration', aiGenerationSchema);

export default AIGeneration; 