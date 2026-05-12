import React, { useState } from 'react';
import { Col, Row, Typography, Button, Empty } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useAuth } from '../../../context/Auth';
import { useNotes } from '../../../context/NoteContext';
import Editor from '../../../components/Notes/Editor';
import ShareModal from '../../../components/Notes/ShareModal';
import NoteCard from '../../../components/Notes/NoteCard';

const { Title, Text } = Typography;

const Hero = ({ selectedCategory, filteredNotes, onNewNote, onEditNote }) => {
    const { user } = useAuth();
    const { fetchNotes, toggleFavorite } = useNotes();

    const getTitle = () => {
        if (selectedCategory === 'favorites') return 'Favorite Notes';
        if (selectedCategory === 'shared') return 'Shared with Me';
        if (selectedCategory === 'all') return 'All My Notes';
        return `Welcome back, ${user?.name || 'User'}`;
    };

    return (
        <div className='home-hero fade-in' style={{ padding: '80px 0 24px 0' }}>
            <div className="container-fluid" style={{ maxWidth: '1100px' }}>
                <div className="d-flex justify-content-between align-items-center mb-5">
                    <div>
                        <Title level={2} style={{ margin: 0, fontWeight: 800, letterSpacing: '-0.5px' }}>
                            {getTitle()}
                        </Title>
                        <Text type="secondary" style={{ fontSize: '14px' }}>
                            {selectedCategory === 'all' ? 'Browse through all your personal and shared notes.' : 'Manage your thoughts and ideas in one place.'}
                        </Text>
                    </div>
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        className="btn-premium"
                        onClick={onNewNote}
                    >
                        Create Note
                    </Button>
                </div>

                <div className="category-view">
                    {filteredNotes.length > 0 ? (
                        <Row gutter={[24, 24]}>
                            {filteredNotes.map(note => (
                                <Col xs={24} sm={12} md={8} lg={8} key={note._id}>
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
                        <div className="shadow-sm" style={{ padding: '80px 0', textAlign: 'center', backgroundColor: '#fff', borderRadius: '24px', border: '1px dashed var(--github-border)' }}>
                            <Empty description={<Text type="secondary" style={{ fontSize: '15px' }}>No notes found in <Text strong>{selectedCategory}</Text></Text>} />
                            <Button type="primary" icon={<PlusOutlined />} onClick={onNewNote} className="btn-premium mt-4">
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
