import React from 'react';
import style from './ColumnsTitle.module.css';

const ColumnsTitle = (props) => (
    <div className={style.ColumnsTitle}>
        <p>Всего:</p><p>Новых:</p><p>Смертей:</p><p>Окрепшие:</p>
    </div>
)

export default ColumnsTitle;