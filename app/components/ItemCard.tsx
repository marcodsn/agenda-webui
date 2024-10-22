import React from 'react';
import styles from './ItemCard.module.css';

interface ItemCardProps {
    title: string;
    subtitle?: string;
    taskColor?: string;
    onClick?: () => void;
}

const ItemCard: React.FC<ItemCardProps> = ({
    title,
    subtitle,
    taskColor,
    onClick
}) => {
    const defaultBackgroundColor = 'var(--color-light-gray)';
    const defaultBorderColor = 'var(--color-silver)';

    const getDarkerColor = (color: string) => {
        const rgb = parseInt(color.slice(1), 16);
        const r = Math.max(0, (rgb >> 16) - 40);
        const g = Math.max(0, ((rgb >> 8) & 0x00FF) - 40);
        const b = Math.max(0, (rgb & 0x0000FF) - 40);
        return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
    };

    // Very much WIP section!!!!!
    // const bgColor = backgroundColor || defaultBackgroundColor;
    const bgColor = '#262626';
    // const bdColor = borderColor || (backgroundColor ? getDarkerColor(bgColor) : defaultBorderColor);
    const bdColor = taskColor || defaultBackgroundColor;

    return (
        <div
            className={styles.itemCard}
            style={{ borderColor: bdColor }}
            onClick={onClick}
        >
            {/* <h3 className={styles.title}>{title}</h3> */}
            <span className={styles.title}>{title}</span>
            {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        </div>
    );
};

export default ItemCard;