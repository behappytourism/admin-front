import React, { useEffect, useRef, useState } from "react";
import { MdClose } from "react-icons/md";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import { useHandleClickOutside, useImageChange } from "../../hooks";
import { BtnLoader } from "../../components";
import axios from "../../axios";
import { config } from "../../constants";
import { TiTick } from "react-icons/ti";

export default function EmailTemplateChooseModal({
    setIsModal,
    emailTemplates,
    selectedTemplate,
    handleChooseTemplate,
    emailTemplateId,
}) {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [data, setData] = useState({
        name: selectedTemplate?._id || "",
        html: selectedTemplate?.html || "",
    });

    const handleChange = (e) => {
        setData((prev) => {
            return { ...prev, [e.target.name]: e.target.value };
        });
    };

    const { jwtToken } = useSelector((state) => state.admin);
    const wrapperRef = useRef();

    return (
        <div className="fixed inset-0 w-full h-full bg-[#fff5] flex items-center justify-center z-20 ">
            <div
                ref={wrapperRef}
                className="bg-[#fff] w-full max-h-[90vh] rounded max-w-[900px]  shadow-[0_1rem_3rem_rgb(0_0_0_/_18%)] overflow-y-auto"
            >
                <div className="flex items-center justify-between border-b p-4">
                    <h2 className="font-medium mb-2">Choose Template</h2>
                    <button
                        className="h-auto bg-transparent text-textColor text-xl"
                        onClick={() => setIsModal(false)}
                    >
                        <MdClose />
                    </button>
                </div>

                <div className="flex flex-col overflow-y-auto gap-10 p-10 border p-5">
                    {emailTemplates.map((emailTemplate, index) => {
                        return (
                            <div className="p-5">
                                {" "}
                                <div className="h-[40px] w-full">
                                    <div className="text-center  flex justify-center items-center bg-primaryColor ">
                                        <h1 className="p-2 text-white  flex justify-center items-center text-lg font-medium text-center">
                                            Template {emailTemplate.name}
                                        </h1>
                                        <div className="flex items-start justify-end">
                                            <input
                                                type="checkbox"
                                                name="isContractAvailable"
                                                checked={
                                                    emailTemplateId ===
                                                        emailTemplate._id.toString() ||
                                                    false
                                                }
                                                onChange={(e) => {
                                                    handleChooseTemplate(
                                                        emailTemplate._id
                                                    );
                                                }}
                                                className="w-[17px] h-[17px]"
                                                id="isContractAvailable"
                                                // disabled={!isEditPermission}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-1 items-center justify-center py-5 bg-gray-200 ">
                                    <div
                                        onClick={() => {
                                            // handleImageSet(
                                            //     image._id,
                                            //     selectedIndex
                                            // );
                                        }}
                                        className=""
                                        dangerouslySetInnerHTML={{
                                            __html: emailTemplate?.html,
                                        }}
                                    ></div>
                                </div>
                            </div>
                        );
                    })}
                </div>
                {/* <form className="p-4" onSubmit={handleSubmit}>
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
                            {isLoading ? <BtnLoader /> : "Add Points"}
                        </button>
                    </div>
                </form> */}
            </div>
        </div>
    );
}
