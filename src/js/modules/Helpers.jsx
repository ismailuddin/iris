import React from 'react';
import PropTypes from 'prop-types';


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