import React, { useState } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';

const CustomNode: React.FC<NodeProps> = ({ data, isConnectable }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [label, setLabel] = useState(data.label);

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleBlur = () => {
    setIsEditing(false);
    data.label = label;
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      setIsEditing(false);
      data.label = label;
    }
  };

  return (
    <div className="custom-node" onDoubleClick={handleDoubleClick}>
      <Handle
        type="target"
        position={Position.Top}
        isConnectable={isConnectable}
      />
      {isEditing ? (
        <input
          type="text"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          autoFocus
        />
      ) : (
        <div className="custom-node-content">
          <div className="custom-node-header">
            <div className="custom-node-title">{data.label}</div>
          </div>
          <div className="custom-node-body">
            {data.content || 'Double-click to edit'}
          </div>
        </div>
      )}
      <Handle
        type="source"
        position={Position.Bottom}
        isConnectable={isConnectable}
      />
    </div>
  );
};

export default CustomNode; 