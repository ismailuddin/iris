import React from "react";
import { useDrag } from "react-dnd";
import PropTypes from 'prop-types';


const ItemTypes = {
    FILE: "file"
};

function File({ file }) {
    const [{ isDragging }, drag] = useDrag({
        item: {
            type: ItemTypes.FILE,
            filename: file.filename,
            id: file.id,
            category: file.category
        },
        end: (item, monitor) => {
            console.log(monitor.getDropResult());
        },
        collect: monitor => ({
            isDragging: !!monitor.isDragging
        })
    });
    return (
        <div
            ref={drag}
            className="flex-none m-2 w-40 transition duration-300 px-4 py-2 rounded bg-white border border-gray-300 hover:bg-gray-100 shadow-sm text-sm text-gray-700"
        >
            <img className="mb-1" src={`/data/${file.path}`} alt=""/>
            <div className="block">
                {file.tags.length > 0 ? (
                    <div className="group relative inline-block hover:bg-gray-300 rounded-full bg-gray-400 text-gray-800 text-xxs font-bold px-2 py-1">
                        TAGS
                        <div
                            className="absolute invisible group-hover:visible p-2 bg-white shadow-md rounded-md"
                            style={{
                                top: "-35px",
                                left: 0,
                                minWidth: '100px',
                                maxWidth: '400px'
                            }}
                        >   
                            <h6 className="block font-bold text-xs text-gray-600 uppercase leading-snug">Tags</h6>
                            <div className="flex flex-wrap">
                                {file.tags.map((tag, i) => (
                                    <span key={i} className="w-auto flex-none truncate rounded-full bg-indigo-500 uppercase px-2 py-1 text-white text-xxs font-bold m-1">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                ) : (null)}
            </div>
            <div className="truncate">
                {file.filename}
            </div>
        </div>
    );
}

File.propTypes = {
    filename: PropTypes.string
};

export {
    File,
    ItemTypes
};
