import express, { Router } from 'express';
import * as whiteboardController from '../controllers/whiteboard.controller';

const router: Router = express.Router();

// Whiteboard routes
router.get('/', whiteboardController.getAllWhiteboards);
router.get('/:id', whiteboardController.getWhiteboardById);
router.post('/', whiteboardController.createWhiteboard);
router.put('/:id', whiteboardController.updateWhiteboard);
router.delete('/:id', whiteboardController.deleteWhiteboard);

// Node routes
router.post('/:id/nodes', whiteboardController.addNode);
router.put('/:id/nodes/:nodeId', whiteboardController.updateNode);
router.delete('/:id/nodes/:nodeId', whiteboardController.deleteNode);

// Edge routes
router.post('/:id/edges', whiteboardController.addEdge);
router.delete('/:id/edges/:edgeId', whiteboardController.deleteEdge);

export default router; 