import mongoose, { Document, Schema } from 'mongoose';

// Interfaces
export interface IPosition {
  x: number;
  y: number;
}

export interface INode extends Document {
  id: string;
  type: string;
  position: IPosition;
  data: any;
  style?: any;
}

export interface IEdge extends Document {
  id: string;
  source: string;
  target: string;
  type?: string;
  animated?: boolean;
  style?: any;
  data?: any;
}

export interface IWhiteboard extends Document {
  name: string;
  description?: string;
  nodes: INode[];
  edges: IEdge[];
  createdBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Node schema for React Flow nodes
const nodeSchema = new Schema<INode>({
  id: { type: String, required: true },
  type: { type: String, required: true },
  position: {
    x: { type: Number, required: true },
    y: { type: Number, required: true }
  },
  data: { type: Schema.Types.Mixed, default: {} },
  style: { type: Schema.Types.Mixed, default: {} }
});

// Edge schema for React Flow edges
const edgeSchema = new Schema<IEdge>({
  id: { type: String, required: true },
  source: { type: String, required: true },
  target: { type: String, required: true },
  type: { type: String, default: 'default' },
  animated: { type: Boolean, default: false },
  style: { type: Schema.Types.Mixed, default: {} },
  data: { type: Schema.Types.Mixed, default: {} }
});

// Whiteboard schema
const whiteboardSchema = new Schema<IWhiteboard>({
  name: { type: String, required: true },
  description: { type: String, default: '' },
  nodes: [nodeSchema],
  edges: [edgeSchema],
  createdBy: { type: String, default: 'anonymous' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model<IWhiteboard>('Whiteboard', whiteboardSchema); 