import React, { useRef, useState } from "react";

import { useHandleClickOutside, useImageChange } from "../../../hooks";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "../../../axios";
import { MdClose } from "react-icons/md";
import { BtnLoader } from "../../../components";
import { config } from "../../../constants";

export default function AddHeroModal({
    heroModal,
    setHeroModal,
    selectedHero,
    updateHero,
    addHero,
}) {
    const [data, setData] = useState({
        title: (heroModal?.isEdit && selectedHero?.title) || "",
        description: (heroModal?.isEdit && selectedHero?.description) || "",
        place: (heroModal?.isEdit && selectedHero?.place) || "",
    });
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const wrapperRef = useRef();
    useHandleClickOutside(wrapperRef, () =>
        setHeroModal({ isEdit: false, isOpen: false })
    );
    const { jwtToken } = useSelector((state) => state.admin);

    const { image, handleImageChange, error: imageError } = useImageChange();

    const handleChange = (e) => {
        setData((prev) => {
            return { ...prev, [e.target.name]: e.target.value };
        });
    };

    const handleSubmit = async (e) => {
        try {
            e.preventDefault();
            setIsLoading(true);
            setError("");

            const formData = new FormData();
            formData.append("title", data.title);
            formData.append("description", data.description);
            formData.append("place", data.place);
            formData.append("image", image);

            if (heroModal?.isEdit) {
                const response = await axios.patch(
                    `/frontend/b2b/home/heros/update/${selectedHero?._id}`,
                    formData,
                    {
                        headers: { Authorization: `Bearer ${jwtToken}` },
                    }
                );

                updateHero(response.data);
            } else {
                const response = await axios.post(
                    "/frontend/b2b/home/heros/add",
                    formData,
                    {
                        headers: { Authorization: `Bearer ${jwtToken}` },
                    }
                );
                addHero(response.data);
            }
            setHeroModal({ isOpen: false, isEdit: false });
        } catch (err) {
            setError(
                err?.response?.data?.error || "Something went wrong, Try again"
            );
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
                    <h2 className="font-medium mb-2">
                        {heroModal?.isEdit ? "Update Hero" : "Add Hero"}
                    </h2>
                    <button
                        className="h-auto bg-transparent text-textColor text-xl"
                        onClick={() =>
                            setHeroModal({ isOpen: false, isEdit: false })
                        }
                    >
                        <MdClose />
                    </button>
                </div>
                <div className="p-4">
                    <form action="" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="">Title</label>
                            <input
                                type="text"
                                placeholder="Enetr Title"
                                name="title"
                                value={data.title || ""}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="mt-4">
                            <label htmlFor="">Description</label>
                            <textarea
                                id=""
                                placeholder="Enter Description"
                                name="description"
                                value={data.description || ""}
                                onChange={handleChange}
                                className="h-[100px]"
                                required
                            ></textarea>
                        </div>
                        <div className="mt-4">
                            <label htmlFor="">Place</label>
                            <input
                                type="text"
                                placeholder="Ex: Dubai"
                                name="place"
                                value={data.place || ""}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="mt-4">
                            <label htmlFor="">Image</label>
                            <input
                                type="file"
                                onChange={handleImageChange}
                                required={heroModal?.isEdit === false}
                            />
                        </div>
                        {(image || heroModal?.isEdit) && (
                            <div className="w-[130px] max-h-[100px] rounded overflow-hidden mt-2">
                                <img
                                    src={
                                        image
                                            ? URL.createObjectURL(image)
                                            : config.SERVER_URL +
                                              selectedHero?.image
                                    }
                                    alt=""
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        )}
                        {imageError && (
                            <span className="text-sm block text-red-500 mt-2">
                                {imageError}
                            </span>
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
                                onClick={() =>
                                    setHeroModal({
                                        isOpen: false,
                                        isEdit: false,
                                    })
                                }
                            >
                                Cancel
                            </button>
                            <button className="w-[130px]">
                                {isLoading ? (
                                    <BtnLoader />
                                ) : heroModal?.isEdit ? (
                                    "Update Hero"
                                ) : (
                                    "Add Hero"
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
