// import React, { useEffect, useState } from "react";
// import { api } from "../../service/api";
// import Sidebar from "../components/side";
// import { Edit, Trash2, Ban, CheckCircle } from "lucide-react";
// import toast from "react-hot-toast";

// export default function Users() {
//   const [users, setUsers] = useState([]);
//   const [editUser, setEditUser] = useState(null);

//   // ------------------- Fetch Users -------------------
//   useEffect(() => {
//     const fetchUsers = async () => {
//       try {
//         const res = await api.get("/users");
//         setUsers(res.data);
//       } catch (err) {
//         console.error(err.message);
//         toast.error("Failed to fetch users");
//       }
//     };
//     fetchUsers();
//   }, []);

//   // ------------------- Delete User -------------------
//   const handleDelete = async (id) => {
//     try {
//       await api.delete(`/users/${id}`);
//       setUsers(users.filter((u) => u.id !== id));
//       toast.success("User deleted successfully");
//     } catch (err) {
//       toast.error("Failed to delete user");
//     }
//   };

//   // ------------------- Block / Unblock -------------------
//   const handleBlockToggle = async (id, currentStatus) => {
//     try {
//       const updatedStatus = currentStatus === "Active" ? "Blocked" : "Active";
//       await api.patch(`/users/${id}`, { status: updatedStatus });
//       setUsers(
//         users.map((u) => (u.id === id ? { ...u, status: updatedStatus } : u))
//       );
//       toast.success(
//         `User ${updatedStatus === "Blocked" ? "blocked" : "unblocked"}`
//       );
//     } catch (err) {
//       toast.error("Failed to update user status");
//     }
//   };

//   // ------------------- Save Edit -------------------
//   const handleSaveEdit = async () => {
//     try {
//       await api.patch(`/users/${editUser.id}`, {
//         name: editUser.name,
//         email: editUser.email,
//         role: editUser.role,
//       });
//       setUsers(
//         users.map((u) => (u.id === editUser.id ? editUser : u))
//       );
//       toast.success("User updated successfully");
//       setEditUser(null);
//     } catch (err) {
//       toast.error("Failed to update user");
//     }
//   };

//   return (
//     <div className="flex min-h-screen bg-gray-50">
//       <Sidebar />
//       <div className="flex-1 p-6 ml-64">
//         <div className="mb-8">
//           <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
//           <p className="text-gray-600 mt-2">
//             Manage all users, edit details, block or delete accounts.
//           </p>
//         </div>

//         {/* USERS TABLE */}
//         <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
//           <table className="w-full text-left">
//             <thead className="border-b text-gray-700">
//               <tr>
//                 <th className="py-3">Name</th>
//                 <th className="py-3">Email</th>
//                 <th className="py-3">Role</th>
//                 <th className="py-3">Status</th>
//                 <th className="py-3 text-center">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {users.map((user) => (
//                 <tr
//                   key={user.id}
//                   className="border-b hover:bg-gray-50 transition"
//                 >
//                   <td className="py-3">{user.name}</td>
//                   <td className="py-3">{user.email}</td>
//                   <td className="py-3 capitalize">{user.role}</td>
//                   <td className="py-3">
//                     <span
//                       className={`px-3 py-1 rounded-full text-xs font-medium ${
//                         user.status === "Active"
//                           ? "bg-green-100 text-green-700"
//                           : "bg-red-100 text-red-700"
//                       }`}
//                     >
//                       {user.status}
//                     </span>
//                   </td>
//                   <td className="py-3 text-center space-x-3">
//                     {/* Edit */}
//                     <button
//                       onClick={() => setEditUser(user)}
//                       className="text-blue-600 hover:text-blue-800"
//                     >
//                       <Edit size={18} />
//                     </button>

//                     {/* Block / Unblock */}
//                     <button
//                       onClick={() => handleBlockToggle(user.id, user.status)}
//                       className={`${
//                         user.status === "Active"
//                           ? "text-yellow-600 hover:text-yellow-800"
//                           : "text-green-600 hover:text-green-800"
//                       }`}
//                     >
//                       {user.status === "Active" ? (
//                         <Ban size={18} />
//                       ) : (
//                         <CheckCircle size={18} />
//                       )}
//                     </button>

//                     {/* Delete */}
//                     <button
//                       onClick={() => handleDelete(user.id)}
//                       className="text-red-600 hover:text-red-800"
//                     >
//                       <Trash2 size={18} />
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>

//           {users.length === 0 && (
//             <p className="text-center text-gray-500 py-6">
//               No users found.
//             </p>
//           )}
//         </div>

