import React from 'react';
import PropTypes from 'prop-types';
import { useDrop } from "react-dnd";
import { ItemTypes } from './File';


function Category({ category, setFileCategory, colour, disabled, onClick }) {
    const [{ isOver, canDrop }, drop] = useDrop({
        accept: ItemTypes.FILE,
        drop: (item, monitor) => {
            let file = monitor.getItem();
            setFileCategory(file.id, category);
        },
        collect: mon => ({
            isOver: !!mon.isOver(),
            canDrop: !!mon.canDrop()
        })
    });
    if (!disabled) {
        return (
            <button onClick={onClick} className="p-1 w-full text-sm focus:outline-none">
                <div ref={drop} className={`flex items-center h-full justify-center py-3 px-2 box-border bg-${colour}-600 rounded-lg hover:bg-${colour}-500 transition duration-300`}>
                    <span className="font-bold text-white">
                        {category}
                    </span>
                </div>
            </button>
        )
    } else {
        return (
            <div className="p-1 w-full text-sm">
                <div className="flex items-center h-full justify-center py-3 px-2 box-border bg-gray-300 rounded-lg">
                    <span className="font-bold text-gray-500">
                        {category}
                    </span>
                </div>
            </div>
        )
    }
}

Category.propTypes = {
    category: PropTypes.string,
    setFileCategory: PropTypes.func,
    colour: PropTypes.string,
    disabled: PropTypes.bool,
    onClick: PropTypes.func
}

export default Category;

