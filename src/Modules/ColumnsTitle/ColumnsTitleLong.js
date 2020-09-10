import React from 'react';
import style from './ColumnsTitle.module.css';

const ColumnsTitleLong = (props) => {

    if (props.onClick === null || props.onClick === undefined) {
        return (
            <div className={style.ColumnsTitleContainer}>
                <p>Name:</p>

                <div className={style.ColumnsTitle}>
                    <p>Всего:</p><p>Новых:</p><p>Смертей:</p><p>Окрепшие:</p>
                </div>

            </div>
        )
    } else {
        return (
            <div className={style.ColumnsTitleContainer}>
                <p>Name:</p>

                <div className={style.ColumnsTitle}>
                    <p onClick={props.onClick} className={style.clickable}>Всего:</p><p onClick={props.onClick} className={style.clickable}>Новых:</p><p onClick={props.onClick} className={style.clickable}>Смертей:</p><p onClick={props.onClick} className={style.clickable}>Окрепшие:</p>
                </div>

            </div>
        )
    }

}



export default ColumnsTitleLong;