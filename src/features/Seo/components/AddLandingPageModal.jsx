import React, { useEffect, useRef, useState } from "react";
import { MdClose } from "react-icons/md";
import { useSelector } from "react-redux";

import { useHandleClickOutside } from "../../../hooks";
import { BtnLoader, SelectDropdown } from "../../../components";
import axios from "../../../axios";
import { useParams } from "react-router-dom";

export default function AddLandingPageModal({
    categoryModal,
    setCategoryModal,
    selectedCategory,
    addCategory,
    updateCategory,
}) {
    const [data, setData] = useState({
        keyword: (categoryModal?.isEdit && selectedCategory?.keyword) || "",
        keywords: (categoryModal?.isEdit && selectedCategory?.keywords) || "",
        title: (categoryModal?.isEdit && selectedCategory?.title) || "",
        description: (categoryModal?.isEdit && selectedCategory?.description) || "",
    });
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [list, setList] = useState([]);

    const wrapperRef = useRef();
    useHandleClickOutside(wrapperRef, () => setCategoryModal({ isEdit: false, isOpen: false }));
    const { jwtToken } = useSelector((state) => state.admin);

    const handleChange = (e) => {
        setData((prev) => {
            return { ...prev, [e.target.name]: e.target.value };
        });
    };

    const handleDataChange = ({ name, value }) => {
        setData((prev) => {
            return { ...prev, [name]: value };
        });
    };
    const { id, categoryId, subCategoryId } = useParams();

    const handleKeywordChange = async () => {
        try {
            setData((prev) => ({
                ...prev,
                keywords: [...prev.keywords, data.keyword],
            }));

            setData((prev) => ({
                ...prev,
                keyword: "",
            }));
        } catch (e) {
            // Handle the error if needed
            console.error("Error:", e);
        }
    };

    const removeKeyword = (index) => {
        try {
            setData((prev) => ({
                ...prev,
                keywords: prev.keywords.filter((_, i) => i !== index),
            }));
        } catch (err) {
            setError(err?.response?.data?.error || "Something went wrong, Try again");
        }
    };

    const handleSubmit = async (e) => {
        try {
            e.preventDefault();
            setIsLoading(true);
            setError("");

            if (categoryModal?.isEdit) {
                const response = await axios.patch(
                    `/seo/category/update`,
                    {
                        type: id,
                        name: selectedCategory?.name,
                        title: data.title,
                        description: data.description,
                        keywords: data.keywords,
                    },
                    {
                        headers: { Authorization: `Bearer ${jwtToken}` },
                    }
                );

                updateCategory({ ...response.data, type: id });
            }

            setCategoryModal({ isOpen: false, isEdit: false });
        } catch (err) {
            setError(err?.response?.data?.error || "Something went wrong, Try again");
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 w-full h-full bg-[#fff5] flex items-center justify-center z-20 ">
            <div
                ref={wrapperRef}
                className="bg-[#fff] w-full max-h-[90vh] max-w-[500px]  shadow-[0_1rem_3rem_rgb(0_0_0_/_18%)] overflow-y-auto"
            >
                <div className="flex items-center justify-between border-b p-4">
                    <h2 className="font-medium">
                        {categoryModal?.isEdit ? "Update  Category" : "Add  Category"}
                    </h2>
                    <button
                        className="h-auto bg-transparent text-textColor text-xl"
                        onClick={() => setCategoryModal({ isOpen: false, isEdit: false })}
                    >
                        <MdClose />
                    </button>
                </div>
                <div className="p-4">
                    <form action="" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor=""> Title *</label>
                            <input
                                type="text"
                                value={data.title || ""}
                                name="title"
                                onChange={handleChange}
                                placeholder="Enter title "
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor=""> Description *</label>
                            <textarea
                                type="text"
                                value={data.description || ""}
                                name="description"
                                onChange={handleChange}
                                placeholder="Enter description"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor=""> Keywords *</label>
                            <div className="flex gap-5">
                                <input
                                    type="text"
                                    value={data.keyword || ""}
                                    name="keyword"
                                    onChange={handleChange}
                                    placeholder="Enter keywords"
                                />
                                <button
                                    className="bg-slate-300 text-textColor px-[15px]"
                                    type="button"
                                    onClick={handleKeywordChange}
                                >
                                    add
                                </button>
                            </div>
                        </div>
                        {data.keywords && (
                            <div className="flex flex-wrap pt-3 gap-2 w-full">
                                {data.keywords.map((keyword, index) => (
                                    <div
                                        key={index}
                                        className="bg-slate-300 text-textColor px-[15px] flex items-center"
                                    >
                                        <div>{keyword}</div>
                                        <div
                                            className="text-red-500 cursor-pointer"
                                            onClick={(e) => {
                                                removeKeyword(index);
                                            }}
                                        >
                                            <MdClose />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {error && <span className="tdiv>ext-sm block text-red-500 mt-2">{error}</span>}
                        <div className="mt-4 flex items-center justify-end gap-[12px]">
                            <button
                                className="bg-slate-300 text-textColor px-[15px]"
                                type="button"
                                onClick={() =>
                                    setCategoryModal({
                                        isOpen: false,
                                        isEdit: false,
                                    })
                                }
                            >
                                Cancel
                            </button>
                            <button className="w-[150px]">
                                {isLoading ? (
                                    <BtnLoader />
                                ) : categoryModal?.isEdit ? (
                                    "Update Category"
                                ) : (
                                    "Add Category"
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
