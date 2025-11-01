


import React, { useContext, useEffect, useState } from "react";
import { Authcontext } from "../../Context/Authcontext";
import { api } from "../../service/api";
import toast from "react-hot-toast";

export default function OrderHistory() {
  const { user, setuser } = useContext(Authcontext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    if (!user?.id) return;
    try {
      const { data: latestUser } = await api.get(`/users/${user.id}`);
      setOrders(latestUser.orders || []);
      setuser(latestUser);
      localStorage.setItem("user", JSON.stringify(latestUser));
    } catch (err) {
      console.error("Failed to fetch orders:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 5000);
    return () => clearInterval(interval);
  }, [user?.id]);

  const handleRemoveOrder = async (orderId) => {
    if (!user) return;
    try {
      const updatedOrders = orders.filter((order) => order.id !== orderId);
      const updatedUser = { ...user, orders: updatedOrders };

      setOrders(updatedOrders);
      setuser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));

      await api.put(`/users/${user.id}`, updatedUser);
      toast.success("Order canceled successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to cancel order");
    }
  };

  if (loading) return <p>Loading orders...</p>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Order History</h2>
      <div className="space-y-4">
        {orders.length === 0 ? (
          <p>No orders found.</p>
        ) : (
          orders.map((order) => (
            <div
              key={order.id}
              className="pt-30 border p-4 rounded-lg shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center"
            >
              <div>
                <p><strong>Order ID:</strong> {order.id}</p>
                <p><strong>Date:</strong> {new Date(order.date).toLocaleDateString()}</p>
                <p><strong>Status:</strong> {order.status}</p>
                <p><strong>Address:</strong> {order.address}</p>
                <p>
                  <strong>Items:</strong>{" "}
                  {(Array.isArray(order.items) ? order.items : [order.items])
                    .map((item) => item?.name)
                    .join(", ")}
                </p>
              </div>
              <button
                onClick={() => handleRemoveOrder(order.id)}
                className="btn btn-sm bg-red-500 text-white hover:bg-red-600 mt-4 sm:mt-0"
              >
                Cancel Order
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
