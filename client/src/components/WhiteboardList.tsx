import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  getAllWhiteboards,
  createWhiteboard,
  deleteWhiteboard,
  Whiteboard,
} from "../services/whiteboardService";

const WhiteboardList: React.FC = () => {
  const [whiteboards, setWhiteboards] = useState<Whiteboard[]>([]);
  const [newWhiteboardName, setNewWhiteboardName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchWhiteboards();
  }, []);

  const fetchWhiteboards = async () => {
    try {
      setLoading(true);
      const data = await getAllWhiteboards();
      setWhiteboards(data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch whiteboards");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateWhiteboard = async () => {
    if (!newWhiteboardName.trim()) return;

    try {
      const newWhiteboard = await createWhiteboard({ name: newWhiteboardName });
      setWhiteboards([...whiteboards, newWhiteboard]);
      setNewWhiteboardName("");
    } catch (err) {
      setError("Failed to create whiteboard");
      console.error(err);
    }
  };

  const handleDeleteWhiteboard = async (id: string) => {
    try {
      await deleteWhiteboard(id);
      setWhiteboards(whiteboards.filter((wb) => wb._id !== id));
    } catch (err) {
      setError("Failed to delete whiteboard");
      console.error(err);
    }
  };

  if (loading) return <div>Loading whiteboards...</div>;

  return (
    <div className="whiteboard-list px-12 py-4">
      <h1 className="text-2xl font-bold mb-4">My Whiteboards</h1>

      {error && <div className="error">{error}</div>}

      <div className="create-whiteboard">
        <h1 className="text-lg font-bold mb-2">Create a new whiteboard</h1>
        <input
          type="text"
          value={newWhiteboardName}
          onChange={(e) => setNewWhiteboardName(e.target.value)}
          placeholder="New whiteboard name"
          className="border border-gray-300 rounded-md px-2 py-1 mb-2"
        />
        <button
          onClick={handleCreateWhiteboard}
          className="bg-neutral-700 hover:bg-neutral-800 text-white rounded-md px-2 py-1 mb-2 ml-2 cursor-pointer"
        >
          Create
        </button>
      </div>

      <div className="whiteboards">
        {whiteboards.length === 0 ? (
          <p className="text-gray-500">
            No whiteboards yet. Create one to get started!
          </p>
        ) : (
          <>
            <h1 className="text-lg font-bold mb-2">Whiteboards</h1>
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="text-left p-2">Title</th>
                  <th className="text-left p-2">Date Created</th>
                  <th className="text-left p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {whiteboards.map((whiteboard) => (
                  <tr key={whiteboard._id} className="border-b">
                    <td className="p-2">
                      <Link to={`/whiteboard/${whiteboard._id}`} className="text-blue-500 hover:text-blue-700">
                        {whiteboard.name}
                      </Link>
                    </td>
                    <td className="p-2">
                      {new Date(whiteboard.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-2">
                      <button
                        className="delete-btn bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded cursor-pointer"
                        onClick={() => handleDeleteWhiteboard(whiteboard._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </div>
    </div>
  );
};

export default WhiteboardList;
