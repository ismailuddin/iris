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
        collect: monitor => ({
            isDragging: !!monitor.isDragging
        })
    });
    return (
        <div
            ref={drag}
            className="flex-none m-2 w-40 transition duration-300 px-4 py-2 rounded bg-white dark:bg-blueGray-700 shadow-sm text-sm text-gray-700"
        >
            <img className="mb-1" src={`/get_image?image_path=${file.path}`} alt=""/>
            <div className="block">
                {file.tags.length > 0 ? (
                    <div className="group relative inline-block hover:bg-gray-300 rounded-full bg-blue-50 text-blue-700 dark:bg-blueGray-100 text-xxs font-extrabold px-2">
                        TAGS
                        <div
                            className="absolute invisible group-hover:visible p-2 bg-white dark:bg-blueGray-400 shadow-md rounded-md"
                            style={{
                                top: "-35px",
                                left: 0,
                                minWidth: '100px',
                                maxWidth: '400px'
                            }}
                        >   
                            <h6 className="block font-black text-xs text-blue-800 uppercase leading-snug">Tags</h6>
                            <div className="flex flex-wrap">
                                {file.tags.map((tag, i) => (
                                    <span key={i} className="w-auto flex-none truncate rounded-full bg-blue-50 uppercase px-2 text-blue-700-accent text-xxs font-bold m-1">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                ) : (null)}
            </div>
            <div className="truncate dark:text-blueGray-300">
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
