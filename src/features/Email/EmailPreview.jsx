import React, { useEffect, useState } from "react";
import {
    BsBuilding,
    BsDownload,
    BsFillArrowRightCircleFill,
} from "react-icons/bs";
import { FaList } from "react-icons/fa";
import { MdClose } from "react-icons/md";
import { useSelector } from "react-redux";
import axios from "../../axios";
import { BtnLoader } from "../../components";
import { config } from "../../constants";
import EmailImageChooseModal from "./EmailImageChooseModal";

function EmailPreview({
    emailLists,
    emailTemplate,
    selectedSection,
    data,
    setKeyValue,
    keyValue,
    handleInpChange,
    handleImageSet,
    emails,
    setEmails,
    emailFooter,
    emailConfig,
}) {
    const [replaceHtml, setReplaceHtml] = useState("");
    const [selectedIndex, setSelectedIndex] = useState("");
    const [images, setImages] = useState([]);
    const [error, setError] = useState("");
    const [isModal, setIsModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isDownloadLoading, setIsDownloadLoading] = useState(false);

    const { jwtToken } = useSelector((state) => state.admin);
    const [email, setEmail] = useState("");
    const [emailMessage, setEmailMessage] = useState("");

    function replacePlaceholders(template, replacements) {
        let result = template;

        replacements?.forEach(({ key, value, image, type }) => {
            const regex = new RegExp(`<%= ${key} %>`, "g"); // Create a global regex for each key
            result = result.replace(
                regex,
                type !== "image"
                    ? value
                    : images.find((img) => img._id == image)?.image
            );
        });
        console.log(result, "result");

        setReplaceHtml(result);
    }

    useEffect(() => {
        replacePlaceholders(emailTemplate?.html || "", keyValue || []);
    }, [keyValue, data]);

    const fetchImages = async () => {
        try {
            const response = await axios.get(`/email/image`, {
                headers: { Authorization: `Bearer ${jwtToken}` },
            });

            setImages(response.data);
        } catch (err) {
            console.log(err);
            setError(
                err?.response?.data?.error || "Something went wrong, Try again"
            );
        }
    };

    const addEmail = () => {
        setEmails((prev) => {
            return [...prev, email];
        });
        setEmail("");
    };

    const removeEmail = (index) => {
        setEmails((prev) => {
            return prev.filter((_, i) => i !== index);
        });
    };

    console.log(emails);

    const downloadList = async (id) => {
        try {
            console.log("loading...", isLoading);
            setIsDownloadLoading(true);

            const response = await axios({
                url: `/email/list/download/${id}`,
                method: "GET",
                responseType: "blob",
                headers: {
                    authorization: `Bearer ${jwtToken}`,
                },
            });
            const href = URL.createObjectURL(response.data);

            const link = document.createElement("a");
            link.href = href;
            link.setAttribute("download", `${id}.xlsx`);
            document.body.appendChild(link);
            link.click();

            document.body.removeChild(link);
            URL.revokeObjectURL(href);

            setIsDownloadLoading(false);
        } catch (err) {
            console.log(err);
            setError(
                err?.response?.data?.error || "Something went wrong, Try again"
            );
        }
    };

    useEffect(() => {
        fetchImages();
    }, []);

    const handleSubmit = async (e) => {
        try {
            e.preventDefault();
            setIsLoading(true);
            setError("");

            let response = await axios.post(
                `/email/campaign/test`,
                {
                    subject: data.subject,
                    emailTemplateId: data.emailTemplateId,
                    emails: emails,
                    tags: keyValue,
                    emailConfigId: data?.emailConfigId,
                    emailFooterId : data?.emailFooterId
                },
                {
                    headers: { authorization: `Bearer ${jwtToken}` },
                }
            );
            setEmailMessage(response.data.message);
            setTimeout(() => {
                setEmailMessage("");
            }, [3000]);
            setIsLoading(false);
            navigate(
                `/email/campaign-groups/${data?.campaignGroupId}/campaigns`
            );
        } catch (err) {
            setError(
                err?.response?.data?.error || "Something went wrong, Try again"
            );
            setIsLoading(false);
        }
    };

    return (
        <div>
            {" "}
            <div
                className={selectedSection === "-preview" ? "block" : "hidden"}
            >
                <div>
                    <div className="w-full h-[20px bg-primaryColor text-textColor flex items-center justify-center">
                        <h1 className="text-white flex items-center p-2">
                            Preview
                        </h1>
                    </div>
                    <div className="mt-2">
                        <h1 className="font-[600] flex items-center gap-[10px] mb-3">
                            <BsFillArrowRightCircleFill /> Email Lisiting
                            Details
                        </h1>
                        <ol className="list-decimal pl-5">
                            {emailLists?.map((emailList, index) => {
                                return (
                                    <li>
                                        <div className="grid grid-cols-5 items-center">
                                            <div className="">
                                                <span className=" text-[12px] text-grayColor">
                                                    Name
                                                </span>
                                                <span className="block text-[15px]">
                                                    {emailList?.name}
                                                </span>
                                            </div>
                                            <div className="">
                                                <span className=" text-[12px] text-grayColor">
                                                    Type
                                                </span>

                                                <span className="block text-[15px]">
                                                    {emailList?.type ===
                                                    "manual"
                                                        ? "Upload file"
                                                        : "Configured mailing"}{" "}
                                                </span>
                                            </div>
                                            <div className="">
                                                <span className="text-[12px] text-grayColor">
                                                    Recipient Group{" "}
                                                </span>

                                                <span className="block text-[15px]">
                                                    {emailList?.recipientGroup}
                                                </span>
                                            </div>

                                            {emailList?.products.length > 0 && (
                                                <div className="">
                                                    <span className="text-[12px] text-grayColor">
                                                        Products
                                                    </span>
                                                    <div>
                                                        {emailList?.products.map(
                                                            (prod, index) => (
                                                                <span
                                                                    key={index}
                                                                >
                                                                    {" "}
                                                                    {prod}{" "}
                                                                </span>
                                                            )
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                            <div className="">
                                                <span className=" text-[12px] text-grayColor">
                                                    Download
                                                </span>
                                                <span
                                                    className="block text-green-500 text-[15px] pl-2"
                                                    onClick={(e) => {
                                                        // !isLoading &&
                                                        downloadList(
                                                            emailList._id
                                                        );
                                                    }}
                                                >
                                                    <BsDownload />
                                                </span>
                                            </div>
                                        </div>
                                    </li>
                                );
                            })}
                        </ol>
                    </div>

                    <div className="mt-2">
                        <h1 className="font-[600] flex items-center gap-[10px] mb-3">
                            <BsFillArrowRightCircleFill /> Email Template
                            Details
                        </h1>
                        <div className="list-disc pl-5">
                            <div className="grid grid-cols-4 ">
                                <div className="">
                                    <span className="block text-[12px] text-grayColor">
                                        Name
                                    </span>
                                    <span className="block text-[15px]">
                                        {emailTemplate?.name}
                                    </span>
                                </div>
                                <div className="">
                                    <span className="block text-[12px] text-grayColor">
                                        Type
                                    </span>
                                    <span className="block text-[15px]">
                                        {emailTemplate?.type === "manual"
                                            ? "Upload Template"
                                            : "Text"}{" "}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-2">
                        <h1 className="font-[600] flex items-center gap-[10px] mb-3">
                            <BsFillArrowRightCircleFill /> Email Config
                        </h1>
                        <div className="list-disc pl-5">
                            <div className="grid grid-cols-3 ">
                                <div className="">
                                    <span className="block text-[12px] text-grayColor">
                                        Email
                                    </span>
                                    <span className="block text-[15px]">
                                        {emailConfig?.email}
                                    </span>
                                </div>
                                <div className="">
                                    <span className="block text-[12px] text-grayColor">
                                        Port
                                    </span>
                                    <span className="block text-[15px]">
                                        {emailConfig?.port}
                                    </span>
                                </div>
                                <div className="">
                                    <span className="block text-[12px] text-grayColor">
                                        Host
                                    </span>
                                    <span className="block text-[15px]">
                                        {emailConfig?.host}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                    {emailTemplate?.type === "manual" &&
                        keyValue?.length > 0 && (
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
                                                    {/* <div className="flex items-center justify-center">
                                                    <button
                                                        className="w-[25px] h-[25px] rounded-full bg-green-500"
                                                        onClick={addTag}
                                                    >
                                                        +
                                                    </button>
                                                </div> */}
                                                </th>
                                                {/* )} */}
                                                <th className="font-[500] p-2 border">
                                                    key
                                                </th>
                                                <th className="font-[500] p-2 border">
                                                    value
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
                                            {keyValue?.map((tag, index) => (
                                                <tr
                                                    key={index}
                                                    className="border-b border-tableBorderColor"
                                                >
                                                    {/* {isEditPermission && ( */}
                                                    <td className="p-2 border w-[35px] min-w-[35px]">
                                                        {/* <div className="flex items-center justify-center">
                                                        <button
                                                            className="w-[25px] h-[25px] rounded-full bg-red-500"
                                                            onClick={(e) => {
                                                                removeTag(
                                                                    e,
                                                                    index
                                                                );
                                                            }}
                                                        >
                                                            -
                                                        </button>
                                                    </div> */}
                                                    </td>
                                                    {/* )} */}

                                                    <td className="border">
                                                        <input
                                                            type="text"
                                                            name="key"
                                                            value={
                                                                tag?.key || ""
                                                            }
                                                            // onChange={(e) =>
                                                            //     handleInpChange(
                                                            //         e,
                                                            //         index
                                                            //     )
                                                            // }
                                                            className="h-[100%]  px-2 border-0"
                                                            placeholder="Ex: Abc restaurant"
                                                            disabled={true}
                                                        />
                                                    </td>
                                                    {tag.type === "image" ? (
                                                        <td className="p-2 flex gap-10">
                                                            {" "}
                                                            <button
                                                                className="px-3"
                                                                onClick={(
                                                                    e
                                                                ) => {
                                                                    setIsModal(
                                                                        true
                                                                    );
                                                                    setSelectedIndex(
                                                                        index
                                                                    );
                                                                }}
                                                            >
                                                                Choose
                                                            </button>{" "}
                                                            {tag?.image && (
                                                                <img
                                                                    src={
                                                                        images.find(
                                                                            (
                                                                                img
                                                                            ) =>
                                                                                img._id ==
                                                                                tag?.image
                                                                        )?.image
                                                                    }
                                                                    alt=""
                                                                    className="w-[40px] h-[40px] rounded object-cover"
                                                                />
                                                            )}{" "}
                                                        </td>
                                                    ) : (
                                                        <td className="border">
                                                            <input
                                                                type="text"
                                                                name="value"
                                                                value={
                                                                    tag?.value ||
                                                                    ""
                                                                }
                                                                onChange={(e) =>
                                                                    handleInpChange(
                                                                        e,
                                                                        index
                                                                    )
                                                                }
                                                                className="h-[100%]  px-2 border-0"
                                                                placeholder={`Ex: sample ${tag?.key}`}
                                                                // disabled={
                                                                //     !isEditPermission
                                                                // }
                                                            />
                                                        </td>
                                                    )}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                    <div className="mt-2">
                        <h1 className="font-[600] flex items-center gap-[10px] mb-3">
                            <BsFillArrowRightCircleFill /> View
                        </h1>
                        <div className="p-5">
                            {" "}
                            <span className="font-[600] text-[15px]">
                                Subject :{" "}
                            </span>
                            <span className=" text-[15px] pl-5">
                                {data?.subject}
                            </span>
                        </div>
                        <div
                            dangerouslySetInnerHTML={{
                                __html: replaceHtml + emailFooter?.html,
                            }}
                        ></div>
                    </div>
                    <div className="mt-2">
                        <h1 className="font-[600] flex items-center gap-[10px] mb-3">
                            <BsFillArrowRightCircleFill /> Test
                        </h1>
                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <label htmlFor="">Email</label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        placeholder="Enter  email"
                                        name="name"
                                        value={email || ""}
                                        onChange={(e) => {
                                            setEmail(e.target.value);
                                        }}
                                        required
                                    />
                                    <button
                                        className="w-[100px] bg-primaryColor"
                                        onClick={addEmail}
                                    >
                                        Add
                                    </button>{" "}
                                    {isLoading ? (
                                        <button
                                            className="w-[100px] bg-primaryColor"
                                            // onClick={handleSubmit}
                                            // disabled={isLoading}
                                        >
                                            <BtnLoader />
                                        </button>
                                    ) : (
                                        <button
                                            className="w-[200px] bg-green-500"
                                            onClick={handleSubmit}
                                        >
                                            Send Test
                                        </button>
                                    )}
                                </div>
                            </div>{" "}
                            <div className="flex items-center jusitfy-center">
                                {emailMessage && (
                                    <span className="text-sm text-green-500 block mt-4">
                                        {emailMessage}
                                    </span>
                                )}
                            </div>
                        </div>
                        <div>
                            {emails?.length < 1 ? (
                                <div className="text-center">
                                    <span className="font-medium text-sm text-grayColor">
                                        No emails selected..!
                                    </span>
                                </div>
                            ) : (
                                <div className="flex items-center gap-[10px] flex-wrap mt-2">
                                    {emails?.map((email, index) => {
                                        return (
                                            <span
                                                key={index}
                                                className="bg-[#f3f6f9] rounded px-2 py-1 text-sm flex items-center gap-[10px]"
                                            >
                                                <span className="capitalize">
                                                    {email}
                                                </span>
                                                <span
                                                    className="text-base cursor-pointer text-red-500"
                                                    onClick={() => {
                                                        removeEmail(index);
                                                    }}
                                                >
                                                    <MdClose />
                                                </span>
                                            </span>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            {isModal && (
                <EmailImageChooseModal
                    setIsModal={setIsModal}
                    selectedIndex={selectedIndex}
                    handleImageSet={handleImageSet}
                    images={images}
                    tags={keyValue}
                    // setImages={setImages}
                />
            )}
        </div>
    );
}

export default EmailPreview;
