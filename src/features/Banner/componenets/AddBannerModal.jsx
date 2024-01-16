import React, { useEffect, useRef, useState } from "react";
import { useHandleClickOutside, useImageChange } from "../../../hooks";
import { MdClose } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import axios from "../../../axios";
import { config } from "../../../constants";
import { BtnLoader } from "../../../components";

export default function AddBannerModal({
    setIsModalOpen,
    isModalOpen,
    setData,
    data,
    editIndex,
    edit,
    setEdit,
    setEditIndex,
}) {
    const wrapperRef = useRef();
    const dispatch = useDispatch();
    const { jwtToken } = useSelector((state) => state.admin);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    console.log(editIndex, data?.banners[editIndex]?.title, "editIndex");
    const [initial, setInitial] = useState({
        title: data?.banners[editIndex]?.title || "",
        body: data?.banners[editIndex]?.body || "",
        imageUrl: data?.banners[editIndex]?.image || "",
        isButton: data.banners[editIndex]?.isButton || false,
        buttonText: data?.banners[editIndex]?.buttonText || "",
        buttonUrl: data?.banners[editIndex]?.buttonUrl || "",
    });
    const { id } = useParams();

    const handleChange = (e) => {
        setInitial({ ...initial, [e.target.name]: e.target.value });
    };
    const handleChkChange = (e) => {
        setInitial((prev) => {
            return { ...prev, [e.target.name]: e.target.checked };
        });
    };

    const {
        image: image,
        handleImageChange: handleIconImgChange,
        error: imageError,
    } = useImageChange(2000000);

    const handleDataChange = async (e) => {
        try {
            e.preventDefault();
            setIsLoading(true);
            setError("");

            const formData = new FormData();
            formData.append("title", initial.title);
            formData.append("body", initial.body);
            formData.append("isButton", initial.isButton);
            formData.append("buttonText", initial.buttonText);
            formData.append("buttonUrl", initial.buttonUrl);
            formData.append("image", image);

            if (edit) {
                const response = await axios.patch(
                    `/banners/edit/single/${id}/${data?.banners[editIndex]?._id}`,
                    formData,
                    {
                        headers: { Authorization: `Bearer ${jwtToken}` },
                    }
                );

                setData((prev) => ({
                    ...prev,
                    banners: response.data.banners,
                }));
            } else {
                const response = await axios.patch(
                    `/banners/add/single/${id}`,
                    formData,
                    {
                        headers: { Authorization: `Bearer ${jwtToken}` },
                    }
                );
                setData((prev) => ({
                    ...prev,
                    banners: response.data.banners,
                }));
            }
            setIsModalOpen(false);
            setEdit(false);
            setEditIndex("");
        } catch (err) {
            setError(
                err?.response?.data?.error || "Something went wrong, Try again"
            );
            setIsLoading(false);
        }
    };
    useEffect(() => {
        setInitial({
            title: data?.banners[editIndex]?.title || "",
            body: data?.banners[editIndex]?.body || "",
            imageUrl: data?.banners[editIndex]?.image || "",
            isButton: data?.banners[editIndex]?.isButton || false,
            buttonText: data?.banners[editIndex]?.buttonText || "",
            buttonUrl: data?.banners[editIndex]?.buttonUrl || "",
        });
    }, [editIndex, data]);

    console.log(initial, "title");

    useHandleClickOutside(wrapperRef, () => setIsModalOpen(false));

    return (
        <div
            className={
                "fixed inset-0 w-full h-full bg-[#fff5] flex items-center justify-center z-20 " +
                (isModalOpen ? "block" : "hidden")
            }
        >
            <div
                ref={wrapperRef}
                className="bg-[#fff] w-full max-h-[90vh] max-w-[800px]  shadow-[0_1rem_3rem_rgb(0_0_0_/_18%)] overflow-y-auto"
            >
                <div className="flex items-center justify-between border-b p-4">
                    <h2 className="font-medium mb-2">Add Details</h2>
                    <button
                        className="h-auto bg-transparent text-textColor text-xl"
                        onClick={() => setIsModalOpen(false)}
                    >
                        <MdClose />
                    </button>
                </div>
                <div className="p-4">
                    <div>
                        <label htmlFor="">Title</label>
                        <input
                            type="text"
                            name="title"
                            value={initial.title || ""}
                            onChange={(e) => handleChange(e)}
                        />
                    </div>
                    <div className="mt-4">
                        <label htmlFor="">Body</label>
                        <input
                            id=""
                            placeholder="Enter The Body"
                            name="body"
                            value={initial.body || ""}
                            onChange={(e) => handleChange(e)}
                        ></input>{" "}
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
                        {(image || initial.imageUrl) && (
                            <img
                                src={
                                    image
                                        ? URL.createObjectURL(image)
                                        : config?.SERVER_URL + initial?.imageUrl
                                }
                                alt=""
                                className="w-[40px] max-h-[40px] mt-3"
                            />
                        )}
                    </div>
                    <div className="mt-4 flex items-center gap-[10px]">
                        <input
                            type="checkbox"
                            name="isButton"
                            id="isButton"
                            className="w-[16px] h-[16px]"
                            onChange={handleChkChange}
                        />
                        <label htmlFor="isButton" className="mb-0">
                            Is Button ?
                        </label>
                    </div>
                    {initial.isButton && (
                        <>
                            <div className="mt-4">
                                <label htmlFor="">Button Text</label>
                                <input
                                    id=""
                                    placeholder="Enter Button Text"
                                    name="buttonText"
                                    value={initial.buttonText || ""}
                                    onChange={(e) => handleChange(e)}
                                ></input>{" "}
                            </div>{" "}
                            <div className="mt-4">
                                <label htmlFor="">Button Url</label>
                                <input
                                    id=""
                                    placeholder="Enter The URL"
                                    name="buttonUrl"
                                    value={initial.buttonUrl || ""}
                                    onChange={(e) => handleChange(e)}
                                ></input>{" "}
                            </div>
                        </>
                    )}
                    {error && (
                        <span className="text-sm text-red-500 block mt-4">
                            {error}
                        </span>
                    )}
                    <div className="flex items-center justify-end mt-6">
                        <button className="px-3" onClick={handleDataChange}>
                            {isLoading ? <BtnLoader /> : "Add Banner"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
