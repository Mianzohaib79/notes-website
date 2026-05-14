import React, { useState, useEffect, useRef, useMemo } from 'react';
import JoditEditor from 'jodit-react';
import { io } from 'socket.io-client';
import { Button, Input, Space, Typography, message, Spin, Alert, Popconfirm } from 'antd';
import {
    SaveOutlined,
    ShareAltOutlined,
    InfoCircleOutlined,
    EditOutlined,
    StarOutlined,
    StarFilled,
    DeleteOutlined
} from '@ant-design/icons';
import { useNotes } from '../../context/NoteContext';
import { useAuth } from '../../context/Auth';

const { Title, Text } = Typography;

// Functional fallback for the editor
const EditorFallback = () => (
    <div style={{ padding: '40px', textAlign: 'center' }}>
        <Alert
            message="Editor Load Error"
            description="The rich text library encountered a problem. Switching to stable fallback mode..."
            type="warning"
            showIcon
            icon={<InfoCircleOutlined />}
        />
        <Button
            type="primary"
            icon={<EditOutlined />}
            style={{ marginTop: '20px' }}
            onClick={() => window.location.reload()}
        >
            Reload Workspace
        </Button>
    </div>
);

const EditorContent = ({ note, onShare, onDelete }) => {
    const { user } = useAuth();
    const { updateNote, toggleFavorite, deleteNote } = useNotes();
    const [content, setContent] = useState('');
    const [title, setTitle] = useState('');
    const [socket, setSocket] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);
    const [showRichText, setShowRichText] = useState(false);
    const [hasError, setHasError] = useState(false);
    const editor = useRef(null);

    const config = useMemo(() => ({
        readonly: false,
        placeholder: 'Describe your brilliant ideas...',
        height: 450,
        toolbarSticky: false,
        theme: 'default',
        // Minimal configuration to keep it clean
    }), []);

    // Safety check and Title sync
    useEffect(() => {
        if (note?._id) {
            setContent(note.content || '');
            setTitle(note.title || '');
            setIsLoaded(true);

            // DELAY current rich text mount to avoid Modal animation conflicts
            const timer = setTimeout(() => setShowRichText(true), 400);
            return () => clearTimeout(timer);
        } else {
            setIsLoaded(false);
            setShowRichText(false);
        }
    }, [note?._id]);

    // Socket.io for real-time collaboration
    useEffect(() => {
        if (!note?._id) return;

        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
        let s;
        try {
            s = io(apiUrl);
            setSocket(s);
            s.emit('join-note', note._id);
            s.on('note-updated', (newContent) => {
                if (typeof newContent === 'string' && newContent !== content) {
                    setContent(newContent);
                }
            });
        } catch (err) {
            console.error("Socket error:", err);
        }

        return () => {
            if (s) {
                s.emit('leave-note', note._id);
                s.disconnect();
            }
        };
    }, [note?._id]);

    const handleContentChange = (value) => {
        setContent(value);
        if (socket && note?._id) {
            socket.emit('edit-note', { noteId: note._id, content: value });
        }
    };

    const handleSave = async () => {
        if (!note?._id) return;
        setIsSaving(true);
        try {
            await updateNote(note._id, { title, content });
            message.success('Note saved successfully');
        } catch (error) {
            message.error('Failed to save note');
        } finally {
            setIsSaving(false);
        }
    };

    const handleFavorite = async () => {
        if (!note?._id) return;
        try {
            await toggleFavorite(note._id);
        } catch (err) {
            message.error('Failed to update favorite status');
        }
    };

    const handleDelete = async () => {
        if (!note?._id) return;
        setIsDeleting(true);
        const success = await deleteNote(note._id);
        if (success) {
            message.success('Note deleted permanently');
            if (onDelete) onDelete();
        } else {
            message.error('Failed to delete note');
            setIsDeleting(false);
        }
    };

    // Ultra-robust comparison with trim and String conversion to handle all potential data types
    const isFavorite = user?.favorites?.some(favId =>
        favId && note?._id && String(favId).trim() === String(note._id).trim()
    );

    if (!note || !isLoaded) {
        return (
            <div style={{ padding: '100px', textAlign: 'center' }}>
                <Spin size="large" tip="Synthesizing note..." />
            </div>
        );
    }

    return (
        <div className="editor-container fade-in" style={{ padding: '32px', backgroundColor: 'var(--github-bg)', minHeight: '600px', borderRadius: '24px' }}>
            <div style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1 }}>
                    <Input
                        variant="borderless"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        style={{ fontSize: '28px', fontWeight: '800', padding: 0, color: 'var(--github-text)', letterSpacing: '-0.5px' }}
                        placeholder="Untitled Masterpiece..."
                    />
                    <Button
                        type="text"
                        icon={isFavorite ? <StarFilled style={{ color: '#f59e0b' }} /> : <StarOutlined />}
                        onClick={handleFavorite}
                        className="hover-scale"
                        style={{ fontSize: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    />
                </div>
                <Space size="middle">
                    <Popconfirm
                        title="Delete this note?"
                        description="This action cannot be undone."
                        onConfirm={handleDelete}
                        okText="Yes"
                        cancelText="No"
                        okButtonProps={{ danger: true, className: 'rounded-pill' }}
                        cancelButtonProps={{ className: 'rounded-pill' }}
                    >
                        <Button
                            danger
                            type="text"
                            icon={<DeleteOutlined />}
                            loading={isDeleting}
                            className="hover-scale"
                            style={{ fontSize: '18px' }}
                        />
                    </Popconfirm>
                    <Button
                        ghost
                        type="primary"
                        icon={<ShareAltOutlined />}
                        onClick={onShare}
                        className="btn-premium border-primary text-primary"
                        style={{ background: 'transparent' }}
                    >
                        Share
                    </Button>
                    <Button
                        type="primary"
                        icon={<SaveOutlined />}
                        onClick={handleSave}
                        loading={isSaving}
                        className="btn-premium"
                    >
                        Save Note
                    </Button>
                </Space>
            </div>

            <div className="editor-workspace shadow-sm" style={{ borderRadius: '16px', border: '1px solid var(--github-border)', overflow: 'hidden', background: '#fff' }}>
                {!showRichText || hasError ? (
                    <Input.TextArea
                        value={content || ''}
                        onChange={(e) => handleContentChange(e.target.value)}
                        placeholder="Start your thoughts here..."
                        className="form-control-premium border-0"
                        style={{
                            height: '450px',
                            padding: '24px',
                            fontSize: '16px',
                            border: 'none',
                            resize: 'none',
                        }}
                    />
                ) : (
                    <div className="jodit-wrapper" style={{ minHeight: '450px', marginBottom: '42px' }}>
                        <JoditEditor
                            ref={editor}
                            value={content || ''}
                            config={config}
                            tabIndex={1}
                            onBlur={handleContentChange}
                            onChange={(newContent) => {
                                // Real-time sync handled via onBlur for performance, 
                                // but we can add logic here if needed.
                                // However, user said not to add extra logic.
                            }}
                        />
                    </div>
                )}
            </div>
            {hasError && (
                <div style={{ marginTop: '16px', textAlign: 'center' }}>
                    <Text type="secondary" style={{ fontSize: '12px' }}>
                        <InfoCircleOutlined /> Switched to stable compatibility mode.
                    </Text>
                </div>
            )}
        </div>

    );
};

const Editor = (props) => (
    <EditorContent {...props} />
);

export default Editor;
