import {
  Handle,
  NodeProps,
  Position,
  useReactFlow,
  NodeToolbar,
} from "@xyflow/react";
import { useCallback, useState } from "react";

const TextUpdaterNode = ({ id, data, isConnectable }: NodeProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [label, setLabel] = useState(String(data.label));
  const { setNodes } = useReactFlow();

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleBlur = useCallback(() => {
    setIsEditing(false);
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === id) {
          return { ...node, data: { ...node.data, label } };
        }
        return node;
      })
    );
  }, [id, label, setNodes]);

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setLabel(event.target.value);
  };

  return (
    <>
      <NodeToolbar isVisible={true} position={Position.Top}>
        <button>Edit</button>
        <button>Delete</button>
        <button>Clone</button>
      </NodeToolbar>
      <div
        className="border-2 p-1 bg-white w-34 min-h-28 flex flex-col"
        onDoubleClick={handleDoubleClick}
      >
        <div className="bg-black text-white text-xs font-medium text-center h-4">
          <p>Event</p>
        </div>
        <Handle
          type="target"
          position={Position.Top}
          isConnectable={isConnectable}
        />
        <div className="flex-auto text-[9px]">
          {isEditing ? (
            <textarea
              value={label}
              onChange={handleChange}
              onBlur={handleBlur}
              autoFocus
              rows={5}
              className="border-none outline-none resize-none break-words w-full overflow-hidden"
            />
          ) : (
            <div className="p-3 flex justify-center items-center">{label}</div>
          )}
        </div>
        <Handle
          type="source"
          position={Position.Bottom}
          isConnectable={isConnectable}
        />
      </div>
    </>
  );
};

export default TextUpdaterNode;
