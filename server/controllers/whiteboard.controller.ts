import { Request, Response } from 'express';
import Whiteboard, { IWhiteboard } from '../models/whiteboard.model';

// Get all whiteboards
export const getAllWhiteboards = async (req: Request, res: Response): Promise<void> => {
  try {
    const whiteboards = await Whiteboard.find({}, 'name description createdAt updatedAt');
    res.status(200).json(whiteboards);
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ message: 'Error fetching whiteboards', error: err.message });
  }
};

// Get a single whiteboard by ID
export const getWhiteboardById = async (req: Request, res: Response): Promise<void> => {
  try {
    const whiteboard = await Whiteboard.findById(req.params.id);
    if (!whiteboard) {
      res.status(404).json({ message: 'Whiteboard not found' });
      return;
    }
    res.status(200).json(whiteboard);
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ message: 'Error fetching whiteboard', error: err.message });
  }
};

// Create a new whiteboard
export const createWhiteboard = async (req: Request, res: Response): Promise<void> => {
  try {
    const newWhiteboard = new Whiteboard({
      name: req.body.name,
      description: req.body.description,
      nodes: req.body.nodes || [],
      edges: req.body.edges || [],
      createdBy: req.body.createdBy || 'anonymous'
    });
    
    const savedWhiteboard = await newWhiteboard.save();
    res.status(201).json(savedWhiteboard);
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ message: 'Error creating whiteboard', error: err.message });
  }
};

// Update a whiteboard
export const updateWhiteboard = async (req: Request, res: Response): Promise<void> => {
  try {
    const updatedWhiteboard = await Whiteboard.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        updatedAt: Date.now()
      },
      { new: true }
    );
    
    if (!updatedWhiteboard) {
      res.status(404).json({ message: 'Whiteboard not found' });
      return;
    }
    
    res.status(200).json(updatedWhiteboard);
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ message: 'Error updating whiteboard', error: err.message });
  }
};

// Delete a whiteboard
export const deleteWhiteboard = async (req: Request, res: Response): Promise<void> => {
  try {
    const deletedWhiteboard = await Whiteboard.findByIdAndDelete(req.params.id);
    
    if (!deletedWhiteboard) {
      res.status(404).json({ message: 'Whiteboard not found' });
      return;
    }
    
    res.status(200).json({ message: 'Whiteboard deleted successfully' });
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ message: 'Error deleting whiteboard', error: err.message });
  }
};

// Add a node to a whiteboard
export const addNode = async (req: Request, res: Response): Promise<void> => {
  try {
    const whiteboard = await Whiteboard.findById(req.params.id);
    
    if (!whiteboard) {
      res.status(404).json({ message: 'Whiteboard not found' });
      return;
    }
    
    whiteboard.nodes.push(req.body);
    whiteboard.updatedAt = new Date();
    
    const updatedWhiteboard = await whiteboard.save();
    res.status(200).json(updatedWhiteboard);
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ message: 'Error adding node', error: err.message });
  }
};

// Update a node in a whiteboard
export const updateNode = async (req: Request, res: Response): Promise<void> => {
  try {
    const whiteboard = await Whiteboard.findById(req.params.id);
    
    if (!whiteboard) {
      res.status(404).json({ message: 'Whiteboard not found' });
      return;
    }
    
    const nodeIndex = whiteboard.nodes.findIndex(node => node.id === req.params.nodeId);
    
    if (nodeIndex === -1) {
      res.status(404).json({ message: 'Node not found' });
      return;
    }
    
    whiteboard.nodes[nodeIndex] = { ...whiteboard.nodes[nodeIndex].toObject(), ...req.body };
    whiteboard.updatedAt = new Date();
    
    const updatedWhiteboard = await whiteboard.save();
    res.status(200).json(updatedWhiteboard);
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ message: 'Error updating node', error: err.message });
  }
};

// Delete a node from a whiteboard
export const deleteNode = async (req: Request, res: Response): Promise<void> => {
  try {
    const whiteboard = await Whiteboard.findById(req.params.id);
    
    if (!whiteboard) {
      res.status(404).json({ message: 'Whiteboard not found' });
      return;
    }
    
    whiteboard.nodes = whiteboard.nodes.filter(node => node.id !== req.params.nodeId);
    // Also remove any edges connected to this node
    whiteboard.edges = whiteboard.edges.filter(
      edge => edge.source !== req.params.nodeId && edge.target !== req.params.nodeId
    );
    
    whiteboard.updatedAt = new Date();
    
    const updatedWhiteboard = await whiteboard.save();
    res.status(200).json(updatedWhiteboard);
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ message: 'Error deleting node', error: err.message });
  }
};

// Add an edge to a whiteboard
export const addEdge = async (req: Request, res: Response): Promise<void> => {
  try {
    const whiteboard = await Whiteboard.findById(req.params.id);
    
    if (!whiteboard) {
      res.status(404).json({ message: 'Whiteboard not found' });
      return;
    }
    
    whiteboard.edges.push(req.body);
    whiteboard.updatedAt = new Date();
    
    const updatedWhiteboard = await whiteboard.save();
    res.status(200).json(updatedWhiteboard);
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ message: 'Error adding edge', error: err.message });
  }
};

// Delete an edge from a whiteboard
export const deleteEdge = async (req: Request, res: Response): Promise<void> => {
  try {
    const whiteboard = await Whiteboard.findById(req.params.id);
    
    if (!whiteboard) {
      res.status(404).json({ message: 'Whiteboard not found' });
      return;
    }
    
    whiteboard.edges = whiteboard.edges.filter(edge => edge.id !== req.params.edgeId);
    whiteboard.updatedAt = new Date();
    
    const updatedWhiteboard = await whiteboard.save();
    res.status(200).json(updatedWhiteboard);
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ message: 'Error deleting edge', error: err.message });
  }
}; 