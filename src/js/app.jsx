import React, { Component, useState } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import Backend from "react-dnd-html5-backend";
import _ from "lodash";

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
                            className="absolute invisible flex flex-wrap group-hover:visible p-2 bg-white shadow-md rounded-md"
                            style={{
                                top: "-35px",
                                left: 0,
                                minWidth: '100px',
                                maxWidth: '400px'
                            }}
                        >
                            {file.tags.map(tag => (
                                <span className="w-auto flex-none truncate rounded-full bg-indigo-500 uppercase px-1 py-1 text-white text-xxs font-bold m-1">
                                    {tag}
                                </span>
                            ))}
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

function Column({ files }) {
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

function DroppableColumn({ category, setFileCategory, colour, disabled }) {
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

Column.propTypes = {
    files: PropTypes.arrayOf(PropTypes.object)
};

function CategorySelector({ categories, selectedCategory, setCategory }) {
    const handleChange = e => {
        setCategory(e.target.value);
    };
    return (
        <div className="mr-4 border-r border-gray-300 pr-4 pt-1">
            <label
                className="inline-block uppercase tracking-wide text-gray-700 text-xs font-bold mr-4"
            >
                Category
            </label>
            <div className="relative inline-block">
                <select
                    className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-1 px-2 pr-8 mr-4 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    id="grid-state"
                    value={selectedCategory}
                    onChange={handleChange}
                >
                    {categories.map((category, i) => (
                        <option key={i} value={category}>{category}</option>
                    ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg
                        class="fill-current h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                    >
                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                    </svg>
                </div>
            </div>
        </div>
    );
}

CategorySelector.propTypes = {
    categories: PropTypes.arrayOf(PropTypes.string),
    selectedCategory: PropTypes.string,
    setCategory: PropTypes.func
};


function ItemsPerPageSelector({ nPerPage, setNPerPage }) {
    const handleChange = e => {
        setNPerPage(e.target.value);
    };
    const options = [1, 10, 25, 50, 100, 200];
    return (
        <div className="mr-4 border-r border-gray-300 pr-4 pt-1">
            <label
                className="inline-block uppercase tracking-wide text-gray-700 text-xs font-bold mr-4"
            >
                # per page
            </label>
            <div className="relative inline-block">
                <select
                    className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-1 px-2 pr-8 mr-4 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    id="grid-state"
                    value={nPerPage}
                    onChange={handleChange}
                >
                    {options.map((option, i) => (
                        <option key={i} value={option}>{option}</option>
                    ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg
                        class="fill-current h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                    >
                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                    </svg>
                </div>
            </div>
        </div>
    );
}

ItemsPerPageSelector.propTypes = {
    nPerPage: PropTypes.number,
    setNPerPage: PropTypes.func,
};

function Paginator({ nPages, currentPage, setPage }) {
    const nextPage = () => {
        if (currentPage >= 1 && currentPage < nPages) {
            setPage(currentPage + 1);
        }
    }
    const prevPage = () => {
        if (currentPage > 1 && currentPage <= nPages) {
            setPage(currentPage - 1);
        }
    }
    const handleChange = e => {
        let pageNumber = Number(e.target.value);
        if (pageNumber >= 1 && pageNumber <= nPages) {
            setPage(pageNumber);
        }
    }
    return (
        <div className="inline-flex mr-4 right-0 absolute">
            <button
                className={"text-xs bg-gray-300 hover:bg-gray-400 font-bold py-1 px-4 rounded-l " + (currentPage == 1 ? " text-gray-500" : " text-gray-800")}
                onClick={prevPage}
            >
                Prev
            </button>
            <input
                type="text"
                className="inline-block text-xs bg-gray-300 text-gray-600 font-bold py-2 px-2"
                style={{
                    width: '3rem'
                }}
                value={currentPage}
                onChange={handleChange}
            />
            <div className="inline-block text-xs bg-gray-300 text-gray-600 font-bold py-2 px-1">
                / {nPages}
            </div>
            <button
                className={"text-xs bg-gray-300 hover:bg-gray-400 font-bold py-1 px-4 rounded-r " + (currentPage < nPages ? " text-gray-800" : " text-gray-500")}
                onClick={nextPage}
            >
                Next
            </button>
        </div>
    );
}

function* colourIterator(colours) {
    let iterationCount = 0;
    while (true) {
        if (iterationCount >= colours.length - 1) {
            iterationCount = 0;
        }
        iterationCount++;
        yield colours[iterationCount];
    }
}

const colours = ["teal", "blue", "purple", "orange", "red", "green"];

export default class App extends Component {
    state = {
        files: [],
        reclassifiedFiles: [],
        category: null,
        categories: [],
        nPages: 1,
        nPerPage: 50,
        currentPage: 1,
        totalItems: 0
    };

    setFileCategory = (id, category) => {
        let file = _.find(this.state.files, f => f.id === id);
        let otherFiles = this.state.files.filter(f => f.id !== id);
        file["category"] = category;
        axios.post(`/api/file/${id}/set_label`, {
            category: category
        }).then(response => {
            if (response.status === 200) {
                this.setState({
                    files: [...otherFiles, file]
                });
            }
        })
    };

    setPage = (pageNumber) => {
        this.setState({
            currentPage: pageNumber
        },
        () => this.getFiles());
    }

    setCategory = category => {
        this.setState(
            {
                category: category,
                currentPage: 1
            },
            () => this.getFiles()
        );
    }

    setNPerPage = number => {
        this.setState({
            nPerPage: number,
            currentPage: 1
        },
        () => this.getFiles());
    }

    getFiles = () => {
        axios
            .post("/api/get_files", {
                page: Number(this.state.currentPage),
                per_page: Number(this.state.nPerPage),
                category: this.state.category
            })
            .then(response => {
                this.setState({
                    files: response.data["files"],
                    categories: response.data["categories"],
                    category: response.data["selected_category"],
                    nPages: response.data["n_pages"],
                    totalItems: response.data["total"]
                });
            });
    }

    componentDidMount() {
        this.getFiles();
    }

    render() {
        const getColour = colourIterator(colours);
        return (
            <div className="h-full flex flex-col">
                <div id="header" className="py-3 px-4 border-b border-gray-300 flex bg-white shadow-sm">
                    <CategorySelector
                        categories={this.state.categories}
                        selectedCategory={this.state.category}
                        setCategory={this.setCategory}
                    />
                    <div className="py-2 mr-4 border-r border-gray-300 pr-4 text-xs">
                        {(this.state.currentPage - 1) * this.state.nPerPage} - {(this.state.currentPage * this.state.nPerPage) <= this.state.totalItems ? this.state.currentPage * this.state.nPerPage : this.state.totalItems} / {this.state.totalItems}
                        <span className="ml-2 uppercase tracking-wide text-gray-700 font-bold">items</span>
                    </div>
                    <ItemsPerPageSelector 
                        nPerPage={this.state.nPerPage}
                        setNPerPage={this.setNPerPage}
                    />
                    <Paginator
                        currentPage={this.state.currentPage}
                        nPages={this.state.nPages}
                        setPage={this.setPage}
                    />
                </div>
                <DndProvider backend={Backend}>
                    <div className="flex-grow-1 h-full flex overflow-y-scroll">
                        <div className="w-5/6 p-2 h-full">
                            <Column
                                files={this.state.files.filter(
                                    f => f.category == this.state.category
                                )}
                            />
                        </div>
                        <div className="w-1/6 p-2">
                            <h5 className="text-gray-600 text-kg font-bold mb-2">Drag images here to relabel</h5>
                            {this.state.categories
                                .map((category, i) => (
                                    <DroppableColumn
                                        category={category}
                                        key={i}
                                        disabled={category == this.state.category}
                                        setFileCategory={this.setFileCategory}
                                        colour={getColour.next()["value"]}
                                    />
                            ))}
                        </div>
                    </div>
                </DndProvider>
            </div>
        );
    }
}
