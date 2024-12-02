import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const todosApi = createApi({
    reducerPath: "todosApi",
    baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:8000" }),
    tagTypes: ['Todos'],
    endpoints: (builder) => ({
        getTodos: builder.query({
            query: () => "/todos",
            transformResponse: res => res.sort((a,b) => b.id - a.id),
            providesTags: ['Todos']
        }),
        addTodo: builder.mutation({
            query: (newTodoText) => ({
                url: "/todos",
                method: 'POST',
                body: newTodoText
            }),
            invalidatesTags: ['Todos']
        }),
        deleteTodo: builder.mutation({
            query: ({ id }) => ({
                url:`todos/${id}`,
                method:'DELETE',
            }),
            invalidatesTags:['Todos']
        })
    })
})
export const {
    useGetTodosQuery,
    useDeleteTodoMutation,
    useAddTodoMutation
} = todosApi