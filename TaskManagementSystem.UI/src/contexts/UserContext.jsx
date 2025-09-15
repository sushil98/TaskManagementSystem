import { createContext, useEffect, useState } from "react";
import { getAllUsers } from "../api/services/taskService";

const UserContext = createContext();

export function UserProvider({ children }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const res = await getAllUsers();
        if (res.success) {
          setUsers(res.data);
        }
      } catch (err) {
        console.error("Failed to fetch users", err);
      } finally {
        setLoading(false);
      }
    };
    loadUsers();
  }, []);

  return (
    <UserContext.Provider value={{ users, loading }}>
      {children}
    </UserContext.Provider>
  );
}

export default UserContext;
