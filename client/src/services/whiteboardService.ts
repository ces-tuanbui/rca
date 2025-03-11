import api from './api';
import { Node, Edge } from 'reactflow';

export interface Whiteboard {
  _id: string;
  name: string;
  nodes: Node[];
  edges: Edge[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateWhiteboardDto {
  name: string;
  nodes?: Node[];
  edges?: Edge[];
}

export interface UpdateWhiteboardDto {
  name?: string;
  nodes?: Node[];
  edges?: Edge[];
}

// Get all whiteboards
export const getAllWhiteboards = async (): Promise<Whiteboard[]> => {
  const response = await api.get('/api/whiteboards');
  return response.data;
};

// Get a whiteboard by ID
export const getWhiteboardById = async (id: string): Promise<Whiteboard> => {
  const response = await api.get(`/api/whiteboards/${id}`);
  return response.data;
};

// Create a new whiteboard
export const createWhiteboard = async (data: CreateWhiteboardDto): Promise<Whiteboard> => {
  const response = await api.post('/api/whiteboards', data);
  return response.data;
};

// Update a whiteboard
export const updateWhiteboard = async (id: string, data: UpdateWhiteboardDto): Promise<Whiteboard> => {
  const response = await api.put(`/api/whiteboards/${id}`, data);
  return response.data;
};

// Delete a whiteboard
export const deleteWhiteboard = async (id: string): Promise<void> => {
  await api.delete(`/api/whiteboards/${id}`);
}; 