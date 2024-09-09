import React from 'react';
import styles from './Avatar.module.css';

interface AvatarProps {
    src: string;
    alt: string;
    scale?: number;
    top?: string | number;
    width?: string | number;
    height?: string | number;
}

export const Avatar: React.FC<AvatarProps> = ({
    src,
    alt,
    scale = 1,
    top = 0,
    width = '25px',
    height = '25px',
}) => {
    // Inline style object
    const imgStyle = {
        width,
        height,
        transform: `scale(${scale})`,
        paddingTop: top,
    };

    return (
        <span className={styles.avatar} style={{ width, height }}>
            <img src={src} alt={alt} style={imgStyle} />
        </span>
    );
};
