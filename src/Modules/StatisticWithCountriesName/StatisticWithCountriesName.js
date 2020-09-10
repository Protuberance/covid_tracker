import React from 'react';
import SingleLineView from '../SingleLineView/SingleLineView';
import style from './StatisticWithCountriesName.module.css';

const StatisticWithCountriesName = (props) => (
    <div className={style.flexContainer}>
        <p className={style.inlineBlock}>{props.statistic.name}: </p><SingleLineView statistic={props.statistic}></SingleLineView>
    </div>
)

export default StatisticWithCountriesName;