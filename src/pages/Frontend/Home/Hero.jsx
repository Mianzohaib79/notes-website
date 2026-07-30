import React from 'react';
import { Col, Row, Typography, Button, Empty, Tag, Space } from 'antd';
import { PlusOutlined, FileTextOutlined, StarFilled, ShareAltOutlined } from '@ant-design/icons';
import { useAuth } from '../../../context/Auth';
import { useNotes } from '../../../context/NoteContext';
import NoteCard from '../../../components/Notes/NoteCard';

const { Title, Text } = Typography;

const Hero = ({ selectedCategory, filteredNotes, onNewNote, onEditNote }) => {
    const { user } = useAuth();
    const { toggleFavorite } = useNotes();

    const getTitle = () => {
        if (selectedCategory === 'favorites') return 'Favorite Notes';
        if (selectedCategory === 'shared') return 'Shared with Me';
        if (selectedCategory === 'all') return 'All My Notes';
        return `Welcome back, ${user?.name || 'User'}`;
    };

    const getCategoryIcon = () => {
        if (selectedCategory === 'favorites') return <StarFilled style={{ color: '#f59e0b' }} />;
        if (selectedCategory === 'shared') return <ShareAltOutlined style={{ color: '#0969da' }} />;
        return <FileTextOutlined style={{ color: '#0969da' }} />;
    };

    return (
        <div className='home-hero fade-in' style={{ padding: '36px 24px 36px 24px' }}>
            <div className="container-fluid" style={{ maxWidth: '1200px', margin: '0 auto' }}>
                <div className="d-flex justify-content-between align-items-md-center flex-column flex-md-row gap-3 mb-4 pb-2"
                     style={{ borderBottom: '1px solid rgba(226, 232, 240, 0.6)' }}>
                    <div>
                        <Space size={8} align="center" style={{ marginBottom: '6px' }}>
                            <Tag color="blue" style={{ borderRadius: '20px', padding: '2px 12px', fontWeight: '600', border: 'none', background: 'rgba(9, 105, 218, 0.1)', color: '#0969da' }}>
                                {getCategoryIcon()} <span style={{ marginLeft: '4px' }}>{selectedCategory.toUpperCase()}</span>
                            </Tag>
                            <Tag style={{ borderRadius: '20px', padding: '2px 10px', fontWeight: '600', border: '1px solid #e2e8f0', background: '#fff', color: '#64748b' }}>
                                {filteredNotes.length} {filteredNotes.length === 1 ? 'Note' : 'Notes'}
                            </Tag>
                        </Space>
                        <Title level={2} style={{ margin: 0, fontWeight: 800, letterSpacing: '-0.5px', color: '#0f172a', fontSize: '28px' }}>
                            {getTitle()}
                        </Title>
                        <Text type="secondary" style={{ fontSize: '14px', color: '#64748b' }}>
                            {selectedCategory === 'all'
                                ? 'Browse through all your personal notes.'
                                : selectedCategory === 'shared'
                                ? 'Notes shared with you by other users.'
                                : 'Manage your thoughts and ideas in one place.'}
                        </Text>
                    </div>
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        className="btn-premium"
                        onClick={onNewNote}
                        size="large"
                        style={{ height: '46px', borderRadius: '14px', fontSize: '15px' }}
                    >
                        Create Note
                    </Button>
                </div>

                <div className="category-view">
                    {filteredNotes.length > 0 ? (
                        <Row gutter={[20, 20]}>
                            {filteredNotes.map((note, index) => (
                                <Col xs={24} sm={12} md={8} lg={8} key={note._id}
                                     style={{ animationDelay: `${index * 0.05}s` }}
                                     className="fade-in">
                                    <NoteCard
                                        note={note}
                                        onClick={() => onEditNote(note)}
                                        isFavorite={user?.favorites?.some(favId => String(favId?._id || favId) === String(note._id))}
                                        onToggleFavorite={toggleFavorite}
                                    />
                                </Col>
                            ))}
                        </Row>
                    ) : (
                        <div style={{ padding: '90px 20px', textAlign: 'center', backgroundColor: '#fff', borderRadius: '24px', border: '1px dashed #cbd5e1', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
                            <Empty 
                                image={Empty.PRESENTED_IMAGE_SIMPLE}
                                description={
                                    <div>
                                        <Title level={4} style={{ margin: '8px 0 4px 0', color: '#334155', fontWeight: 700 }}>
                                            No notes in {selectedCategory}
                                        </Title>
                                        <Text type="secondary" style={{ fontSize: '14px' }}>
                                            Your digital workspace is clear. Ready to create something new?
                                        </Text>
                                    </div>
                                } 
                            />
                            <Button type="primary" icon={<PlusOutlined />} onClick={onNewNote} className="btn-premium mt-4" size="large">
                                Add Your First Note
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Hero;
