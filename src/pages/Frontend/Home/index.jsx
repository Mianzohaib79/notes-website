import React, { useState, useMemo } from 'react';
import { Layout, Menu, Typography, Input, List, Button, Space, Tooltip, Divider, Modal, Form, message, Badge } from 'antd';
import { FileTextOutlined, StarOutlined, TagOutlined, DeleteOutlined, FolderOpenOutlined, ShareAltOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import Hero from './Hero';
import Editor from '../../../components/Notes/Editor';
import ShareModal from '../../../components/Notes/ShareModal';
import Logo from '../../../components/Misc/Logo';
import { useNotes } from '../../../context/NoteContext';
import { useAuth } from '../../../context/Auth';

const { Sider, Content } = Layout;
const { Title, Text } = Typography;

const Home = () => {
    const { user } = useAuth();
    const { notes, activeNote, setActiveNote, createNote, searchNotes, isSidebarCollapsed, setIsSidebarCollapsed, setIsNoteModalOpen, selectedCategory, setSelectedCategory } = useNotes();
    const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);

    // Sync with global state to hide Navbar
    React.useEffect(() => {
        setIsNoteModalOpen(isCreateModalVisible || isEditModalVisible);
    }, [isCreateModalVisible, isEditModalVisible, setIsNoteModalOpen]);
    const [isShareModalVisible, setIsShareModalVisible] = useState(false);
    const [form] = Form.useForm();

    const filteredNotes = useMemo(() => {
        const currentUserId = user?._id ? String(user._id) : null;
        switch (selectedCategory) {
            case 'favorites':
                return notes.filter(n =>
                    user?.favorites?.some(favorite => {
                        const favId = String(favorite?._id || favorite);
                        return n?._id && favId === String(n._id);
                    })
                );
            case 'shared':
                return notes.filter(n => {
                    const creatorId = String(n.createdBy?._id || n.createdBy);
                    return currentUserId ? creatorId !== currentUserId : false;
                });
            case 'all':
            case 'home':
            default:
                return notes.filter(n => {
                    const creatorId = String(n.createdBy?._id || n.createdBy);
                    return currentUserId ? creatorId === currentUserId : true;
                });
        }
    }, [notes, selectedCategory, user]);

    const sharedNotesCount = useMemo(() => {
        const currentUserId = user?._id ? String(user._id) : null;
        return notes.filter(n => {
            const creatorId = String(n.createdBy?._id || n.createdBy);
            return currentUserId ? creatorId !== currentUserId : false;
        }).length;
    }, [notes, user]);

    const handleMenuClick = (e) => {
        setSelectedCategory(e.key);
        setActiveNote(null);
        setIsEditModalVisible(false);
    };

    const handleEditNote = (note) => {
        setActiveNote(note);
        setIsEditModalVisible(true);
    };

    const handleSearch = (value) => {
        searchNotes(value);
    };

    const handleCreateNote = () => {
        setIsCreateModalVisible(true);
    };

    const handleModalOk = async (values) => {
        const newNote = await createNote(values.title, values.content);
        if (newNote) {
            setIsCreateModalVisible(false);
            form.resetFields();
            message.success("Note created successfully");
        }
    };

    return (
        <Layout style={{ backgroundColor: 'var(--github-bg)', minHeight: '100vh', overflowX: 'hidden' }}>
            {/* Mobile Sidebar Overlay */}
            <div
                className={`sidebar-overlay d-lg-none ${!isSidebarCollapsed ? 'visible' : ''}`}
                onClick={() => setIsSidebarCollapsed(true)}
            />

            <Sider
                width={280}
                theme="light"
                trigger={null}
                collapsible
                collapsed={isSidebarCollapsed}
                collapsedWidth={0}
                onCollapse={(value) => setIsSidebarCollapsed(value)}
                style={{
                    borderRight: '1px solid var(--github-border)',
                    backgroundColor: '#fff',
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    height: '100vh',
                    maxHeight: '100vh',
                    overflow: 'hidden',
                    zIndex: 1050,
                    transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                    boxShadow: '4px 0 24px rgba(15, 23, 42, 0.03)',
                }}
                className="custom-sidebar"
            >
                <div style={{ padding: '16px 16px 12px 16px' }}>
                    {/* Top Logo inside Sidebar */}
                    <div className="d-flex align-items-center mb-3 pb-2" style={{ borderBottom: '1px solid rgba(0,0,0,0.04)' }}>
                        <Logo />
                    </div>

                    <div className="d-flex justify-content-between align-items-center mb-2">
                        <Title level={5} style={{ margin: 0, color: 'var(--github-muted)', textTransform: 'uppercase', fontSize: '11px', letterSpacing: '1px', fontWeight: '700' }}>
                            Workspace
                        </Title>
                    </div>
                    <Input
                        placeholder="Search notes..."
                        prefix={<SearchOutlined style={{ color: '#94a3b8', marginRight: '6px' }} />}
                        onChange={(e) => handleSearch(e.target.value)}
                        allowClear
                        style={{ borderRadius: '10px', padding: '7px 12px', background: '#f8fafc', border: '1px solid #e2e8f0', marginBottom: '12px' }}
                    />
                </div>

                <Menu
                    mode="inline"
                    selectedKeys={[selectedCategory]}
                    onClick={(e) => {
                        handleMenuClick(e);
                        // Auto-close on mobile
                        if (window.innerWidth < 992) {
                            setIsSidebarCollapsed(true);
                        }
                    }}
                    style={{ borderRight: 0, backgroundColor: 'transparent', fontWeight: 500 }}
                    items={[
                        { key: 'all', icon: <FileTextOutlined style={{ fontSize: '16px' }} />, label: 'All Notes' },
                        { key: 'favorites', icon: <StarOutlined style={{ fontSize: '16px' }} />, label: 'Favorites' },
                        {
                            key: 'shared',
                            icon: <ShareAltOutlined style={{ fontSize: '16px' }} />,
                            label: (
                                <div className="d-flex justify-content-between align-items-center w-100 pe-1">
                                    <span>Shared with me</span>
                                    {sharedNotesCount > 0 && (
                                        <Badge
                                            count={sharedNotesCount}
                                            overflowCount={99}
                                            style={{
                                                backgroundColor: '#0969da',
                                                boxShadow: '0 2px 6px rgba(9, 105, 218, 0.35)',
                                                fontSize: '11px',
                                                fontWeight: '700'
                                            }}
                                        />
                                    )}
                                </div>
                            )
                        },
                        { key: 'folders', icon: <FolderOpenOutlined style={{ fontSize: '16px' }} />, label: 'Folders' },
                        { type: 'divider' },
                        { key: 'trash', icon: <DeleteOutlined style={{ fontSize: '16px' }} />, label: 'Trash' },
                    ]}
                />

                <Divider style={{ margin: '12px 0', borderColor: 'var(--github-border)' }} />

                <div style={{ padding: '0 16px 24px 16px', overflowY: 'auto', maxHeight: 'calc(100vh - 360px)' }}>
                    <div className="d-flex justify-content-between align-items-center mb-2">
                        <Title level={5} style={{ margin: 0, color: 'var(--github-muted)', textTransform: 'uppercase', fontSize: '11px', letterSpacing: '1px', fontWeight: '700' }}>
                            {selectedCategory === 'all' ? 'Note List' : `${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} Notes`}
                        </Title>
                        <Text type="secondary" style={{ fontSize: '11px', fontWeight: '600' }}>
                            {filteredNotes.length}
                        </Text>
                    </div>
                    <List
                        size="small"
                        dataSource={filteredNotes}
                        renderItem={note => (
                            <List.Item
                                key={note._id}
                                onClick={() => {
                                    handleEditNote(note);
                                    // Auto-close on mobile
                                    if (window.innerWidth < 992) {
                                        setIsSidebarCollapsed(true);
                                    }
                                }}
                                style={{
                                    cursor: 'pointer',
                                    padding: '12px 14px',
                                    borderRadius: '12px',
                                    marginBottom: '6px',
                                    border: activeNote?._id === note._id ? '1px solid rgba(9, 105, 218, 0.3)' : '1px solid rgba(0, 0, 0, 0.03)',
                                    backgroundColor: activeNote?._id === note._id ? 'rgba(9, 105, 218, 0.08)' : '#fff',
                                    transition: 'all 0.25s ease',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'flex-start',
                                    boxShadow: activeNote?._id === note._id ? '0 4px 12px rgba(9, 105, 218, 0.1)' : '0 2px 4px rgba(0, 0, 0, 0.02)'
                                }}
                                className="note-list-item-card"
                            >
                                <Text strong style={{ fontSize: '13px', color: activeNote?._id === note._id ? 'var(--github-primary)' : '#1e293b', fontWeight: activeNote?._id === note._id ? '700' : '600' }} ellipsis>
                                    {note.title || 'Untitled Note'}
                                </Text>
                                <Text type="secondary" style={{ fontSize: '11px', marginTop: '2px' }}>
                                    {new Date(note.updatedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                </Text>
                            </List.Item>
                        )}
                        locale={{
                            emptyText: (
                                <div style={{ padding: '30px 16px', textAlign: 'center' }}>
                                    <FileTextOutlined style={{ fontSize: '28px', color: '#cbd5e1', marginBottom: '8px' }} />
                                    <br />
                                    <Text type="secondary" style={{ fontSize: '12px' }}>
                                        No notes here yet.
                                    </Text>
                                </div>
                            )
                        }}
                    />
                </div>
            </Sider>
            <Layout style={{
                backgroundColor: 'var(--github-bg)',
                paddingTop: 64, // Matched with Navbar height
                marginLeft: !isSidebarCollapsed && window.innerWidth >= 992 ? 280 : 0,
                transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                width: '100%',
                minHeight: '100vh'
            }}>
                <Content style={{ width: '100%' }}>
                    <main>
                        <Hero
                            selectedCategory={selectedCategory}
                            filteredNotes={filteredNotes}
                            onNewNote={handleCreateNote}
                            onEditNote={handleEditNote}
                        />
                    </main>
                </Content>
            </Layout>
            <Modal
                title={<Title level={4} style={{ margin: 0, fontWeight: 700 }}>New Note</Title>}
                open={isCreateModalVisible}
                onCancel={() => setIsCreateModalVisible(false)}
                onOk={() => form.submit()}
                okText="Create Note"
                okButtonProps={{ className: 'btn-premium' }}
                cancelButtonProps={{ className: 'rounded-pill' }}
                centered
                className="premium-modal"
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleModalOk}
                    initialValues={{ title: '' }}
                    style={{ paddingTop: '20px' }}
                >
                    <Form.Item
                        name="title"
                        label={<Text strong>Title</Text>}
                        rules={[{ required: true, message: 'Give your note a title!' }]}
                    >
                        <Input placeholder="What's on your mind?" className="form-control-premium" />
                    </Form.Item>
                    <Form.Item
                        name="content"
                        label={<Text strong>Initial Thoughts</Text>}
                    >
                        <Input.TextArea rows={5} placeholder="Start typing your brilliance..." className="form-control-premium" />
                    </Form.Item>
                </Form>
            </Modal>


            {/* Note Edit Modal */}
            <Modal
                title={null}
                footer={null}
                open={isEditModalVisible}
                onCancel={() => {
                    setIsEditModalVisible(false);
                    setActiveNote(null);
                }}
                width={820}
                centered
                destroyOnClose
                zIndex={1000}
                className="note-editor-modal"
            >
                <Editor
                    note={activeNote}
                    onShare={() => setIsShareModalVisible(true)}
                    onDelete={() => {
                        setIsEditModalVisible(false);
                        setActiveNote(null);
                    }}
                />
            </Modal>

            <ShareModal
                visible={isShareModalVisible}
                note={activeNote}
                onClose={() => setIsShareModalVisible(false)}
                onRefresh={() => { }} // NoteContext context handle extraction
            />
        </Layout>
    )
}

export default Home;