import React, { Component } from "react";
import axios from "axios";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import Backend from "react-dnd-html5-backend";
import _ from "lodash";
import FileGrid from './modules/FileGrid';
import Category from './modules/Category';
import {
    CategorySelector,
    ItemsPerPageSelector,
    Paginator,
    ReorganiseFilesButton
} from './modules/Helpers';
import AddNewCategoryModal from './modules/AddNewCategoryModal';


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

const colours = _.shuffle([
    "red",
    "orange",
    "amber",
    "yellow",
    "lime",
    "green",
    "emerald",
    "teal",
    "cyan",
    "lightBlue",
    "blue",
    "indigo",
    "violet",
    "fuchsia",
    "pink",
    "rose"
]);

export default class App extends Component {
    state = {
        files: [],
        reclassifiedFiles: [],
        category: null,
        categories: [],
        nPages: 1,
        nPerPage: 50,
        currentPage: 1,
        totalItems: 0,
        newCategoryModalVisible: false
    };

    setFileCategory = (id, category) => {
        let file = _.find(this.state.files, f => f.id === id);
        let otherFiles = this.state.files.filter(f => f.id !== id);
        file["category"] = category;
        axios.post(`/api/relabel_file`, {
            _id: id,
            category
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
            .get("/api/get_files", {
                params: {
                    page: Number(this.state.currentPage),
                    per_page: Number(this.state.nPerPage),
                    category: this.state.category
                }
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

    addNewCategory = categoryName => {
        axios
            .put("/api/new_category", null, {
                params: {
                    category_name: categoryName
                }
            })
            .then(() => {
                window.location = "/";
            })
            .catch(err => {
                console.error(err);
                alert("There was an error creating the new category!")
            })
    }

    componentDidMount() {
        this.getFiles();
    }

    render() {
        const getColour = colourIterator(colours);
        return (
            <div className="h-full flex flex-col">
                <div id="header" className="py-3 px-4 flex justify-between flex-wrap bg-white dark:bg-blueGray-900 z-10 shadow">
                    <div className="flex items-center">
                        <CategorySelector
                            categories={this.state.categories}
                            selectedCategory={this.state.category}
                            setCategory={this.setCategory}
                        />
                        <div className="py-2 mr-4 border-r text-blue-800 dark:text-blueGray-400 dark:border-blueGray-700 border-gray-300 pr-4 text-xs">
                            <span className="mr-2 uppercase tracking-wide dark:text-blueGray-400 text-blue-700 font-extrabold">items</span>
                            {(this.state.currentPage - 1) * this.state.nPerPage} - {(this.state.currentPage * this.state.nPerPage) <= this.state.totalItems ? this.state.currentPage * this.state.nPerPage : this.state.totalItems} / {this.state.totalItems}
                        </div>
                        <ItemsPerPageSelector
                            nPerPage={this.state.nPerPage}
                            setNPerPage={this.setNPerPage}
                        />
                        <ReorganiseFilesButton />
                    </div>
                    <Paginator
                        currentPage={this.state.currentPage}
                        nPages={this.state.nPages}
                        setPage={this.setPage}
                    />
                </div>
                <DndProvider backend={Backend}>
                    <div className="flex-grow-1 h-full flex overflow-y-scroll">
                        <div className="w-2/3 lg:w-5/6 p-2 pt-0 h-full">
                            <FileGrid
                                files={this.state.files.filter(
                                    f => f.category == this.state.category
                                )}
                            />
                        </div>
                        <div className="w-1/3 lg:w-1/6 py-2 px-6 overflow-y-scroll bg-white dark:bg-blueGray-700 border-l border-gray-300 dark:border-blueGray-600">
                            <h5 className="block text-gray-600 dark:text-blueGray-100 text-kg font-bold mb-2">Drag images here to relabel</h5>
                            <div className="flex flex-wrap">
                                {this.state.categories
                                    .map((category, i) => (
                                        <Category
                                            category={category}
                                            key={i}
                                            disabled={category == this.state.category}
                                            setFileCategory={this.setFileCategory}
                                            colour={getColour.next()["value"]}
                                            onClick={() => this.setCategory(category)}
                                        />
                                    ))
                                }
                                <button
                                    className="mt-2 p-1 w-full text-xs flex items-center font-bold uppercase h-full justify-center py-2 px-2 box-border bg-blue-50 dark:bg-blueGray-500 dark:text-blueGray-300 text-blue-700 rounded-full hover:bg-blue-700 hover:text-white focus:outline-none"
                                    onClick={() => this.setState({newCategoryModalVisible: true})}
                                >
                                    <svg className="inline h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    Add new category
                                </button>
                                <AddNewCategoryModal
                                    show={this.state.newCategoryModalVisible}
                                    onHide={() => this.setState({newCategoryModalVisible: false})}
                                    addNewCategory={this.addNewCategory}
                                />
                            </div>
                        </div>
                    </div>
                </DndProvider>
            </div>
        );
    }
}
