import axios from "axios";
import { useMutation } from "@tanstack/react-query";

const deleteTodo = async (id: number) => {
  const res = await axios.delete<void>(`/todos/${id}`);
  return res.data;
};

const useDeleteTodo = () => {
  return useMutation({
    // mutationKey: ["todo"],
    mutationFn: deleteTodo,
    retry: 3,
  });
};

export default useDeleteTodo;
