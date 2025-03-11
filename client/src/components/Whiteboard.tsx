import React, { useState, useEffect, useCallback, useRef } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
  NodeChange,
  EdgeChange,
  applyNodeChanges,
  applyEdgeChanges,
  NodeTypes
} from 'reactflow';
import 'reactflow/dist/style.css';
import { useParams } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import CustomNode from './CustomNode';
import { getWhiteboardById, updateWhiteboard } from '../services/whiteboardService';

// Define custom node types
const nodeTypes: NodeTypes = {
  customNode: CustomNode,
};

interface WhiteboardData {
  _id: string;
  name: string;
  nodes: Node[];
  edges: Edge[];
}

const Whiteboard: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [nodes, setNodes] = useNodesState([]);
  const [edges, setEdges] = useEdgesState([]);
  const [whiteboard, setWhiteboard] = useState<WhiteboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [nodeName, setNodeName] = useState('');
  const [nodeType, setNodeType] = useState('default');
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  // Fetch whiteboard data
  useEffect(() => {
    const fetchWhiteboard = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const data = await getWhiteboardById(id);
        setWhiteboard(data);
        setNodes(data.nodes || []);
        setEdges(data.edges || []);
        setError(null);
      } catch (err) {
        setError('Failed to fetch whiteboard');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchWhiteboard();
  }, [id]);

  // Save whiteboard data
  const saveWhiteboard = async () => {
    if (!whiteboard || !id) return;
    
    try {
      setIsSaving(true);
      setSaveMessage('Saving...');
      
      await updateWhiteboard(id, {
        name: whiteboard.name,
        nodes,
        edges
      });
      
      setSaveMessage('Saved successfully!');
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (err) {
      setSaveMessage('Failed to save!');
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  // Auto-save on changes
  useEffect(() => {
    const debounce = setTimeout(() => {
      if (whiteboard && nodes.length > 0) {
        saveWhiteboard();
      }
    }, 2000);

    return () => clearTimeout(debounce);
  }, [nodes, edges]);

  // Handle node changes
  const onNodesChange = useCallback(
    (changes: NodeChange[]) => {
      setNodes((nds) => applyNodeChanges(changes, nds));
    },
    [setNodes]
  );

  // Handle edge changes
  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => {
      setEdges((eds) => applyEdgeChanges(changes, eds));
    },
    [setEdges]
  );

  // Handle new connections
  const onConnect = useCallback(
    (connection: Connection) => {
      setEdges((eds) => addEdge({ ...connection, id: uuidv4() }, eds));
    },
    [setEdges]
  );

  // Add a new node
  const addNode = () => {
    if (!nodeName.trim()) return;
    
    const newNode: Node = {
      id: uuidv4(),
      type: nodeType === 'custom' ? 'customNode' : 'default',
      data: { label: nodeName },
      position: {
        x: Math.random() * 400,
        y: Math.random() * 400,
      },
    };
    
    setNodes((nds) => [...nds, newNode]);
    setNodeName('');
  };

  // Delete selected nodes
  const deleteSelectedNodes = () => {
    setNodes((nds) => nds.filter((node) => !node.selected));
    setEdges((eds) => eds.filter((edge) => 
      !edge.selected && 
      nodes.some(n => n.id === edge.source && !n.selected) && 
      nodes.some(n => n.id === edge.target && !n.selected)
    ));
  };

  if (loading) return <div>Loading whiteboard...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!whiteboard) return <div>Whiteboard not found</div>;

  return (
    <div className="px-4">
      <div className="flex justify-between items-center py-2">
        <h1 className="text-2xl font-bold">{whiteboard.name}</h1>
        <div className="text-md text-green-500">
          {saveMessage && <span className={isSaving ? 'saving' : 'saved'}>{saveMessage}</span>}
        </div>
      </div>
      
      <div className="py-2">
        <input
          type="text"
          value={nodeName}
          onChange={(e) => setNodeName(e.target.value)}
          placeholder="Node name"
          className="border border-gray-300 rounded-md px-2 py-1 mb-2"
        />
        <select value={nodeType} onChange={(e) => setNodeType(e.target.value)} className="bg-neutral-700 hover:bg-neutral-800 text-white rounded-md px-2 py-1 mb-2 ml-2 cursor-pointer">
          <option value="default" className="text-white">Default</option>
          <option value="custom" className="text-white">Custom</option>
        </select>
        <button onClick={addNode} className="bg-neutral-700 hover:bg-neutral-800 text-white rounded-md px-2 py-1 mb-2 ml-2 cursor-pointer">Add Node</button>
        <button onClick={deleteSelectedNodes} className="bg-red-700 hover:bg-red-800 text-white rounded-md px-2 py-1 mb-2 ml-2 cursor-pointer">Delete Selected</button>
        <button onClick={saveWhiteboard} className="bg-green-700 hover:bg-green-800 text-white rounded-md px-2 py-1 mb-2 ml-2 cursor-pointer">Save</button>
      </div>
      
      <div className="reactflow-wrapper h-[80vh] w-full" ref={reactFlowWrapper}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          onInit={setReactFlowInstance}
          fitView
        >
          <Controls />
          <MiniMap />
          <Background gap={12} size={1} />
        </ReactFlow>
      </div>
    </div>
  );
};

export default Whiteboard; 