import { Calendar } from 'primereact/calendar';

function FilterDate({ onDateChange, selectedDate }) {
    return (
        <Calendar value={selectedDate}
            onChange={(event) => onDateChange(event)} dateFormat="dd-mm-yy" className="p-column-filter" placeholder="Chọn ngày" />
    )
}

export default FilterDate;