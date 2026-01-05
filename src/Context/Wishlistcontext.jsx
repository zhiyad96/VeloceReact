
import React, { createContext, useContext, useEffect, useState } from 'react';
import { api } from '../service/api';
import { useNavigate } from 'react-router-dom';
import { Authcontext } from './Authcontext';
import toast from 'react-hot-toast';

export const Wishcontext = createContext();

function Wishlistprovider({ children }) {
    const { user, setuser } = useContext(Authcontext);
    const [wish, setwish] = useState([]);
    const [wishlength, setwishlength] = useState(0);
    const navigate = useNavigate();

    // ------------------- Load wishlist from user or localStorage -------------------
    useEffect(() => {
        let active = true;
        const loadWishlist = () => {
            try {
                const storedUser = user || JSON.parse(localStorage.getItem('user'));
                if (storedUser?.id) {
                    const wishlist = storedUser.wishlist || [];
                    if (active) {
                        setwish(wishlist);
                        setwishlength(wishlist.length); 
                    }
                } else {
                    if (active) {
                        setwish([]);
                        setwishlength(0); 
                    }
                }
            } catch (err) {
                console.error('Failed to load wishlist:', err);
                if (active) {
                    setwish([]);
                    setwishlength(0);
                }
            }
        };
        loadWishlist();
        return () => { active = false; };
    }, [user]);

    // ------------------- Add/Remove from wishlist -------------------
    const addtowish = async (product) => {
        if (!user?.id) {
            toast.error("Please log in to add items to wishlist");
            navigate("/login");
            return;
        }

        const currentWish = user.wishlist || [];
        const inwish = currentWish.some(item => item.id === product.id);
        const updatedWish = inwish
            ? currentWish.filter(item => item.id !== product.id)
            : [...currentWish, product];

        const updatedUser = { ...user, wishlist: updatedWish };

    
        setuser(updatedUser);
        setwish(updatedWish);
        setwishlength(updatedWish.length); 

        try {
            await api.patch(`/users/${user.id}`, { wishlist: updatedWish });
            localStorage.setItem("user", JSON.stringify(updatedUser));
            toast.success(inwish ? "Removed from wishlist" : "Added to wishlist");
        } catch (err) {
            console.error("Failed to update wishlist:", err.message);
            toast.error("Failed to update wishlist");
        }
    };

    return (
        <Wishcontext.Provider value={{ wish, wishlength, addtowish }}>
            {children}
        </Wishcontext.Provider>
    );
}

export default Wishlistprovider;
