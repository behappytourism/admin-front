import React, { useRef, useState } from "react";
import { useSelector } from "react-redux";
import { MdClose } from "react-icons/md";

import axios from "../../../axios";
import { useHandleClickOutside, useImageChange } from "../../../hooks";
import { BtnLoader } from "../../../components";
import { useParams } from "react-router-dom";
import { config } from "../../../constants";

export default function B2BHomeBannerModal({
    setIsModalOpen,
    banners,
    setBanners,
    edit,
    bannerId,
    index,
    b2b,
}) {
    const [data, setData] = useState({
        title: banners[index]?.title || "",
        description: banners[index]?.description || "",
        link: banners[index]?.link || "",
        imageUrl: banners[index]?.image || "",
    });
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const { id } = useParams();
    const wrapperRef = useRef();
    useHandleClickOutside(wrapperRef, () => setIsModalOpen(false));
    const { jwtToken } = useSelector((state) => state.admin);

    const handleChange = (e) => {
        setData((prev) => {
            return { ...prev, [e.target.name]: e.target.value };
        });
    };

    const {
        image: image,
        handleImageChange: handleIconImgChange,
        error: imageError,
    } = useImageChange();

    const handleSubmit = async (e) => {
        try {
            e.preventDefault();
            setError("");
            setIsLoading(true);

            const formData = new FormData();
            formData.append("title", data.title);
            formData.append("description", data.description);

            formData.append("link", data.link);
            formData.append("image", image);

            if (edit) {
                const bannerId = banners[index]._id;

                const response = await axios.patch(
                    b2b
                        ? `/frontend/b2b/home/banner/edit/${id}/${bannerId}`
                        : `/frontend/b2c/home/banner/edit/${id}/${bannerId}`,
                    formData,
                    {
                        headers: { Authorization: `Bearer ${jwtToken}` },
                    }
                );

                const updatedSections = banners.map((banner) =>
                    banner._id === bannerId
                        ? {
                              _id: bannerId,
                              title: data.title,
                              description: data.description,
                              link: data?.link || "",
                              image: response?.data?.image || "",
                          }
                        : banner
                );

                setBanners(updatedSections);

                setIsLoading(false);
                setIsModalOpen(false);
            } else {
                const response = await axios.post(
                    `/b2b/home/banner/add/${id}`,
                    formData,
                    {
                        headers: { Authorization: `Bearer ${jwtToken}` },
                    }
                );
                setBanners((prev) => [
                    ...prev,
                    {
                        _id: response?.data?._id,
                        title: data?.title,
                        description: data?.description,
                        link: data?.link,
                        image: response?.data?.image,
                    },
                ]);
                setIsLoading(false);
                setIsModalOpen(false);
            }
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
                    <h2 className="font-medium mb-2">Add Banner</h2>
                    <button
                        className="h-auto bg-transparent text-textColor text-xl"
                        onClick={() => setIsModalOpen(false)}
                    >
                        <MdClose />
                    </button>
                </div>
                <div className="p-4">
                    <form action="" onSubmit={handleSubmit}>
                        <div className="mt-4">
                            <label htmlFor="">Title *</label>
                            <input
                                type="text"
                                name="title"
                                value={data?.title || ""}
                                onChange={handleChange}
                                placeholder="Enter title"
                                id=""
                                required
                            />
                        </div>
                        <div className="mt-4">
                            <label htmlFor="">Description *</label>
                            <input
                                type="text"
                                value={data.description || ""}
                                name="description"
                                onChange={handleChange}
                                placeholder="Enter description"
                                required
                            />
                        </div>{" "}
                        <div className="mt-4">
                            <label htmlFor="">link *</label>
                            <input
                                type="text"
                                value={data.link || ""}
                                name="link"
                                onChange={handleChange}
                                placeholder="Enter link"
                                required
                            />
                        </div>{" "}
                        <div className="mt-4">
                            <label htmlFor=""> *</label>
                            <input
                                type="file"
                                onChange={handleIconImgChange}
                                required={edit === false}
                            />
                            {imageError && (
                                <span className="text-sm text-red-500 block mt-2">
                                    {imageError}
                                </span>
                            )}
                            {(image || data.imageUrl) && (
                                <img
                                    src={
                                        image
                                            ? URL.createObjectURL(image)
                                            : config?.SERVER_URL +
                                              data?.imageUrl
                                    }
                                    alt=""
                                    className="w-[40px] max-h-[40px] mt-3"
                                />
                            )}
                        </div>
                        {error && (
                            <span className="text-sm block text-red-500 mt-2">
                                {error}
                            </span>
                        )}
                        <div className="mt-4 flex items-center justify-end gap-[12px]">
                            <button
                                className="bg-slate-300 text-textColor px-[15px]"
                                type="button"
                                onClick={() => setIsModalOpen(false)}
                            >
                                Cancel
                            </button>
                            <button className="w-[160px]">
                                {isLoading ? <BtnLoader /> : "Add Section"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
