import React from 'react';
import PropTypes from 'prop-types';


function CategorySelector({ categories, selectedCategory, setCategory }) {
    const handleChange = e => {
        setCategory(e.target.value);
    };
    return (
        <div className="mr-4 border-r border-gray-300 pr-4 pt-1 flex items-center">
            <label
                className="inline-flex uppercase tracking-wide text-blue-700-accent text-xs font-extrabold mr-4"
            >
                <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>

                Category
            </label>
            <div className="relative">
                <select
                    className="block appearance-none w-full bg-blue-50 border border-blue-50 text-blue-700 py-1 px-2 pr-8 mr-4 rounded leading-tight focus:outline-none focus:bg-white focus:border-blue-500"
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
        <div className="mr-4 border-r border-gray-300 pr-4 pt-1 flex items-center">
            <label
                className="uppercase tracking-wide text-blue-700-accent text-xs font-extrabold mr-4"
            >
                # per page
            </label>
            <div className="relative">
                <select
                    className="block appearance-none w-full bg-blue-50 border border-blue-50 text-blue-700 py-1 px-2 pr-8 mr-4 rounded leading-tight focus:outline-none focus:bg-white focus:border-blue-500"
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
        <div className="inline-flex mr-4">
            <button
                className={"text-xs bg-blue-50 hover:bg-blue-700-accent hover:text-white font-bold py-2 px-4 rounded-l " + (currentPage == 1 ? " text-gray-500" : " text-gray-800")}
                onClick={prevPage}
            >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7" />
                </svg>
            </button>
            <input
                type="text"
                className="inline-block text-xs bg-blue-50 text-blue-600 font-bold py-2 px-2"
                style={{
                    width: '3rem'
                }}
                value={currentPage}
                onChange={handleChange}
            />
            <div className="inline-block text-xs bg-blue-50 text-blue-600 font-bold py-2 px-1">
                / {nPages}
            </div>
            <button
                className={"text-xs bg-blue-50 hover:bg-blue-700-accent hover:text-white font-bold py-2 px-4 rounded-r " + (currentPage < nPages ? " text-gray-800" : " text-gray-500")}
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


export {
    CategorySelector,
    ItemsPerPageSelector,
    Paginator
}