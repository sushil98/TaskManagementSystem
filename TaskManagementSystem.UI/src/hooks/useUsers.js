import { useContext } from "react";
import UserContext from "../contexts/UserContext";

export function useUsers() {
  return useContext(UserContext);
}