//         {/* EDIT USER MODAL */}
//         {editUser && (
//           <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
//             <div className="bg-white rounded-xl shadow-lg p-6 w-96">
//               <h2 className="text-xl font-semibold mb-4">Edit User</h2>
//               <div className="space-y-3">
//                 <input
//                   type="text"
//                   value={editUser.name}
//                   onChange={(e) =>
//                     setEditUser({ ...editUser, name: e.target.value })
//                   }
//                   placeholder="Name"
//                   className="w-full border rounded-lg px-3 py-2"
//                 />
//                 <input
//                   type="email"
//                   value={editUser.email}
//                   onChange={(e) =>
//                     setEditUser({ ...editUser, email: e.target.value })
//                   }
//                   placeholder="Email"
//                   className="w-full border rounded-lg px-3 py-2"
//                 />
//                 <select
//                   value={editUser.role}
//                   onChange={(e) =>
//                     setEditUser({ ...editUser, role: e.target.value })
//                   }
//                   className="w-full border rounded-lg px-3 py-2"
//                 >
//                   <option value="user">User</option>
//                   <option value="admin">Admin</option>
//                 </select>
//               </div>

//               <div className="mt-6 flex justify-end space-x-3">
//                 <button
//                   onClick={() => setEditUser(null)}
//                   className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   onClick={handleSaveEdit}
//                   className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
//                 >
//                   Save
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }













import React, { useEffect, useState } from "react";
import { api } from "../../service/api";
import Sidebar from "../components/side";
import { Edit, Trash2, Ban, CheckCircle } from "lucide-react";
import toast from "react-hot-toast";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [editUser, setEditUser] = useState(null);

  // ------------------- Fetch Users -------------------
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get("/users");
        setUsers(res.data);
      } catch (err) {
        console.error(err.message);
        toast.error("Failed to fetch users");
      }
    };
    fetchUsers();
  }, []);

  // ------------------- Delete User -------------------
  const handleDelete = async (id) => {
    try {
      await api.delete(`/users/${id}`);
      setUsers(users.filter((u) => u.id !== id));
      toast.success("User deleted successfully");
    } catch (err) {
      toast.error("Failed to delete user");
    }
  };

  // ------------------- Block / Unblock -------------------
  const handleBlockToggle = async (id, isBlock) => {
    try {
      const updatedIsBlock = !isBlock;
      await api.patch(`/users/${id}`, { isBlock: updatedIsBlock });
      setUsers(users.map((u) => (u.id === id ? { ...u, isBlock: updatedIsBlock } : u)));
      toast.success(`User ${updatedIsBlock ? "blocked" : "unblocked"} successfully`);
    } catch (err) {
      toast.error("Failed to update user status");
    }
  };

  // ------------------- Save Edit -------------------
  const handleSaveEdit = async () => {
    try {
      await api.patch(`/users/${editUser.id}`, {
        name: editUser.name,
        email: editUser.email,
        role: editUser.role,
      });
      setUsers(users.map((u) => (u.id === editUser.id ? editUser : u)));
      toast.success("User updated successfully");
      setEditUser(null);
    } catch (err) {
      toast.error("Failed to update user");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 p-6 ml-64">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600 mt-2">Manage all users, edit details, block or delete accounts.</p>
        </div>

        {/* USERS TABLE */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <table className="w-full text-left">
            <thead className="border-b text-gray-700">
              <tr>
                <th className="py-3">Name</th>
                <th className="py-3">Email</th>
                <th className="py-3">Role</th>
                <th className="py-3">Status</th>
                <th className="py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b hover:bg-gray-50 transition">
                  <td className="py-3">{user.name}</td>
                  <td className="py-3">{user.email}</td>
                  <td className="py-3 capitalize">{user.role}</td>
                  <td className="py-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        user.isBlock ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
                      }`}
                    >
                      {user.isBlock ? "Blocked" : "Active"}
                    </span>
                  </td>
                  <td className="py-3 text-center space-x-3">
                    {/* Edit */}
                    <button onClick={() => setEditUser(user)} className="text-blue-600 hover:text-blue-800">
                      <Edit size={18} />
                    </button>

                    {/* Block / Unblock */}
                    <button
                      onClick={() => handleBlockToggle(user.id, user.isBlock)}
                      className={`${
                        user.isBlock ? "text-green-600 hover:text-green-800" : "text-yellow-600 hover:text-yellow-800"
                      }`}
                    >
                      {user.isBlock ? <CheckCircle size={18} /> : <Ban size={18} />}
                    </button>

                    {/* Delete */}
                    <button onClick={() => handleDelete(user.id)} className="text-red-600 hover:text-red-800">
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {users.length === 0 && <p className="text-center text-gray-500 py-6">No users found.</p>}
        </div>

        {/* EDIT USER MODAL */}
        {editUser && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
            <div className="bg-white rounded-xl shadow-lg p-6 w-96">
              <h2 className="text-xl font-semibold mb-4">Edit User</h2>
              <div className="space-y-3">
                <input
                  type="text"
                  value={editUser.name}
                  onChange={(e) => setEditUser({ ...editUser, name: e.target.value })}
                  placeholder="Name"
                  className="w-full border rounded-lg px-3 py-2"
                />
                <input
                  type="email"
                  value={editUser.email}
                  onChange={(e) => setEditUser({ ...editUser, email: e.target.value })}
                  placeholder="Email"
                  className="w-full border rounded-lg px-3 py-2"
                />
                
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button onClick={() => setEditUser(null)} className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">
                  Cancel
                </button>
                <button onClick={handleSaveEdit} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
