import React, { Component } from "react";
import axios from "axios";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import Backend from "react-dnd-html5-backend";
import _ from "lodash";
import FileGrid from './modules/FileGrid';
import DropTargets  from './modules/DropTargets';
import { 
    CategorySelector,
    ItemsPerPageSelector,
    Paginator 
} from './modules/Helpers';


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

const colours = [
    "teal",
    "blue",
    "purple",
    "orange",
    "red",
    "green"
];

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
                            <FileGrid
                                files={this.state.files.filter(
                                    f => f.category == this.state.category
                                )}
                            />
                        </div>
                        <div className="w-1/6 p-2">
                            <h5 className="text-gray-600 text-kg font-bold mb-2">Drag images here to relabel</h5>
                            {this.state.categories
                                .map((category, i) => (
                                    <DropTargets
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
