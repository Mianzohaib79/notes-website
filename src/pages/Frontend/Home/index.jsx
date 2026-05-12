import React, { useState, useMemo } from 'react';
import { Layout, Menu, Typography, Input, List, Button, Space, Tooltip, Divider, Modal, Form, message } from 'antd';
import {
    FileTextOutlined,
    StarOutlined,
    TagOutlined,
    DeleteOutlined,
    FolderOpenOutlined,
    ShareAltOutlined,
    PlusOutlined
} from '@ant-design/icons';
import Hero from './Hero';
import Editor from '../../../components/Notes/Editor';
import ShareModal from '../../../components/Notes/ShareModal';
import { useNotes } from '../../../context/NoteContext';
import { useAuth } from '../../../context/Auth';

const { Sider, Content } = Layout;
const { Title, Text } = Typography;

const Home = () => {
    const { user } = useAuth();
    const {
        notes,
        recentShared,
        activeNote,
        setActiveNote,
        createNote,
        searchNotes,
        isSidebarCollapsed,
        setIsSidebarCollapsed,
        setIsNoteModalOpen,
        selectedCategory,
        setSelectedCategory
    } = useNotes();
    const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);

    // Sync with global state to hide Navbar
    React.useEffect(() => {
        setIsNoteModalOpen(isCreateModalVisible || isEditModalVisible);
    }, [isCreateModalVisible, isEditModalVisible, setIsNoteModalOpen]);
    const [isShareModalVisible, setIsShareModalVisible] = useState(false);
    const [form] = Form.useForm();

    const filteredNotes = useMemo(() => {
        switch (selectedCategory) {
            case 'favorites':
                return notes.filter(n =>
                    user?.favorites?.some(favorite => {
                        const favId = String(favorite?._id || favorite);
                        return n?._id && favId === String(n._id);
                    })
                );
            case 'shared':
                return notes.filter(n => String(n.createdBy?._id || n.createdBy) !== String(user?._id));
            case 'all':
            case 'home':
            default:
                return notes;
        }
    }, [notes, selectedCategory, user]);

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
        <Layout style={{ backgroundColor: 'var(--github-bg)', overflow: 'hidden' }}>
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
                    borderRight: '1px solid rgba(0,0,0,0.05)',
                    backgroundColor: '#fff',
                    minHeight: 0,
                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    boxShadow: '4px 0 20px rgba(0,0,0,0.01)',
                }}
                className="custom-sidebar"
            >
                <div style={{ padding: '24px 16px 12px 16px' }}>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <Title level={5} style={{ margin: 0, color: 'var(--github-muted)', textTransform: 'uppercase', fontSize: '11px', letterSpacing: '0.8px' }}>
                            Workspace
                        </Title>
                    </div>
                    <Input.Search
                        placeholder="Search notes..."
                        onSearch={handleSearch}
                        allowClear
                        style={{ marginBottom: '16px' }}
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
                        { key: 'all', icon: <FileTextOutlined />, label: 'All Notes' },
                        { key: 'favorites', icon: <StarOutlined />, label: 'Favorites' },
                        { key: 'shared', icon: <ShareAltOutlined />, label: 'Shared with me' },
                        { key: 'folders', icon: <FolderOpenOutlined />, label: 'Folders' },
                        { type: 'divider' },
                        { key: 'trash', icon: <DeleteOutlined />, label: 'Trash' },
                    ]}
                />

                <Divider style={{ margin: '12px 0' }} />

                <div style={{ padding: '0 16px 24px 16px', overflowY: 'auto', maxHeight: 'calc(100vh - 350px)' }}>
                    <Title level={5} style={{ margin: '0 0 12px 0', color: 'var(--github-muted)', textTransform: 'uppercase', fontSize: '11px', letterSpacing: '0.8px' }}>
                        {selectedCategory === 'all' ? 'Note List' : `${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} Notes`}
                    </Title>
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
                                    padding: '10px 12px',
                                    borderRadius: '6px',
                                    marginBottom: '4px',
                                    border: 'none',
                                    backgroundColor: activeNote?._id === note._id ? 'rgba(9, 105, 218, 0.1)' : 'transparent',
                                    transition: 'background 0.2s',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'flex-start'
                                }}
                                className="note-list-item"
                                onMouseEnter={(e) => {
                                    if (activeNote?._id !== note._id) {
                                        e.currentTarget.style.backgroundColor = 'rgba(140, 149, 159, 0.05)';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (activeNote?._id !== note._id) {
                                        e.currentTarget.style.backgroundColor = 'transparent';
                                    }
                                }}
                            >
                                <Text strong style={{ fontSize: '14px', color: activeNote?._id === note._id ? 'var(--github-primary)' : 'inherit' }} ellipsis>
                                    {note.title || 'Untitled Note'}
                                </Text>
                                <Text type="secondary" style={{ fontSize: '11px' }}>
                                    {new Date(note.updatedAt).toLocaleDateString()}
                                </Text>
                            </List.Item>
                        )}
                        locale={{
                            emptyText: (
                                <div style={{ padding: '40px 20px', textAlign: 'center' }}>
                                    <FileTextOutlined style={{ fontSize: '32px', color: '#cbd5e1', marginBottom: '12px' }} />
                                    <br />
                                    <Text type="secondary" style={{ fontSize: '13px' }}>
                                        Your digital garden is empty.<br />
                                        <Text strong style={{ fontSize: '11px', opacity: 0.7 }}>Plant your first note today.</Text>
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
                transition: 'all 0.3s ease',
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
                width={750}
                centered
                style={{ top: 20 }}
                bodyStyle={{ padding: 0 }}
                destroyOnClose
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