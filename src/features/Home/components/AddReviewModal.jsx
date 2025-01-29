import React, { useRef, useState } from "react";

import { useHandleClickOutside, useImageChange } from "../../../hooks";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "../../../axios";
import { MdClose } from "react-icons/md";
import { BtnLoader } from "../../../components";
import { config } from "../../../constants";

export default function AddReviewModal({
    reviewModal,
    setReviewModal,
    selectedReview,
    updateReview,
    addReview,
}) {
    const [data, setData] = useState({
        name: (reviewModal?.isEdit && selectedReview?.name) || "",
        description: (reviewModal?.isEdit && selectedReview?.description) || "",
        place: (reviewModal?.isEdit && selectedReview?.place) || "",
        rating: (reviewModal?.isEdit && selectedReview?.rating) || "",
    });
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const wrapperRef = useRef();
    useHandleClickOutside(wrapperRef, () =>
        setReviewModal({ isEdit: false, isOpen: false })
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
            formData.append("name", data.name);
            formData.append("description", data.description);
            formData.append("place", data.place);
            formData.append("image", image);
            formData.append("rating", data?.rating);
            if (reviewModal?.isEdit) {
                const response = await axios.patch(
                    `/frontend/b2c/home/reviews/update/${selectedReview?._id}`,
                    formData,
                    {
                        headers: { Authorization: `Bearer ${jwtToken}` },
                    }
                );

                updateReview(response.data);
            } else {
                const response = await axios.post(
                    "/frontend/b2c/home/reviews/add",
                    formData,
                    {
                        headers: { Authorization: `Bearer ${jwtToken}` },
                    }
                );
                addReview(response.data);
            }
            setReviewModal({ isOpen: false, isEdit: false });
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
                        {reviewModal?.isEdit ? "Update Review" : "Add Review"}
                    </h2>
                    <button
                        className="h-auto bg-transparent text-textColor text-xl"
                        onClick={() =>
                            setReviewModal({ isOpen: false, isEdit: false })
                        }
                    >
                        <MdClose />
                    </button>
                </div>
                <div className="p-4">
                    <form action="" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="">Name</label>
                            <input
                                type="text"
                                placeholder="Enetr name"
                                name="name"
                                value={data.name || ""}
                                onChange={handleChange}
                                required
                            />
                        </div>{" "}
                        <div className="mt-4">
                            <label htmlFor="">Rating *</label>
                            <select
                                id=""
                                name="rating"
                                value={data?.rating || ""}
                                onChange={handleChange}
                            >
                                <option value="" hidden>
                                    Select Star Category
                                </option>
                                <option value="1">1 Star</option>
                                <option value="2">2 Star</option>
                                <option value="3">3 Star</option>
                                <option value="4">4 Star</option>
                                <option value="5">5 Star</option>
                            </select>
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
                                required={reviewModal?.isEdit === false}
                            />
                        </div>
                        {(image || reviewModal?.isEdit) && (
                            <div className="w-[130px] max-h-[100px] rounded overflow-hidden mt-2">
                                <img
                                    src={
                                        image
                                            ? URL.createObjectURL(image)
                                            : config.SERVER_URL +
                                              selectedReview?.image
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
                                    setReviewModal({
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
                                ) : reviewModal?.isEdit ? (
                                    "Update Review"
                                ) : (
                                    "Add Review"
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
