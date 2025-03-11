import type { Node, BuiltInNode } from '@xyflow/react';

export type PositionLoggerNode = Node<{ label: string }, 'position-logger'>;
export type EditableNode = Node<{ label: string }, 'editable'>;
export type AppNode = BuiltInNode | PositionLoggerNode | EditableNode;
