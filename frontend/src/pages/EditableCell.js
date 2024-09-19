import React, { useState, useEffect } from 'react';
import { Input, DatePicker } from 'antd';
import moment from 'moment';

const EditableCell = ({ value, onChange, isEditing, isDate, disabled }) => {
  const [currentValue, setCurrentValue] = useState(value);

  useEffect(() => {
    setCurrentValue(value);
  }, [value]);

  const handleChange = (e) => {
    const newValue = isDate ? e : e.target.value;
    setCurrentValue(newValue);
    onChange(newValue);
  };

  return isEditing ? (
    isDate ? (
      <DatePicker
      style={{width:'100%'}}
        value={currentValue ? moment(currentValue) : null}
        onChange={(date, dateString) => handleChange(dateString)}
        disabled={disabled}
      />
    ) : (
      <Input
        value={currentValue}
        onChange={handleChange}
        disabled={disabled}
      />
    )
  ) : (
    <div>{isDate ? moment(currentValue).format('YYYY-MM-DD') : currentValue}</div>
  );
};

export default EditableCell;
