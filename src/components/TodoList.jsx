import {
  useGetTodosQuery,
  useDeleteTodoMutation,
  useAddTodoMutation,
  useEditTodoMutation,
} from "../utils/slices/todosApi";

import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useTransition, animated } from "@react-spring/web";

export default function TodoList() {
  const [newTodoText, setNewTodoText] = useState("");
  // function to fetch todos
  const {
    data: todos,
    isLoading,
    isError,
    error,
    isSuccess,
  } = useGetTodosQuery();

  // function to add a new todo
  const [addTodo] = useAddTodoMutation();
  const handleAddTodo = async () => {
    try {
      await addTodo({
        task: newTodoText,
      }).unwrap;
      toast.success("new todo added!");
      setNewTodoText("");
    } catch {
      toast.error("failed to add todo!");
    }
  };

  //function to delete a todo

  const [deleteTodo] = useDeleteTodoMutation();
  const handleKeyPress = (event) => {
    if (event.key === "Enter" && newTodoText.trim() !== "") {
      editingTodoId ? handleSaveEdit() : handleAddTodo();
    }
  };

  // Transition for fade-out animation
  const transitions = useTransition(todos || [], {
    from: { opacity: 0, transform: "translateX(-20px)" },
    enter: { opacity: 1, transform: "translateX(0)" },
    leave: { opacity: 0, transform: "translateX(20px)" },
    keys: (todo) => todo.id, // Use a unique key for each transition
  });

  // edit todo mutation
  const [editTodo] = useEditTodoMutation();
  const handleSaveEdit = async () => {
    try {
      await editTodo({
        id: editingTodoId,
        task: newTodoText,
      }).unwrap();
      toast.success("todo updated!");
      setNewTodoText("");
      setEditingTodoId(null);
    } catch {
      toast.error("error saving the edited todo!");
    }
  };

  // enter edit mode

  const handleEditTodo = (todo) => {
    setNewTodoText(todo.task);
    setEditingTodoId(todo.id);
  };

  // cancel edit mode

  const handleCancelEditTodo = () => {
    setNewTodoText("");
    setEditingTodoId(null);
  };

  const [editingTodoId, setEditingTodoId] = useState(null);

  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      <div className="flex flex-col min-w-[500px]">
        <div className="flex justify-between mb-10">
          <input
            className="rounded-xl py-1 px-4 min-w-[300px]"
            value={newTodoText}
            onChange={(e) => setNewTodoText(e.target.value)}
            placeholder="Add New Todo"
            type="text"
            onKeyDown={handleKeyPress}
          />
          {editingTodoId && (
            <button onClick={handleCancelEditTodo}>Cancel</button>
          )}
          <button
            disabled={newTodoText.trim() === ""}
            className=""
            onClick={editingTodoId ? handleSaveEdit : handleAddTodo}
          >
            {editingTodoId ? "Save" : "Add"}
          </button>
        </div>
        <ul>
          {isLoading ? (
            <h3>Loading...</h3>
          ) : isSuccess && todos ? (
            transitions((style, todo) => (
              <animated.li
                key={todo.id}
                style={style}
                className="list-none flex justify-between items-center py-2"
              >
                <p>{todo.task}</p>
                <div className="flex gap-4">
                  <button onClick={() => handleEditTodo(todo)}>✏️</button>
                  <button onClick={() => {
                        try {
                          deleteTodo({ id: todo.id });
                          toast.success(`successfully deleted "${todo.task}" 👍`);
                        } catch (error) {
                          toast.error("error deleting");
                          console.log(error);
                        }
                      }}>
                    ❌
                  </button>
                </div>
              </animated.li>
            ))
          ) : isError ? (
            <h3>There was an error: {error}</h3>
          ) : null}
        </ul>{" "}
      </div>
    </>
  );
}
