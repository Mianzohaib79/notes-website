import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { message } from 'antd';
import { StarFilled, StarOutlined } from '@ant-design/icons';
import { io } from 'socket.io-client';
import { useAuth } from './Auth';

export const NoteContext = createContext();

export const NoteProvider = ({ children }) => {
    const { isAuth, user, readProfile, dispatch } = useAuth();
    const [notes, setNotes] = useState([]);
    const [activeNote, setActiveNote] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [recentShared, setRecentShared] = useState([]);
    const [socket, setSocket] = useState(null);

    const apiUrl = import.meta.env.VITE_API_URL

    useEffect(() => {
        if (isAuth && user?.uid) {
            const s = io(apiUrl);
            setSocket(s);

            // Join personal room for notifications
            s.emit('join-note', user.uid);

            s.on('new-notification', (data) => {
                if (window.toastify) {
                    window.toastify(data.message, "info");
                }
                fetchNotes(); // Refresh notes list
            });

            return () => s.disconnect();
        }
    }, [isAuth, user]);

    const fetchNotes = async () => {
        if (!isAuth) return;
        setIsLoading(true);
        try {
            const token = localStorage.getItem("jwt");
            const res = await axios.get(`${apiUrl}/notes`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setNotes(res.data.notes);

            // Extract top 5 recently shared notes for sidebar
            const shared = res.data.notes
                .filter(n => n.sharedWith && n.sharedWith.length > 0)
                .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
                .slice(0, 5);
            setRecentShared(shared);
        } catch (error) {
            console.error("Error fetching notes:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const createNote = async (title, content = "") => {
        try {
            const token = localStorage.getItem("jwt");
            const res = await axios.post(`${apiUrl}/notes`, { title, content }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setNotes([res.data.note, ...notes]);
            return res.data.note;
        } catch (error) {
            console.error("Error creating note:", error);
        }
    };

    const deleteNote = async (id) => {
        try {
            const token = localStorage.getItem("jwt");
            await axios.delete(`${apiUrl}/notes/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setNotes(notes.filter(n => n._id !== id));
            return true;
        } catch (error) {
            console.error("Error deleting note:", error);
            return false;
        }
    };

    const toggleFavorite = async (id) => {
        try {
            const token = localStorage.getItem("jwt");
            const res = await axios.post(`${apiUrl}/notes/${id}/favorite`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });

            // INSTANT SYNC: Update the global auth user object with the returned data
            if (res.data.user && dispatch) {
                dispatch({ isAuth: true, user: res.data.user });
            } else {
                // Fallback to profile refresh if direct update unavailable
                if (readProfile) readProfile();
            }

            // Refresh notes to ensure any local note state is synced
            fetchNotes();

            // Show premium toast notification
            if (res.data.message) {
                const isAdding = !user?.favorites?.some(favId => String(favId?._id || favId) === String(id));
                message.success({
                    content: res.data.message,
                    icon: isAdding ? <StarFilled style={{ color: '#f59e0b' }} /> : <StarOutlined />,
                    className: 'premium-toast',
                    duration: 3
                });
            }

            return res.data;
        } catch (error) {
            console.error("Error toggling favorite:", error);
            message.error("Failed to update favorites");
        }
    };

    const updateNote = async (id, data) => {
        try {
            const token = localStorage.getItem("jwt");
            await axios.put(`${apiUrl}/notes/${id}`, data, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setNotes(notes.map(n => n._id === id ? { ...n, ...data } : n));
        } catch (error) {
            console.error("Error updating note:", error);
        }
    };

    const searchNotes = async (query) => {
        if (!query) return fetchNotes();
        setIsLoading(true);
        try {
            const token = localStorage.getItem("jwt");
            const res = await axios.get(`${apiUrl}/notes/search?query=${query}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setNotes(res.data.notes);
        } catch (error) {
            console.error("Error searching notes:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (isAuth) fetchNotes();
    }, [isAuth]);

    const [selectedCategory, setSelectedCategory] = useState('home');
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);
    const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);

    return (
        <NoteContext.Provider value={{
            notes,
            activeNote,
            setActiveNote,
            isLoading,
            recentShared,
            selectedCategory,
            setSelectedCategory,
            isSidebarCollapsed,
            setIsSidebarCollapsed,
            isNoteModalOpen,
            setIsNoteModalOpen,
            fetchNotes,
            createNote,
            updateNote,
            toggleFavorite,
            deleteNote,
            searchNotes
        }}>
            {children}
        </NoteContext.Provider>
    );
};

export const useNotes = () => useContext(NoteContext);
