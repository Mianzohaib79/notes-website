import React from 'react';
import { Card, Typography, Tag, Space } from 'antd';
import { StarOutlined, StarFilled, ShareAltOutlined, ClockCircleOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const { Title, Text, Paragraph } = Typography;

const NoteCard = ({ note, onClick, isFavorite, onToggleFavorite }) => {
    // Pastel Gradient Palette
    const gradients = [
        'var(--grad-purple)',
        'var(--grad-blue)',
        'var(--grad-peach)',
        'var(--grad-mint)',
        'var(--grad-yellow)',
        'var(--grad-pink)',
        'var(--grad-cyan)'
    ];

    // Pick a gradient based on the note ID (or index)
    const getGradient = (id) => {
        if (!id) return gradients[0];
        const hash = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        return gradients[hash % gradients.length];
    };

    const cardGradient = getGradient(note._id);

    // Strip HTML for the preview text
    const previewText = (typeof note.content === 'string') 
        ? note.content.replace(/<[^>]*>/g, '').substring(0, 100) 
        : "No content";

    return (
        <Card 
            hoverable 
            onClick={onClick}
            style={{ 
                height: '100%', 
                borderRadius: '20px', 
                border: 'none',
                background: cardGradient,
                boxShadow: 'var(--premium-shadow)',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
            bodyStyle={{ padding: '24px' }}
            className="note-card fade-in"
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <Title level={5} style={{ margin: 0, fontSize: '18px', fontWeight: '700', color: 'rgba(0,0,0,0.8)' }} ellipsis={{ rows: 1 }}>
                    {note.title || "Untitled Note"}
                </Title>
                <div 
                    onClick={(e) => { e.stopPropagation(); onToggleFavorite && onToggleFavorite(note._id); }} 
                    style={{ 
                        cursor: 'pointer', 
                        fontSize: '20px',
                        transition: 'transform 0.2s ease',
                    }}
                    className="favorite-btn"
                >
                    {isFavorite ? <StarFilled style={{ color: '#f59e0b', filter: 'drop-shadow(0 0 4px rgba(245,158,11,0.4))' }} /> : <StarOutlined style={{ color: 'rgba(0,0,0,0.4)' }} />}
                </div>
            </div>

            <Paragraph 
                style={{ 
                    fontSize: '14px', 
                    height: '44px', 
                    marginBottom: '20px', 
                    color: 'rgba(0,0,0,0.6)',
                    lineHeight: '1.6'
                }} 
                ellipsis={{ rows: 2 }}
            >
                {previewText}
            </Paragraph>

            <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Space size={6} style={{ fontSize: '12px', color: 'rgba(0,0,0,0.4)', fontWeight: '500' }}>
                    <ClockCircleOutlined />
                    {dayjs(note.updatedAt).format('MMM D, YYYY')}
                </Space>
                {note.sharedWith && note.sharedWith.length > 0 && (
                    <Tag 
                        icon={<ShareAltOutlined />} 
                        style={{ 
                            margin: 0, 
                            fontSize: '10px', 
                            borderRadius: '20px', 
                            background: 'rgba(255,255,255,0.4)',
                            border: '1px solid rgba(0,0,0,0.05)',
                            color: 'rgba(0,0,0,0.6)',
                            fontWeight: '600',
                            padding: '2px 8px'
                        }}
                    >
                        Shared
                    </Tag>
                )}
            </div>
        </Card>
    );
};


export default NoteCard;
