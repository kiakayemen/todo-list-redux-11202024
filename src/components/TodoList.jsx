import {
  useGetTodosQuery,
  useDeleteTodoMutation,
  useAddTodoMutation,
} from "../utils/slices/todosApi";

import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";

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
  const handleAddTodo = () => {
    addTodo({
      task: newTodoText,
    });
    setNewTodoText("");
  };

  //function to delete a todo
  const [deleteTodo] = useDeleteTodoMutation();

  const handleKeyPress = (event) => {
    if (event.key === "Enter" && newTodoText.trim() !== "") {
      handleAddTodo();
    }
  };

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
          <button
            disabled={newTodoText.trim() === ""}
            className=""
            onClick={handleAddTodo}
          >
            Add
          </button>
        </div>
        <ul>
          {isLoading ? (
            <h3>Loading...</h3>
          ) : isSuccess ? (
            todos.map((todo) => (
              <li
                className="list-none flex justify-between items-center py-2"
                key={todo.id}
              >
                <p>{todo.task}</p>
                <button
                  onClick={() => {
                    try {
                      deleteTodo({ id: todo.id });
                      toast.success(`successfully deleted "${todo.task}" 👍`)
                    } catch (error) {
                      toast.error("error deleting");
                      console.log(error)
                    }
                  }}
                >
                  ❌
                </button>
              </li> // Added parentheses here for returning the `li`
            ))
          ) : isError ? (
            <h3>There was an error: {error}</h3>
          ) : null}
        </ul>{" "}
      </div>
    </>
  );
}
