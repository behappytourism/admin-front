import React, { useEffect, useRef, useState } from "react";
import { MdClose } from "react-icons/md";
import { useSelector } from "react-redux";

import { useHandleClickOutside, useImageChange } from "../../../hooks";
import { BtnLoader, SelectDropdown } from "../../../components";
import axios from "../../../axios";
import { useParams } from "react-router-dom";
import { config } from "../../../constants";

export default function AddSeoSearchModal({
    categoryModal,
    setCategoryModal,
    selectedCategory,
    addCategory,
    updateCategory,
}) {
    const [data, setData] = useState({
        slug: (categoryModal?.isEdit && selectedCategory?.slug) || "",
        keywords: (categoryModal?.isEdit && selectedCategory?.keywords) || "",
        title: (categoryModal?.isEdit && selectedCategory?.title) || "",
        description:
            (categoryModal?.isEdit && selectedCategory?.description) || "",
        imgUrl: (categoryModal?.isEdit && selectedCategory?.image) || "",
    });
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [list, setList] = useState([]);

    const wrapperRef = useRef();
    useHandleClickOutside(wrapperRef, () =>
        setCategoryModal({ isEdit: false, isOpen: false })
    );
    const { jwtToken } = useSelector((state) => state.admin);

    const handleChange = (e) => {
        setData((prev) => {
            return { ...prev, [e.target.name]: e.target.value };
        });
    };
    const { image, handleImageChange, error: imageError } = useImageChange();

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
            setError(
                err?.response?.data?.error || "Something went wrong, Try again"
            );
        }
    };

    const fetchData = async () => {
        try {
            let response;
            if (subCategoryId === "attraction-products") {
                response = await axios.get(`/seo/attraction`, {
                    headers: { Authorization: `Bearer ${jwtToken}` },
                });
            } else if (subCategoryId === "visa-nationality") {
                response = await axios.get(`/seo/visa`, {
                    headers: { Authorization: `Bearer ${jwtToken}` },
                });
            } else if (subCategoryId === "attraction-destination") {
                response = await axios.get(`/seo/destination`, {
                    headers: { Authorization: `Bearer ${jwtToken}` },
                });
            } else if (subCategoryId === "tours-products") {
                response = await axios.get(`/seo/tours`, {
                    headers: { Authorization: `Bearer ${jwtToken}` },
                });
            } else if (subCategoryId === "attraction-stand-alone") {
                response = await axios.get(`/seo/stand-alone`, {
                    headers: { Authorization: `Bearer ${jwtToken}` },
                });
            } else if (subCategoryId === "blog-list") {
                response = await axios.get(`/seo/blog-list`, {
                    headers: { Authorization: `Bearer ${jwtToken}` },
                });
            } else if (subCategoryId === "blog-category") {
                response = await axios.get(`/seo/blog-category`, {
                    headers: { Authorization: `Bearer ${jwtToken}` },
                });
            } else if (subCategoryId === "stand-alone-list") {
                response = await axios.get(`/seo/stand-alone`, {
                    headers: { Authorization: `Bearer ${jwtToken}` },
                });
            }

            setList(response?.data);
        } catch (err) {
            setError(
                err?.response?.data?.error || "Something went wrong, Try again"
            );
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleSubmit = async (e) => {
        try {
            e.preventDefault();
            setIsLoading(true);
            setError("");

            const formData = new FormData();
            formData.append("type", id);
            formData.append("name", categoryId);
            formData.append("subName", subCategoryId);
            formData.append("slug", data.slug);
            formData.append("title", data.title);
            formData.append("description", data.description);
            formData.append("keywords", JSON.stringify(data.keywords));
            formData.append("image", image);
            console.log(
                id,
                categoryId,
                subCategoryId,
                data.slug,
                data.title,
                data.description,
                "datas"
            );

            if (categoryModal?.isEdit) {
                const response = await axios.patch(
                    `/seo/subcategory/update`,
                    formData,
                    {
                        headers: { Authorization: `Bearer ${jwtToken}` },
                    }
                );

                updateCategory({
                    slug: data.slug,
                    title: data.title,
                    description: data.description,
                    keywords: data.keywords,
                    image: image,
                });
            } else {
                const response = await axios.post(
                    "/seo/subcategory/add",
                    formData,
                    {
                        headers: { Authorization: `Bearer ${jwtToken}` },
                    }
                );
                addCategory({
                    slug: data.slug,
                    title: data.title,
                    description: data.description,
                    keywords: data.keywords,
                    image: image,
                });
            }
            setCategoryModal({ isOpen: false, isEdit: false });
        } catch (err) {
            setError(
                err?.response?.data?.error || "Something went wrong, Try again"
            );
            setIsLoading(false);
        }
    };
    console.log(image, "image");

    return (
        <div className="fixed inset-0 w-full h-full bg-[#fff5] flex items-center justify-center z-20 ">
            <div
                ref={wrapperRef}
                className="bg-[#fff] w-full max-h-[90vh] max-w-[500px]  shadow-[0_1rem_3rem_rgb(0_0_0_/_18%)] overflow-y-auto"
            >
                <div className="flex items-center justify-between border-b p-4">
                    <h2 className="font-medium">
                        {categoryModal?.isEdit
                            ? "Update  Category"
                            : "Add  Category"}
                    </h2>
                    <button
                        className="h-auto bg-transparent text-textColor text-xl"
                        onClick={() =>
                            setCategoryModal({ isOpen: false, isEdit: false })
                        }
                    >
                        <MdClose />
                    </button>
                </div>
                <div className="p-4">
                    <form action="" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="">Slug *</label>
                            <SelectDropdown
                                data={list}
                                valueName={"slug"}
                                displayName={"slug"}
                                placeholder="Select Slug"
                                selectedData={data.slug || ""}
                                setSelectedData={(val) => {
                                    handleDataChange({
                                        name: "slug",
                                        value: val,
                                    });
                                }}
                                bracketValue={"slug"}
                                disabled={categoryModal?.isEdit}
                            />
                        </div>
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
                            <div className="flex pt-3 gap-2">
                                {data.keywords.map((keyword, index) => {
                                    return (
                                        <div className="bg-slate-300 text-textColor px-[15px] flex items-center">
                                            <div> {keyword} </div>
                                            <div
                                                className="text-red-500"
                                                onClick={(e) => {
                                                    removeKeyword(index);
                                                }}
                                            >
                                                {" "}
                                                <MdClose />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}

                        <div className="mt-4">
                            <label htmlFor="">Image</label>
                            <input type="file" onChange={handleImageChange} />
                            {imageError && (
                                <span className="block text-sm text-red-500 mt-2">
                                    {imageError}
                                </span>
                            )}
                            {(image || data?.imgUrl) && (
                                <div className="mt-4 w-[50px] h-[50px]">
                                    <img
                                        src={
                                            image
                                                ? URL.createObjectURL(image)
                                                : config.SERVER_URL +
                                                  data?.imgUrl
                                        }
                                        alt=""
                                        className="w-[100%] h-[100%] object-cover"
                                    />
                                </div>
                            )}
                        </div>

                        {error && (
                            <span className="tdiv>ext-sm block text-red-500 mt-2">
                                {error}
                            </span>
                        )}
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
