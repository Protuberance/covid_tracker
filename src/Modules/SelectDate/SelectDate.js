import React from 'react';
import style from './SelectDate.module.css'
const SelectDate = (props) => {

    if (props.currentDate === props.maxDate) {
        return (
            <div className={style.SelectDate}>
                <p className={style.inline}>Выберите дату: </p><div className={`${style.inline} ${style.arrow}`} onClick={props.rewind}></div><input className={style.inline} type="date" name="calendar" value={props.currentDate} min={props.minDate} max={props.maxDate} onChange={props.onChange}></input>
            </div>
        )
    } else if (props.currentDate === props.minDate) {
        return (
            <div className={style.SelectDate}>
                <p className={style.inline}>Выберите дату: </p><input className={style.inline} type="date" name="calendar" value={props.currentDate} min={props.minDate} max={props.maxDate} onChange={props.onChange}></input><div className={`${style.inline} ${style.arrow} ${style.right}`} onClick={props.forward}></div>
            </div>
        )
    } else {
        return (
            <div className={style.SelectDate}>
                <p className={style.inline}>Выберите дату: </p><div className={`${style.inline} ${style.arrow}`} onClick={props.rewind}></div><input className={style.inline} type="date" name="calendar" value={props.currentDate} min={props.minDate} max={props.maxDate} onChange={props.onChange}></input><div className={`${style.inline} ${style.arrow} ${style.right}`} onClick={props.forward}></div>
            </div>
        )
    }
}

export default SelectDate;