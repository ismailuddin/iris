import React, { useState, useEffect } from "react";

export default function AddNewCategoryModal({ show, onHide, addNewCategory }) {
    const [visible, setVisible] = useState(show);
    const [categoryName, setCategoryName] = useState("");

    useEffect(() => {
        setVisible(show);
    }, [show]);

    const handleKeyDown = (event) => {
        if (event.key === "Enter" && categoryName != "") {
            addNewCategory(categoryName);
        }
    };

    if (visible) {
        return (
            <div
                style={{
                    backgroundColor: "rgba(0,0,0,0.35)",
                    backdropFilter: "blur(5px)",
                }}
                className="fixed top-0 right-0 z-50 h-screen w-screen flex items-center justify-center transition-all duration-300"
            >
                <div className="bg-white rounded-lg p-5 mx-4 shadow-lg relative">
                    <button
                        className="rounded-full w-8 h-8 bg-red-600 absolute flex items-center justify-center text-white -top-2 -right-2 focus:outline-none"
                        onClick={onHide}
                    >
                        <svg
                            className="h-6 w-6 inline"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="3"
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                    <h3 className="text-blue-800 uppercase font-extrabold text-md mb-2">
                        Create a new category
                    </h3>
                    <p className="text-gray-600 font-light mb-3">
                        Enter the name of the new category you would like to
                        create:
                    </p>

                    <label
                        class="block uppercase tracking-wide text-blue-700 text-xs font-bold mb-2"
                        for="grid-password"
                    >
                        Category name
                    </label>
                    <input
                        class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                        type="text"
                        value={categoryName}
                        onChange={(e) => setCategoryName(e.target.value)}
                        onKeyDown={(e) => handleKeyDown(e)}
                    />
                    <div className="text-center">
                        <button
                            className="bg-blue-100 text-blue-700 px-4 py-1 rounded-full font-bold hover:bg-blue-700 hover:text-white transition-colors duration-300"
                            onClick={() => addNewCategory(categoryName)}
                        >
                            <div className="flex items-center">
                                <svg
                                    className="inline h-5 w-5 mr-2"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2.5"
                                        d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                                Create new category
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        );
    } else {
        return null;
    }
}
