import React from 'react';
import style from './SingleLineView.module.css';

const SingleLineView = (props) => (
    <div className={style.SingleLineView}>
        <p>{props.statistic.confirmed}</p><p>{props.statistic.confirmed_diff}</p><p>{props.statistic.deaths}</p><p>{props.statistic.recovered}</p>
    </div>
)

export default SingleLineView;