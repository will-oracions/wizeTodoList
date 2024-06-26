import { createBrowserRouter, Navigate, RouteObject } from "react-router-dom";
import Todos from "./modules/todos/pages/Todos";
import Layout from "./components/Layout";
import Error from "./components/Error";
import Assignees from "./modules/assignees/pages/Assignees";

const routes: RouteObject[] = [
  {
    path: "/",
    element: <Layout />,
    errorElement: <Error />,
    children: [
      {
        index: true,
        element: <Navigate to="/tasks" />,
      },
      {
        path: "tasks",
        element: <Todos />,
      },
      {
        path: "assignees",
        element: <Assignees />,
      },
    ],
  },
];
const router = createBrowserRouter(routes);
export default router;
