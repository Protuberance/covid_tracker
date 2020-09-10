import React from 'react';
import style from './DropdownList.module.css';

const DropdownList = (props) => (
    <div className={style.DropdownDataContainer}>
        <select value={props.selectedName} onChange={props.onChange}>
            <option disabled value={props.selectedName}>{props.selectedName}</option>
            {
                props.dropdownData.map((item) => (
                    <option key={item} value={item}>{item}</option>
                ))
            }
        </select>
    </div>
)

export default DropdownList;