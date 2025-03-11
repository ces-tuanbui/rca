import { Node, Edge } from 'reactflow';

export interface Whiteboard {
  _id: string;
  name: string;
  nodes: Node[];
  edges: Edge[];
  createdAt: string;
  updatedAt: string;
} 