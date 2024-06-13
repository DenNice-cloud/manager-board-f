import React, { useState, useEffect } from "react";
import axios from "axios";
import TodoItem from "./TodoItem";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const TodoList = () => {
  const [todos, setTodos] = useState([]);
  const [isAdd, setIsAdd] = useState(false);
  const [errorTitleDescription, setErrorTitleDescription] = useState(false);
  const [title, setTitle] = useState("");
  const [query, setQuery] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await axios.get(
        "https://task-manager-board.onrender.com"
      );

      setTodos(response.data);
    } catch (error) {
      console.error("Error fetching todos", error);
    }
  };

  const addTodo = async () => {
    if (title && description) {
      try {
        const response = await axios.post(
          "https://task-manager-board.onrender.com",
          {
            title,
            description,
          }
        );

        setTodos([...todos, response.data]);
        setErrorTitleDescription(false);
      } catch (error) {
        console.error("Error adding todo", error);
      }
    } else {
      setErrorTitleDescription(true);
      return;
    }

    setTitle("");
    setDescription("");
    setIsAdd(!isAdd);
  };

  const deleteTodo = async (id) => {
    try {
      await axios.delete(`https://task-manager-board.onrender.com/${id}`);

      setTodos(todos.filter((todo) => todo.id !== id));
    } catch (error) {
      console.error("Error deleting todo", error);
    }
  };

  const updateTodo = async (id, title, description) => {
    try {
      await axios.patch(`https://task-manager-board.onrender.com/${id}`, {
        title,
        description,
      });

      const updatedTodo = {
        ...todos.find((todo) => todo.id === id),
        title,
        description,
      };

      setTodos(todos.map((todo) => (todo.id === id ? updatedTodo : todo)));
    } catch (error) {
      console.error("Error update todo", error);
    }
  };

  const handleAddNew = async () => {
    setIsAdd(!isAdd);
  };

  const updateTodoStatus = async (id, status) => {
    try {
      await axios.patch(
        `https://task-manager-board.onrender.com/${id}/status`,
        { status }
      );
    } catch (error) {
      console.error("Error updating todo status", error);
    }
  };

  const onDragEnd = async (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) {
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const finish = destination.droppableId;

    const newTodos = Array.from(todos);

    const movedTodo = newTodos.find(
      (todo) => todo.id === parseInt(draggableId)
    );

    movedTodo.status = finish;
    const filteredTodos = newTodos.filter(
      (todo) => todo.id !== parseInt(draggableId)
    );
    filteredTodos.splice(destination.index, 0, movedTodo);

    setTodos(filteredTodos);
    await updateTodoStatus(draggableId, finish);
  };

  const handleLoad = async () => {
    const response = await axios.get("https://task-manager-board.onrender.com");

    if (!response.data) {
      console.error("Received empty data from server");
      return;
    }

    let filteredTodos = response.data;

    if (query) {
      filteredTodos = filteredTodos.filter(
        (todo) => todo.title.toLowerCase() === query.toLowerCase()
      );
      setQuery("");
    }

    setTodos(filteredTodos);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-grow mb-10">
        <input
          type="text"
          placeholder="Enter a board ID here..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="border p-2 mr-4 flex-grow  h-full"
        />

        <button
          onClick={handleLoad}
          className="bg-blue-500 text-white px-16 "
        >
          Load
        </button>
      </div>

      <div className="flex flex-grow justify-around">
        {["Todo", "In Progress", "Done"].map((column) => (
          <div className="flex flex-col items-center">
            <h2 className="text-xl font-bold mb-4 text-center">{column}</h2>
          </div>
        ))}
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex space-x-10">
          {["TODO", "IN_PROGRESS", "DONE"].map((column) => (
            <Droppable
              droppableId={column}
              key={column}
            >
              {(provided) => (
                <div
                  className="bg-gray-200 p-4 w-1/3 rounded-lg"
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                >
                  {todos
                    .filter((todo) => todo.status === column)
                    .map((todo, index) => (
                      <Draggable
                        key={todo.id}
                        draggableId={todo.id.toString()}
                        index={index}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <TodoItem
                              key={todo.id}
                              todo={todo}
                              onDelete={deleteTodo}
                              onUpdate={updateTodo}
                            />
                          </div>
                        )}
                      </Draggable>
                    ))}

                  {provided.placeholder}

                  <div className="flex justify-center bg-white shadow-md">
                    {column === "TODO" && !isAdd && (
                      <button
                        onClick={handleAddNew}
                        className="flex items-center justify-center w-full h-full"
                        style={{ minHeight: "120px" }}
                      >
                        <img
                          src="https://task-manager-board.onrender.com/icons/add-svgrepo-com.svg"
                          alt="Delete"
                          style={{ width: "24px", height: "24px" }}
                        />
                      </button>
                    )}
                    {column === "TODO" && isAdd && (
                      <div className="flex flex-col p-2 flex-grow">
                        <input
                          type="text"
                          placeholder="Title"
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          className="border p-2 mb-2 flex-grow"
                          required
                        />
                        <textarea
                          type="text"
                          placeholder="Description..."
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          className="border p-2 mb-2 flex-grow"
                          required
                        />
                        <div className="flex justify-end items-center">
                          {errorTitleDescription && (
                            <span className="text-red-500 justify-center mr-2">
                              Both fields are required
                            </span>
                          )}
                          <button
                            onClick={addTodo}
                            className="bg-green-500 text-white px-4 py-2"
                          >
                            Add Todo
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
};

export default TodoList;
