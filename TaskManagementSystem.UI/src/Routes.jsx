import { Routes, Route } from "react-router-dom";
import Login from "./pages/LoginPage";
import Register from "./pages/RegisterPage";
import TaskManager from "./pages/TaskManagerPage";
import PrivateRoute from "./PrivateRoute";
import { UserProvider } from "./contexts/UserContext";

export default function PageRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route
        path="/task"
        element={
          <PrivateRoute>
            <UserProvider>
              <TaskManager />
            </UserProvider>
          </PrivateRoute>
        }
      />
    </Routes>
  );
}
