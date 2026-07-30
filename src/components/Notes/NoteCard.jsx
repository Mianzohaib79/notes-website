import React from 'react';
import { Card, Typography, Tag, Space } from 'antd';
import { StarOutlined, StarFilled, ShareAltOutlined, ClockCircleOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { useAuth } from '../../context/Auth';

const { Title, Text, Paragraph } = Typography;

const NoteCard = ({ note, onClick, isFavorite, onToggleFavorite }) => {
    const { user } = useAuth();
    const currentUserId = user?._id ? String(user._id) : null;
    const creatorId = String(note?.createdBy?._id || note?.createdBy || '');
    const isOwner = currentUserId ? creatorId === currentUserId : true;
    const authorName = note?.createdBy?.name || 'User';

    // Vibrant Pastel Gradient Palette
    const gradients = [
        'var(--grad-purple)',
        'var(--grad-blue)',
        'var(--grad-peach)',
        'var(--grad-mint)',
        'var(--grad-yellow)',
        'var(--grad-pink)',
        'var(--grad-cyan)',
        'var(--grad-emerald)'
    ];

    // Pick a gradient based on the note ID
    const getGradient = (id) => {
        if (!id) return gradients[0];
        const hash = String(id).split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        return gradients[hash % gradients.length];
    };

    const cardGradient = getGradient(note._id);

    // Strip HTML for clean preview text
    const previewText = (typeof note.content === 'string') 
        ? note.content.replace(/<[^>]*>/g, '').trim() || "No content"
        : "No content";

    return (
        <Card 
            hoverable 
            onClick={onClick}
            style={{ 
                height: '100%', 
                borderRadius: '22px', 
                background: cardGradient,
                boxShadow: 'var(--premium-shadow)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                position: 'relative',
                overflow: 'hidden'
            }}
            bodyStyle={{ padding: '22px', display: 'flex', flexDirection: 'column', height: '100%' }}
            className="note-card"
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <Title level={5} style={{ margin: 0, fontSize: '17px', fontWeight: '800', color: '#0f172a', letterSpacing: '-0.3px' }} ellipsis={{ rows: 1 }}>
                    {note.title || "Untitled Note"}
                </Title>
                <div 
                    onClick={(e) => { e.stopPropagation(); onToggleFavorite && onToggleFavorite(note._id); }} 
                    style={{ 
                        cursor: 'pointer', 
                        fontSize: '20px',
                        padding: '4px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.2s ease',
                    }}
                    className={`favorite-btn ${isFavorite ? 'star-pop-animation' : ''}`}
                >
                    {isFavorite ? (
                        <StarFilled style={{ color: '#f59e0b', filter: 'drop-shadow(0 2px 6px rgba(245,158,11,0.5))' }} />
                    ) : (
                        <StarOutlined style={{ color: 'rgba(15, 23, 42, 0.35)' }} />
                    )}
                </div>
            </div>

            <Paragraph 
                style={{ 
                    fontSize: '13px', 
                    height: '42px', 
                    marginBottom: '16px', 
                    color: 'rgba(15, 23, 42, 0.7)',
                    lineHeight: '1.6',
                    fontWeight: '400'
                }} 
                ellipsis={{ rows: 2 }}
            >
                {previewText}
            </Paragraph>

            <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '10px' }}>
                <Space size={6} style={{ fontSize: '11px', color: 'rgba(15, 23, 42, 0.5)', fontWeight: '600' }}>
                    <ClockCircleOutlined />
                    {dayjs(note.updatedAt).format('MMM D, YYYY')}
                </Space>
                {!isOwner ? (
                    <Tag 
                        icon={<ShareAltOutlined />} 
                        style={{ 
                            margin: 0, 
                            fontSize: '10px', 
                            borderRadius: '20px', 
                            background: 'rgba(255, 255, 255, 0.75)',
                            border: '1px solid rgba(9, 105, 218, 0.2)',
                            color: '#0969da',
                            fontWeight: '700',
                            padding: '2px 8px',
                            boxShadow: '0 2px 6px rgba(0,0,0,0.03)'
                        }}
                    >
                        Shared by {authorName}
                    </Tag>
                ) : (note.sharedWith && note.sharedWith.length > 0 && (
                    <Tag 
                        icon={<ShareAltOutlined />} 
                        style={{ 
                            margin: 0, 
                            fontSize: '10px', 
                            borderRadius: '20px', 
                            background: 'rgba(255, 255, 255, 0.65)',
                            border: '1px solid rgba(255, 255, 255, 0.8)',
                            color: '#0969da',
                            fontWeight: '700',
                            padding: '2px 8px',
                            boxShadow: '0 2px 6px rgba(0,0,0,0.03)'
                        }}
                    >
                        Shared
                    </Tag>
                ))}
            </div>
        </Card>
    );
};

export default NoteCard;
