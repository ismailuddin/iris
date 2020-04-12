import React from 'react';
import { useDrop } from "react-dnd";
import { ItemTypes } from './File';


function DropTargets({ category, setFileCategory, colour, disabled }) {
    const [{ isOver, canDrop }, drop] = useDrop({
        accept: ItemTypes.FILE,
        drop: (item, monitor) => {
            let file = monitor.getItem();
            setFileCategory(file.id, category);
            return {
                target: "Got file"
            };
        },
        collect: mon => ({
            isOver: !!mon.isOver(),
            canDrop: !!mon.canDrop()
        })
    });
    if (!disabled) {
        return (
            <div ref={drop} className={`block w-full text-center py-4 mb-2 bg-${colour}-100 border border-${colour}-200 rounded-lg`}>
                <span className={`font-bold text-${colour}-900`}>
                    {category}
                </span>
            </div>
        )
    } else {
        return (
            <div className="block w-full text-center py-4 mb-2 bg-gray-300 border-4 border-gray-200 rounded-lg">
                <span className="font-bold text-gray-500">
                    {category}
                </span>
            </div>
        )
    }
}

export default DropTargets;

