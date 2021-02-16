import React, { useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';


function CategorySelector({ categories, selectedCategory, setCategory }) {
    const handleChange = e => {
        setCategory(e.target.value);
    };
    return (
        <div className="mr-4 border-r border-gray-300 dark:border-blueGray-700 pr-4 pt-1 flex items-center">
            <label
                className="inline-flex uppercase tracking-wide text-blue-700 dark:text-blueGray-400 text-xs font-extrabold mr-4"
            >
                <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
                Category
            </label>
            <div className="relative">
                <select
                    className="block appearance-none w-full bg-blue-50 dark:bg-blueGray-700 border border-blue-50 dark:border-blueGray-700 dark:text-blueGray-400 text-blue-700 py-1 px-2 pr-8 mr-4 rounded leading-tight focus:outline-none focus:bg-white focus:border-blue-500"
                    id="grid-state"
                    value={selectedCategory}
                    onChange={handleChange}
                >
                    {categories.map((category, i) => (
                        <option key={i} value={category}>{category}</option>
                    ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-blueGray-400">
                    <svg
                        className="fill-current h-4 w-4"
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
        <div className="mr-4 border-r border-gray-300 dark:border-blueGray-700 pr-4 py-1 flex items-center">
            <label
                className="uppercase tracking-wide text-blue-700 dark:text-blueGray-400 text-xs font-extrabold mr-4"
            >
                # per page
            </label>
            <div className="relative">
                <select
                    className="block appearance-none w-full bg-blue-50 dark:bg-blueGray-700 border border-blue-50 dark:border-blueGray-700 text-blue-700 dark:text-blueGray-400 py-1 px-2 pr-8 mr-4 rounded leading-tight focus:outline-none focus:bg-white focus:border-blue-500"
                    id="grid-state"
                    value={nPerPage}
                    onChange={handleChange}
                >
                    {options.map((option, i) => (
                        <option key={i} value={option}>{option}</option>
                    ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-blueGray-400">
                    <svg
                        className="fill-current h-4 w-4"
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
        <div className="flex mr-4">
            <button
                className={"text-xs dark:bg-blueGray-700 dark:text-blueGray-400 transition-colors duration-300 bg-blue-50 hover:bg-blue-700 hover:text-white dark:hover:bg-blue-700 dark:hover:text-white font-bold py-2 px-4 rounded-l rounded-r-none focus:outline-none" + (currentPage == 1 ? " text-gray-500" : " text-gray-800")}
                onClick={prevPage}
            >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7" />
                </svg>
            </button>
            <input
                type="number"
                className="text-xs dark:bg-blueGray-700 dark:text-blueGray-400 bg-blue-50 text-blue-600 font-bold py-2 px-2 rounded-none focus:outline-none"
                style={{
                    width: '3rem'
                }}
                value={currentPage}
                onChange={handleChange}
            />
            <div
                className="text-xs dark:bg-blueGray-700 dark:text-blueGray-400 bg-blue-50 text-blue-600 font-bold py-2 px-1 rounded-none"
                style={{
                    lineHeight: 1.75
                }}
            >
                / {nPages}
            </div>
            <button
                className={"text-xs dark:bg-blueGray-700 dark:text-blueGray-400 transition-colors duration-300 bg-blue-50 hover:bg-blue-700 hover:text-white dark:hover:bg-blue-700 dark:hover:text-white font-bold py-2 px-4 rounded-r rounded-l-none focus:outline-none" + (currentPage < nPages ? " text-gray-800" : " text-gray-500")}
                onClick={nextPage}
            >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 26 26" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7" />
                </svg>
            </button>
        </div>
    );
}

Paginator.propTypes = {
    nPages: PropTypes.number,
    currentPage: PropTypes.number,
    setPage: PropTypes.func
}

function ReorganiseFilesButton() {
    const [loading, setLoading] = useState(false);

    const makeRequest = () => {
        setLoading(true);
        axios
            .get("/api/reorganise_files")
            .then(() => {
                setLoading(false);
                window.location = "/";
            })
            .catch(err => {
                console.log(err);
                alert("Error processing files. Please try again!");
                setLoading(false);
            })
    }

    if (loading) {
        return (
            <div className="py-2 px-4 uppercase text-xs font-bold rounded-md dark:bg-blueGray-700 dark:text-blueGray-400 bg-blue-50 text-blue-700">
                Processing...
            </div>

        )
    } else {
        return (
            <div className="relative">
                <button
                    onClick={makeRequest}
                    className="group py-2 px-4 text-xs rounded-md dark:bg-blueGray-700 dark:text-blueGray-400 bg-blue-50 text-blue-700 hover:bg-blue-700 hover:text-white focus:outline-none transition-colors duration-300"
                >
                    <div className="invisible group-hover:visible absolute -bottom-12 z-20">
                        <div className="relative mx-2">
                            <div class="bg-black text-white text-xs rounded py-1 px-4 right-0 top-full shadow-md">
                                Moves files into new folders
                                <svg class="absolute text-black h-2 w-full left-0 bottom-full" x="0px" y="0px" viewBox="0 0 255 255">
                                    <polygon class="fill-current" points="0,255 127.5,0 255,255" />
                                </svg>
                            </div>
                        </div>
                    </div>
                    <svg className="mr-2 h-4 w-4 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                    <span className="font-bold uppercase">
                        Reorganise files
                    </span>
                </button>
                
            </div>
        )
    }
}


export {
    CategorySelector,
    ItemsPerPageSelector,
    Paginator,
    ReorganiseFilesButton
}