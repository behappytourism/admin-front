import React, { useEffect, useState } from "react";
import { BsFillArrowRightCircleFill } from "react-icons/bs";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import axios from "../../axios";
import { BtnLoader, RichTextEditor } from "../../components";
import { useImageChange } from "../../hooks";

export default function AddEmailTemplatePage() {
    const [data, setData] = useState({
        name: "",
        type: "",
        html: "",
        tags: [],
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [file, setFile] = useState("");
    const { jwtToken } = useSelector((state) => state.admin);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setData((prev) => {
            return { ...prev, [e.target.name]: e.target.value };
        });
    };

    const fileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const addTag = async (e) => {
        e.preventDefault(); // Prevent default form submission or other default actions
        try {
            console.log(`Adding tag`);

            setData((prevData) => ({
                ...prevData,
                tags: [...prevData.tags, { key: "", type: "" }],
            }));
        } catch (error) {
            console.error("Error adding tag:", error);
        }
    };

    const removeTag = (e, ind) => {
        try {
            e.preventDefault();
            const filteredItems = data?.tags?.filter((_, index) => {
                return index !== ind;
            });

            setData((prev) => {
                return {
                    ...prev,
                    tags: filteredItems,
                };
            });
        } catch (e) {
            console.log(e);
        }
    };

    const handleSubmit = async (e) => {
        try {
            e.preventDefault();
            setIsLoading(true);
            setError("");

            const formData = new FormData();
            formData.append("name", data.name);
            formData.append("type", data.type);
            formData.append("filePath", file);
            formData.append("html", data.html);
            formData.append("tags", JSON.stringify(data.tags));

            await axios.post("/email/template/add", formData, {
                headers: { authorization: `Bearer ${jwtToken}` },
            });

            setIsLoading(false);
            navigate("/email/templates");
        } catch (err) {
            setError(
                err?.response?.data?.error || "Something went wrong, Try again"
            );
            setIsLoading(false);
        }
    };

    const handleInpChange = (e, index) => {
        console.log(index, "index");
        setData((prev) => {
            const updatedTags = [...prev.tags];
            updatedTags[index] = {
                ...updatedTags[index],
                [e.target.name]: e.target.value,
            };

            return {
                ...prev,
                tags: updatedTags,
            };
        });
    };

    console.log(data?.tags, "fsgsdgs");

    return (
        <div>
            <div className="bg-white flex items-center justify-between gap-[10px] px-6 shadow-sm border-t py-2">
                <h1 className="font-[600] text-[15px]">ADD EMAIL TEMPLATES</h1>
                <div className="text-sm text-grayColor">
                    <Link to="/" className="text-textColor">
                        Dashboard{" "}
                    </Link>
                    <span>{">"} </span>
                    <Link to="/email/templates" className="text-textColor">
                        Email Templates{" "}
                    </Link>
                    <span>{">"} </span>
                    <span>Add</span>
                </div>
            </div>
            <div className="p-6">
                <div className="bg-white rounded p-6 shadow-sm">
                    <form action="" onSubmit={handleSubmit}>
                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <label htmlFor=""> Name</label>
                                <input
                                    type="text"
                                    placeholder="Enter  name"
                                    name="name"
                                    value={data.name || ""}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="">Type</label>
                                <select
                                    name="type"
                                    value={data?.type || ""}
                                    onChange={handleChange}
                                    id=""
                                    required
                                    className="capitalize"
                                >
                                    <option value="" hidden>
                                        Select Type
                                    </option>
                                    <option value="manual">
                                        Upload Template
                                    </option>{" "}
                                    <option value="custom">Text</option>
                                </select>
                            </div>
                            {data?.type === "manual" && (
                                <div className="">
                                    <label htmlFor="">File</label>
                                    <input type="file" onChange={fileChange} />
                                    {/* {imageError && (
                                    <span className="block text-sm text-red-500 mt-2">
                                        {imageError}
                                    </span>
                                )} */}
                                </div>
                            )}
                        </div>
                        {data.type === "manual" && (
                            <div className="mt-2">
                                <h1 className="font-[600] flex items-center gap-[10px] mb-3">
                                    <BsFillArrowRightCircleFill /> Tags
                                </h1>
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead className="bg-[#f3f6f9] text-grayColor text-[14px]">
                                            <tr>
                                                {/* {isEditPermission && ( */}
                                                <th className="p-2 border w-[35px]">
                                                    <div className="flex items-center justify-center">
                                                        <button
                                                            className="w-[25px] h-[25px] rounded-full bg-green-500"
                                                            onClick={(e) => {
                                                                addTag(e);
                                                            }}
                                                        >
                                                            +
                                                        </button>
                                                    </div>
                                                </th>
                                                {/* )} */}
                                                <th className="font-[500] p-2 border">
                                                    key
                                                </th>
                                                <th className="font-[500] p-2 border">
                                                    type
                                                </th>

                                                {/* <th className="font-[500] p-2 border">
                                                From Time
                                            </th>
                                            <th className="font-[500] p-2 border">
                                                To Time
                                            </th> */}
                                            </tr>
                                        </thead>
                                        <tbody className="text-sm">
                                            {data?.tags?.map((tag, index) => (
                                                <tr
                                                    key={index}
                                                    className="border-b border-tableBorderColor"
                                                >
                                                    {/* {isEditPermission && ( */}
                                                    <td className="p-2 border w-[35px] min-w-[35px]">
                                                        <div className="flex items-center justify-center">
                                                            <button
                                                                className="w-[25px] h-[25px] rounded-full bg-red-500"
                                                                onClick={(
                                                                    e
                                                                ) => {
                                                                    removeTag(
                                                                        e,
                                                                        index
                                                                    );
                                                                }}
                                                            >
                                                                -
                                                            </button>
                                                        </div>
                                                    </td>
                                                    {/* )} */}
                                                    <td className="border">
                                                        <input
                                                            type="text"
                                                            name="key"
                                                            value={
                                                                tag?.key || ""
                                                            }
                                                            onChange={(e) =>
                                                                handleInpChange(
                                                                    e,
                                                                    index
                                                                )
                                                            }
                                                            className="h-[100%]  px-2 border-0"
                                                            placeholder="Ex: header"
                                                            // disabled={
                                                            //     !isEditPermission
                                                            // }
                                                        />
                                                    </td>{" "}
                                                    <td className="border">
                                                        <select
                                                            name="type"
                                                            value={
                                                                tag?.type || ""
                                                            }
                                                            onChange={(e) => {
                                                                handleInpChange(
                                                                    e,
                                                                    index
                                                                );
                                                            }}
                                                            id=""
                                                            required
                                                            className="capitalize"
                                                        >
                                                            <option
                                                                value=""
                                                                hidden
                                                            >
                                                                Select Type
                                                            </option>
                                                            <option value="string">
                                                                String
                                                            </option>{" "}
                                                            <option value="image">
                                                                Image
                                                            </option>
                                                        </select>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {data?.type === "custom" && (
                            <div className="mt-2">
                                <div className="">
                                    <label className="">HTML</label>{" "}
                                    <div className="border border-t-0">
                                        <RichTextEditor
                                            getValue={(value) => {
                                                setData((prev) => {
                                                    return {
                                                        ...prev,
                                                        ["html"]: value,
                                                    };
                                                });
                                            }}
                                            initialValue={data?.html || ""}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {error && (
                            <span className="text-sm block text-red-500 mt-2">
                                {error}
                            </span>
                        )}
                        <div className="mt-4 flex items-center justify-end gap-[12px]">
                            <button
                                className="bg-slate-300 text-textColor px-[15px]"
                                type="button"
                                onClick={() => navigate(-1)}
                            >
                                Cancel
                            </button>
                            {isLoading ? (
                                <button className="w-[130px]">
                                    <BtnLoader />
                                </button>
                            ) : (
                                <button
                                    className="w-[130px]"
                                    onClick={handleSubmit}
                                >
                                    Update
                                </button>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
