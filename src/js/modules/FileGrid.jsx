import React from 'react';
import { useDrop } from "react-dnd";
import { File, ItemTypes } from './File';
import PropTypes from 'prop-types';


export default function FileGrid({ files }) {
    const [{ isOver, canDrop }, drop] = useDrop({
        accept: ItemTypes.FILE,
        drop: (item, monitor) => {
            let file = monitor.getItem();
            return {
                target: "Got file"
            };
        },
        collect: mon => ({
            isOver: !!mon.isOver(),
            canDrop: !!mon.canDrop()
        })
    });
    return (
        <div className="h-full overflow-y-scroll">
            <div ref={drop} className="flex flex-wrap">
                {files.map((file, i) => (
                    <File file={file} key={i} />
                ))}
            </div>
        </div>
    );
}

FileGrid.propTypes = {
    files: PropTypes.arrayOf(PropTypes.object)
};
