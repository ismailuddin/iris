import React from 'react';
import { useDrop } from "react-dnd";
import { ItemTypes } from './File';


function DropTarget({ category, setFileCategory, colour, disabled, onClick }) {
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
            <button onClick={onClick} className="p-1 w-full text-sm">
                <div ref={drop} className={`flex items-center h-full justify-center py-3 px-2 box-border bg-${colour}-700 rounded-lg`}>
                    <span className={`font-bold text-${colour}-700-contrast`}>
                        {category}
                    </span>
                </div>
            </button>
        )
    } else {
        return (
            <div className="p-1 w-full text-sm">
                <div className="flex items-center h-full justify-center py-3 px-2 box-border bg-gray-300 border-4 border-gray-200 rounded-lg">
                    <span className="font-bold text-gray-500">
                        {category}
                    </span>
                </div>
            </div>
        )
    }
}

export default DropTarget;

