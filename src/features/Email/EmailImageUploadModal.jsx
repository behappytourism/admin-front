import React, { useRef, useState } from "react";
import { MdClose } from "react-icons/md";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import { useHandleClickOutside, useImageChange } from "../../hooks";
import { BtnLoader } from "../../components";
import axios from "../../axios";
import { config } from "../../constants";

export default function EmailImageUploadModal({
    setIsModal,
    selectedImage,
    setImages,
}) {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [data, setData] = useState({
        name: selectedImage?._id || "",
        imgUrl: selectedImage?.image || "",
    });

    const handleChange = (e) => {
        setData((prev) => {
            return { ...prev, [e.target.name]: e.target.value };
        });
    };
    const {
        image: image,
        handleImageChange: ImgChange,
        error: ImgError,
    } = useImageChange();

    const { jwtToken } = useSelector((state) => state.admin);
    const wrapperRef = useRef();
    useHandleClickOutside(wrapperRef, () =>
        setIsModal({ isEdit: false, isOpen: false })
    );

    const handleSubmit = async (e) => {
        try {
            e.preventDefault();
            setIsLoading(true);
            setError("");

            const formData = new FormData();
            formData.append("name", data.name);
            formData.append("image", image);

            const response = await axios.post(`/email/image/add`, formData, {
                headers: { Authorization: `Bearer ${jwtToken}` },
            });

            setImages((prev) => {
                return [...prev, response.data];
            });

            setIsLoading(false);
            setIsModal(false);
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
                className="bg-[#fff] w-full max-h-[90vh] rounded max-w-[500px]  shadow-[0_1rem_3rem_rgb(0_0_0_/_18%)] overflow-y-auto"
            >
                <div className="flex items-center justify-between border-b p-4">
                    <h2 className="font-medium mb-2">Add Image Upload</h2>
                    <button
                        className="h-auto bg-transparent text-textColor text-xl"
                        onClick={() => setIsModal(false)}
                    >
                        <MdClose />
                    </button>
                </div>
                <form className="p-4" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="">Name *</label>
                        <input
                            type="text"
                            name="name"
                            value={data.name || ""}
                            onChange={handleChange}
                            placeholder="sample image"
                            required
                        />
                    </div>
                    <div className="mt-4">
                        <label htmlFor="">Image *</label>
                        <input type="file" onChange={ImgChange} />
                        {ImgError && (
                            <span className="block text-sm mt-2 text-red-500">
                                {ImgError}
                            </span>
                        )}
                        {(image || data.imgUrl) && (
                            <div className="mt-2">
                                <img
                                    src={
                                        image
                                            ? URL.createObjectURL(image)
                                            : config.SERVER_URL + data.imgUrl
                                    }
                                    className="w-[100px] max-h-[100px]"
                                />
                            </div>
                        )}
                    </div>

                    {error && (
                        <span className="block mt-2 text-sm text-red-500">
                            {error}
                        </span>
                    )}
                    <div className="flex items-center justify-end mt-5">
                        <button className="w-[160px]" disabled={isLoading}>
                            {isLoading ? <BtnLoader /> : "Add "}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
