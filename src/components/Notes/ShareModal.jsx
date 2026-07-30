import React, { useState } from 'react';
import { Modal, Input, Select, List, Typography, Button, Space, message, Tag, Divider } from 'antd';
import { UserAddOutlined, DeleteOutlined, SafetyCertificateOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Text, Title } = Typography;
const { Option } = Select;

const ShareModal = ({ visible, note, onClose, onRefresh }) => {
    const [email, setEmail] = useState('');
    const [permission, setPermission] = useState('viewer');
    const [isProcessing, setIsProcessing] = useState(false);

    const handleShare = async () => {
        if (!email) return message.error('Please enter an email');
        setIsProcessing(true);
        try {
            const token = localStorage.getItem("jwt");
            const apiUrl = import.meta.env.VITE_API_URL
            await axios.post(`${apiUrl}/notes/${note._id}/share`,
                { email, permission },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            message.success(`Shared with ${email}`);
            setEmail('');
            if (onRefresh) onRefresh();
        } catch (error) {
            message.error(error.response?.data?.message || 'Failed to share note');
        } finally {
            setIsProcessing(false);
        }
    };

    const handleRemove = async (userId) => {
        try {
            const token = localStorage.getItem("jwt");
            const apiUrl = import.meta.env.VITE_API_URL
            await axios.delete(`${apiUrl}/notes/${note._id}/remove-user`, {
                data: { userId },
                headers: { Authorization: `Bearer ${token}` }
            });
            message.success('User removed');
            if (onRefresh) onRefresh();
        } catch (error) {
            message.error('Failed to remove user');
        }
    };

    return (
        <Modal
            title={<Title level={4} style={{ margin: 0, fontWeight: 700 }}>Share "{note?.title}"</Title>}
            open={visible}
            onCancel={onClose}
            footer={null}
            width={500}
            zIndex={1300}
            centered
            className="premium-modal"
        >
            <div style={{ marginBottom: '24px', marginTop: '16px' }}>
                <Text strong>Add people</Text>
                <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                    <Input
                        placeholder="user@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <Select value={permission} onChange={setPermission} style={{ width: 120 }}>
                        <Option value="viewer">Viewer</Option>
                        <Option value="editor">Editor</Option>
                    </Select>
                    <Button type="primary" onClick={handleShare} loading={isProcessing}>
                        Add
                    </Button>
                </div>
            </div>

            <Divider />

            <div style={{ maxHeight: '300px', overflow: 'auto' }}>
                <Text strong>People with access</Text>
                <List
                    itemLayout="horizontal"
                    dataSource={note?.sharedWith || []}
                    style={{ marginTop: '12px' }}
                    renderItem={item => (
                        <List.Item
                            actions={[
                                <Button size="small" type="text" danger icon={<DeleteOutlined />} onClick={() => handleRemove(item.userId?._id || item.userId)} />
                            ]}
                        >
                            <List.Item.Meta
                                avatar={<UserAddOutlined style={{ fontSize: '20px', color: 'var(--github-muted)' }} />}
                                title={item.userId?.name || item.userId?.email || 'User'}
                                description={<Tag color={item.permission === 'editor' ? 'blue' : 'default'}>{item.permission}</Tag>}
                            />
                        </List.Item>
                    )}
                />
            </div>
        </Modal>
    );
};

export default ShareModal;
