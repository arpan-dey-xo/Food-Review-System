import { useEffect, useState } from "react";

import API from "../services/api";

function Admin() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await API.get(
        "/auth/all-users",

        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        },
      );

      setUsers(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const deleteUser = async (id) => {
    try {
      await API.delete(
        `/auth/delete-user/${id}`,

        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        },
      );

      alert("User Deleted");

      fetchUsers();
    } catch (error) {
      alert(error.response.data.message);
    }
  };

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-6">Admin Panel 👑</h1>

      <div className="space-y-4">
        {users.map((user) => (
          <div
            key={user._id}
            className="border p-4 rounded flex justify-between"
          >
            <div>
              <p className="font-bold">{user.name}</p>

              <p>{user.email}</p>

              <p>{user.role}</p>
            </div>

            {user.role !== "admin" && (
              <button
                onClick={() => deleteUser(user._id)}
                className="bg-red-500 text-white px-4 py-2 rounded"
              >
                Delete
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Admin;