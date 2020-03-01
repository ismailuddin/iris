import React, { Component, useState } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import Backend from 'react-dnd-html5-backend';

const ItemTypes = {
    IMAGE: 'image'
}

function Image({ image }) {
    const [{ isDragging }, drag] = useDrag({
        item: {
            type: ItemTypes.IMAGE,
            url: image.url,
            id: image.id,
            category: image.category
        },
        end: (item, monitor) => {
            console.log(monitor.getDropResult());
        },
        collect: monitor => ({
            isDragging: !!monitor.isDragging
        }),
    })
    return (
        <div
            ref={drag}
            className="inline-block transition duration-300 px-4 py-2 bg-gray-200 border border-gray-300 hover:bg-gray-100"
        >
            {image.url}
        </div>
    )
}

Image.propTypes = {
    url: PropTypes.string
}


function Column({ images }) {
    return (
        <div className="h-full overflow-y-scroll">
            <div className="grid grid-flow-row grid-cols-2 gap-4">
                {images.map((image, i) => (
                    <Image
                        image={image}
                        key={i}
                    />
                ))}
            </div>
        </div>
    )
}

function DroppableColumn({ setImageCategory }) {
    const [droppedImages, setDroppedImages] = useState([]);
    const [{ isOver, canDrop }, drop] = useDrop({
        accept: ItemTypes.IMAGE,
        drop: (item, monitor) => {
            let image = monitor.getItem();
            setDroppedImages([
                ...droppedImages,
                image
            ]);
            setImageCategory(image.id, "new_categ");
            return {
                target: "Got image"
            }
        },
        collect: mon => ({
            isOver: !!mon.isOver(),
            canDrop: !!mon.canDrop(),
        }),
    })

    return (
        <div ref={drop} className="w-full h-full overflow-y-scroll">
            Dropped
            <div className="grid grid-flow-row grid-cols-1 gap-1">
                {droppedImages.map((image, i) => (
                    <Image image={image} key={i} />
                ))}
            </div>
        </div>
    )
}

Column.propTypes = {
    images: PropTypes.arrayOf(PropTypes.object),
}


export default class App extends Component {
    state = {
        images: []

    }

    setImageCategory = (id, category) => {
        let image = this.state.images.filter(img => img.id == id)[0];
        const filteredImages = this.state.images.filter(img => img.id !== id);
        image["category"] = category;
        this.setState({
            images: [...filteredImages, image]
        });
        console.log("fired")
    }

    componentDidMount() {
        axios.get("/api/images").then(
            response => {
                this.setState({
                    images: response.data['images'].slice(0, 5)
                });
            }
        )
    }

    onDragEnd = result => {
        // TODO: Do later
    }

    render() {
        return (
            <div className="h-full flex flex-col">
                <h1 className="text-2xl font-bold">
                    Images
                </h1>
                <DndProvider backend={Backend}>
                    <div className="flex-grow-1 flex overflow-y-scroll">
                        <div className="w-4/6 p-2 h-full ">
                            <Column
                                images={this.state.images.filter(
                                        image => image.category === "category_1"
                                    )
                                }
                            />
                        </div>
                        <div className="w-2/6 p-2">
                            <DroppableColumn
                                setImageCategory={this.setImageCategory}
                            />
                        </div>
                    </div>
                </DndProvider>
            </div>
        )
    }
}
