import { createContext, useEffect, useState } from "react";
import { api } from "../service/api";
import toast from "react-hot-toast";
import ConfirmModal from "../admin/pages/modal";

export const Authcontext = createContext();

function Authprovider({ children }) {
  const [user, setuser] = useState(null);
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  const [modalConfig, setModalConfig] = useState({
    show: false,
    onConfirm: null,
    title: "",
    message: "",
    confirmText: "Confirm",
    type: "default",
  });

  // ------------------ Modal Control ------------------
  const openModal = (config) => setModalConfig({ ...config, show: true });
  const closeModal = () => setModalConfig((prev) => ({ ...prev, show: false }));

  // -------------------- Load user/admin from localStorage --------------------
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      const storedAdmin = localStorage.getItem("admin");

      if (storedAdmin) setAdmin(JSON.parse(storedAdmin));

      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser.isBlocked) {
          handleForcedLogout();
          toast.error("Your account has been blocked by admin.");
        } else {
          setuser(parsedUser);
        }
      }
    } catch (err) {
      console.error("Error loading user/admin from localStorage:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // -------------------- Auto-check if user is blocked --------------------
  useEffect(() => {
    if (!user) return;

    const checkBlockStatus = async () => {
      try {
        const { data: latestUser } = await api.get(`/users/${user.id}`);
        if (latestUser.isBlock) {
          handleForcedLogout();
          toast.error("Your account has been hacked......Fek offfffffff");
        }
      } catch (err) {
        console.error("Error checking block status:", err);
      }
    };

    checkBlockStatus();
    const interval = setInterval(checkBlockStatus, 1000);
    return () => clearInterval(interval);
  }, [user]);

  // -------------------- Forced Logout --------------------
  const handleForcedLogout = () => {
    localStorage.removeItem("user");
    setuser(null);
    window.location.href = "/login";
  };

  // -------------------- LocalStorage Sync --------------------
  useEffect(() => {
    if (user && !user.isAdmin) localStorage.setItem("user", JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    if (admin && admin.isAdmin) localStorage.setItem("admin", JSON.stringify(admin));
  }, [admin]);

  // -------------------- Login & Merge Orders --------------------
  const loginUser = async (userdata) => {
    try {
      
      const { data: latestUser } = await api.get(`/users/${userdata.id}`);

      const mergedUser = {
        ...userdata,
        orders: latestUser.orders || [],
        cart: latestUser.cart || [],
        wishlist:latestUser.wishlist||[]
      };

      setuser(mergedUser);
      localStorage.setItem("user", JSON.stringify(mergedUser));
    } catch (err) {
      console.error("Login merge error:", err);
      setuser(userdata);
      localStorage.setItem("user", JSON.stringify(userdata));
    }
  };

  const loginAdmin = (admindata) => {
    setAdmin(admindata);
    localStorage.setItem("admin", JSON.stringify(admindata));
  };

  // -------------------- Logout --------------------
  const handleLogoutClick = () => {
    openModal({
      title: "Confirm Logout",
      message: "Are you sure you want to log out?",
      confirmText: "Logout",
      type: "logout",
      onConfirm: confirmLogout,
    });
  };

  const confirmLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("admin");
    setuser(null);
    setAdmin(null);
    closeModal();
    window.location.href = "/login";
  };

  // -------------------- Confirm Delete & Add --------------------
  const confirmDelete = (onDeleteAction) => {
    openModal({
      title: "Delete Item",
      message: "This action cannot be undone. Do you want to continue?",
      confirmText: "Delete",
      type: "delete",
      onConfirm: () => {
        onDeleteAction();
        closeModal();
      },
    });
  };

  const confirmAdd = (onAddAction) => {
    openModal({
      title: "Add Item",
      message: "Do you want to add this item?",
      confirmText: "Add",
      type: "add",
      onConfirm: () => {
        onAddAction();
        closeModal();
      },
    });
  };

  // -------------------- Place Order --------------------
  const placeOrder = async ({ product = null, address, paymentMethod }) => {
    if (!user) return toast.error("You must be logged in");

    const items = product
      ? [{ id: product.id, name: product.name, price: product.price, quantity: product.quantity || 1 }]
      : user.cart?.map((p) => ({
          id: p.id,
          name: p.name,
          price: p.price,
          quantity: p.quantity || 1,
        })) || [];

    if (!items.length) return toast.error("Cart is empty");

    const orderData = {
      id: Date.now(),
      date: new Date().toISOString(),
      items,
      address,
      paymentMethod,
      status: "Pending",
    };

    try {
      const { data: currentUser } = await api.get(`/users/${user.id}`);
      const updatedUser = {
        ...currentUser,
        orders: [...(currentUser.orders || []), orderData],
        cart: product ? currentUser.cart : [],
      };

      await api.put(`/users/${user.id}`, updatedUser);
      setuser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
      toast.success("Order placed successfully!");
      return orderData;
    } catch (err) {
      toast.error("Failed to place order");
      console.error(err);
    }
  };

  // -------------------- Context Return --------------------
  return (
    <Authcontext.Provider
      value={{
        user,
        admin,
        loading,
        loginUser,
        loginAdmin,
        logout: handleLogoutClick,
        confirmDelete,
        confirmAdd,
        placeOrder,
        setuser,
      }}
    >
      {children}

      {/* ---------------------- Modal ------------------------- */}
      <ConfirmModal
        show={modalConfig.show}
        onClose={closeModal}
        onConfirm={modalConfig.onConfirm}
        title={modalConfig.title}
        message={modalConfig.message}
        confirmText={modalConfig.confirmText}
        type={modalConfig.type}
      />
    </Authcontext.Provider>
  );
}

export default Authprovider;
