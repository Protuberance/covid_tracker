import React from 'react';
import style from './Title.module.css';

const Title = (props) => (
    <div className={style.Title}>
        <p>{props.text}</p>
    </div>
)

export default Title;