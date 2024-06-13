import React, { useState } from "react";

const TodoItem = ({ todo, onDelete, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [errorTitleDescription, setErrorTitleDescription] = useState(false);

  const handleUpdate = async () => {
    if (title && description) {
      try {
        await onUpdate(todo.id, title, description);

        setErrorTitleDescription(false);
        setIsEditing(false);
      } catch (error) {
        console.error("Error updating todo", error);
      }
    } else {
      setErrorTitleDescription(true);
      return;
    }
  };

  const handleClick = () => {
    setErrorTitleDescription(false);
    setIsEditing(true);
    setTitle(todo.title);
    setDescription(todo.description);
  };

  return (
    <div className="flex justify-between items-center p-2 bg-white shadow-md mb-4">
      {!isEditing ? (
        <>
          <div
            className="flex flex-col flex-grow"
            style={{ minHeight: "120px" }}
          >
            <h3 className="text-xl font-bold">{todo.title}</h3>
            <p
              className="flex-grow mb-4"
              style={{ wordBreak: "break-word" }}
            >
              {todo.description}
            </p>

            <div className="flex justify-end">
              <button
                onClick={handleClick}
                className="flex items-center mr-2"
              >
                <img
                  src="https://task-manager-board.onrender.com/icons/edit-svgrepo-com.svg"
                  alt="Edit"
                  style={{ width: "24px", height: "24px" }}
                />
              </button>
              <button
                onClick={() => onDelete(todo.id)}
                className="flex items-center"
              >
                <img
                  src="https://task-manager-board.onrender.com/icons/trash-alt-svgrepo-com.svg"
                  alt="Delete"
                  style={{ width: "24px", height: "24px" }}
                />
              </button>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="flex flex-col flex-grow">
            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="border p-2 mb-2 flex-grow"
            />
            <textarea
              type="text"
              placeholder="Description..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="border p-2 mb-2 flex-grow"
            />
            <div className="flex justify-end items-center">
              {errorTitleDescription && (
                <span className="text-red-500 justify-center mr-2">
                  Both fields are required
                </span>
              )}
              <button
                onClick={handleUpdate}
                className="flex items-center mr-2"
              >
                <img
                  src="https://task-manager-board.onrender.com/icons/check-svgrepo-com.svg"
                  alt="Save"
                  style={{ width: "24px", height: "24px" }}
                />
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="flex items-center"
              >
                <img
                  src="https://task-manager-board.onrender.com/icons/close-svgrepo-com.svg"
                  alt="Close"
                  style={{ width: "24px", height: "24px" }}
                />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default TodoItem;
