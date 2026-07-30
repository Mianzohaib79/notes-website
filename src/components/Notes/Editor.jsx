import React, { useState, useEffect, useRef, useMemo } from 'react';
import JoditEditor from 'jodit-react';
// import { io } from 'socket.io-client';
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
    const [title, setTitle] = useState('');
    const [initialContent, setInitialContent] = useState('');
    const contentRef = useRef('');
    const editor = useRef(null);

    const [isSaving, setIsSaving] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);
    const [showRichText, setShowRichText] = useState(false);
    const [hasError] = useState(false);

    const config = useMemo(() => ({
        readonly: false,
        placeholder: 'Start writing your brilliant note here...',
        height: 420,
        toolbarSticky: false,
        theme: 'default',
        wrap: true,
        direction: 'ltr',
        buttons: [
            'bold', 'italic', 'underline', 'strikethrough', '|',
            'font', 'fontsize', 'paragraph', '|',
            'ul', 'ol', 'align', '|',
            'undo', 'redo', '|',
            'hr', 'table', 'link', '|',
            'fullsize'
        ],
        removeButtons: ['source', 'about'],
        showXPathInStatusbar: false,
        showCharsCounter: true,
        showWordsCounter: true
    }), []);

    // Sync note data on load or note change
    useEffect(() => {
        if (note?._id) {
            const rawContent = note.content || '';
            contentRef.current = rawContent;
            setInitialContent(rawContent);
            setTitle(note.title || '');
            setIsLoaded(true);

            // Smooth delayed mount to prevent modal animation glitches
            const timer = setTimeout(() => setShowRichText(true), 250);
            return () => clearTimeout(timer);
        } else {
            setIsLoaded(false);
            setShowRichText(false);
        }
    }, [note?._id, note?.content, note?.title]);

    const handleSave = async () => {
        if (!note?._id) return;
        setIsSaving(true);
        const latestContent = editor.current?.value ?? contentRef.current ?? initialContent;
        try {
            await updateNote(note._id, { title, content: latestContent });
            contentRef.current = latestContent;
            message.success('Note saved successfully');
        } catch {
            message.error('Failed to save note');
        } finally {
            setIsSaving(false);
        }
    };

    const handleFavorite = async () => {
        if (!note?._id) return;
        try {
            await toggleFavorite(note._id);
        } catch {
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

    const isFavorite = user?.favorites?.some(favId =>
        favId && note?._id && String(favId).trim() === String(note._id).trim()
    );

    if (!note || !isLoaded) {
        return (
            <div style={{ padding: '80px', textAlign: 'center', backgroundColor: '#fff' }}>
                <Spin size="large" tip="Opening note workspace..." />
            </div>
        );
    }

    return (
        <div className="editor-container fade-in" style={{ padding: window.innerWidth < 768 ? '16px' : '28px 32px', backgroundColor: '#fff', borderRadius: '24px' }}>
            <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexDirection: window.innerWidth < 768 ? 'column' : 'row', gap: '14px', borderBottom: '1px solid #f1f5f9', paddingBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, width: '100%' }}>
                    <Input
                        variant="borderless"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        style={{ fontSize: window.innerWidth < 768 ? '20px' : '24px', fontWeight: '800', padding: 0, color: 'var(--github-text)', letterSpacing: '-0.3px' }}
                        placeholder="Untitled Note..."
                    />
                    <Button
                        type="text"
                        icon={isFavorite ? <StarFilled style={{ color: '#f59e0b', fontSize: '22px' }} /> : <StarOutlined style={{ fontSize: '22px', color: '#94a3b8' }} />}
                        onClick={handleFavorite}
                        className="hover-scale p-0"
                        style={{ width: '38px', height: '38px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    />
                </div>
                <Space size="middle" wrap style={{ width: window.innerWidth < 768 ? '100%' : 'auto', justifyContent: 'flex-end' }}>
                    <Popconfirm
                        title="Delete this note?"
                        description="Are you sure you want to delete this note?"
                        onConfirm={handleDelete}
                        okText="Delete"
                        cancelText="Cancel"
                        okButtonProps={{ danger: true, className: 'rounded-pill' }}
                        cancelButtonProps={{ className: 'rounded-pill' }}
                    >
                        <Button
                            danger
                            type="text"
                            icon={<DeleteOutlined />}
                            loading={isDeleting}
                            className="hover-scale"
                            style={{ fontSize: '17px', borderRadius: '10px' }}
                        />
                    </Popconfirm>
                    <Button
                        ghost
                        type="primary"
                        icon={<ShareAltOutlined />}
                        onClick={onShare}
                        className="btn-premium border-primary text-primary"
                        style={{ background: 'transparent', borderRadius: '10px' }}
                    >
                        Share
                    </Button>
                    <Button
                        type="primary"
                        icon={<SaveOutlined />}
                        onClick={handleSave}
                        loading={isSaving}
                        className="btn-premium"
                        style={{ borderRadius: '10px', fontWeight: 600, padding: '6px 20px' }}
                    >
                        Save Note
                    </Button>
                </Space>
            </div>

            <div className="editor-workspace shadow-sm" style={{ borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden', background: '#fff' }}>
                {!showRichText || hasError ? (
                    <Input.TextArea
                        value={contentRef.current || initialContent}
                        onChange={(e) => {
                            contentRef.current = e.target.value;
                        }}
                        placeholder="Start typing your thoughts here..."
                        className="form-control-premium border-0"
                        style={{
                            height: window.innerWidth < 768 ? '300px' : '420px',
                            padding: '20px 24px',
                            fontSize: '15px',
                            border: 'none',
                            resize: 'none',
                            lineHeight: '1.7'
                        }}
                    />
                ) : (
                    <div className="jodit-wrapper" style={{ minHeight: window.innerWidth < 768 ? '300px' : '420px', width: '100%', overflowX: 'hidden' }}>
                        <JoditEditor
                            ref={editor}
                            value={initialContent}
                            config={config}
                            tabIndex={1}
                            onBlur={(newContent) => {
                                contentRef.current = newContent;
                            }}
                            onChange={(newContent) => {
                                contentRef.current = newContent;
                            }}
                        />
                    </div>
                )}
            </div>
            {hasError && (
                <div style={{ marginTop: '12px', textAlign: 'center' }}>
                    <Text type="secondary" style={{ fontSize: '12px' }}>
                        <InfoCircleOutlined /> Switched to fallback compatibility editor.
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
