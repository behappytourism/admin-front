import React, { useState } from "react";
import { BiPhone, BiUser } from "react-icons/bi";
import { BsDownload } from "react-icons/bs";
import { FiCheck } from "react-icons/fi";
import { MdClose } from "react-icons/md";
import { FiMapPin } from "react-icons/fi";
import { MdOutlineEmail } from "react-icons/md";
import ApproveVisaModal from "./ApproveVisaModal";
import StatusModal from "./StatusModal";
import { config } from "../../../constants";
// import samplevisa from "../../../../public/samplevisa.jpg";

function VisaApplicationSingleTableRow({
    singleVisaApplication,
    item,
    index,
    orderedBy,
}) {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [approveModal, setApproveModal] = useState(false);
    const [cancelModal, setCancelModal] = useState(false);
    const [visaId, setVisaId] = useState(singleVisaApplication._id);
    const [travellerId, setTravellerId] = useState("");
    const [status, setStatus] = useState(item.isStatus);

    const handleDownload = async (url) => {
        try {
            const response = await fetch(url);
            const blob = await response.blob();

            // Create a download link
            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.download = `${url.slice(-20)}`;

            // Trigger a click on the link to initiate the download
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error("Error downloading image:", error);
        }
    };

    return (
        <>
            <tr onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                <td className="capitalize p-3 text-[14px] text-textColor">
                    {index + 1}{" "}
                </td>
                <td className="capitalize p-3 text-[14px] text-textColor">
                    {item?.title}{" "}
                </td>
                <td className="capitalize p-3 text-[14px] text-textColor">
                    {item?.firstName}{" "}
                </td>
                <td className="capitalize p-3 text-[14px] text-textColor">
                    {item?.lastName}{" "}
                </td>
                <td className="capitalize p-3 text-[14px] text-textColor">
                    {item?.passportNo}{" "}
                </td>

                <td className="capitalize p-3 text-[14px] text-textColor">
                    {item?.contactNo}{" "}
                </td>
                {status == "initiated" ? (
                    <td className="capitalize p-3 text-[13px] underline text-blue-500">
                        {" "}
                        No Documents{" "}
                    </td>
                ) : status === "approved" ? (
                    <td className="capitalize p-3 text-[13px] underline text-blue-500">
                        {" "}
                        Approved{" "}
                    </td>
                ) : status === "rejected" ? (
                    <td className="capitalize p-3 text-[13px] underline text-blue-500">
                        {" "}
                        Rejected{" "}
                    </td>
                ) : (
                    <td className="capitalize p-3 text-[13px] underline text-blue-500">
                        <div className="flex items-center gap-[10px]">
                            <button
                                className="h-[35px] w-[35px] bg-green-500 flex items-center justify-center text-xl"
                                onClick={() => {
                                    setApproveModal(true);
                                    setTravellerId(item._id);
                                }}
                                // onClick={() => }
                            >
                                <FiCheck />
                            </button>
                            <button
                                className="h-[35px] w-[35px] bg-red-500 flex items-center justify-center text-xl"
                                onClick={() => {
                                    setCancelModal(true);
                                    setTravellerId(item._id);
                                }}
                            >
                                <MdClose />
                            </button>
                        </div>
                    </td>
                )}
            </tr>
            {approveModal && (
                <ApproveVisaModal
                    setApproveModal={setApproveModal}
                    travellerId={travellerId}
                    orderedBy={orderedBy}
                    setStatus={setStatus}
                    visaId={visaId}
                />
            )}
            {cancelModal && (
                <StatusModal
                    setCancelModal={setCancelModal}
                    travellerId={travellerId}
                    setStatus={setStatus}
                    orderedBy={orderedBy}
                    visaId={visaId}
                />
            )}
            <>
                {isDropdownOpen && (
                    <tr className="border-b border-tableBorderColor">
                        <td colSpan="8" className="p-3">
                            <div className="flex flex-wrap items-start gap-[3em]">
                                <div className="flex items-start gap-[1em]">
                                    <div>
                                        <h2 className="font-medium text-grayColor">
                                            Traveller Details
                                        </h2>
                                        <div className="">
                                            <span className="block text-[12px] text-grayColor">
                                                Title
                                            </span>
                                            <span className="block text-[15px] capitalize">
                                                {item?.title}
                                            </span>
                                        </div>
                                        <div className="">
                                            <span className="block text-[12px] text-grayColor">
                                                First Name
                                            </span>
                                            <span className="block text-[14px]">
                                                {item?.firstName}
                                            </span>
                                        </div>
                                        <div className="">
                                            <span className="block text-[12px] text-grayColor">
                                                Last Name
                                            </span>
                                            <span className="block text-[15px]">
                                                {item?.lastName}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="mt-4">
                                        <div className="">
                                            <span className="block text-[12px] text-grayColor">
                                                Date Of Birth
                                            </span>
                                            <span className="block text-[15px]">
                                                {item?.dateOfBirth?.day +
                                                    " / " +
                                                    item?.dateOfBirth?.month +
                                                    " / " +
                                                    item?.dateOfBirth?.year}
                                            </span>
                                        </div>
                                        <div className="">
                                            <span className="block text-[12px] text-grayColor">
                                                Contact Number
                                            </span>
                                            <span className="block text-[15px] capitalize">
                                                {item?.contactNo}
                                            </span>
                                        </div>
                                        <div className="">
                                            <span className="block text-[12px] text-grayColor">
                                                Passport Number
                                            </span>
                                            <span className="block text-[14px]">
                                                {item?.passportNo}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="mt-4">
                                        <div className="">
                                            <span className="block text-[12px] text-grayColor">
                                                Passport Expiry
                                            </span>
                                            <span className="block text-[15px]">
                                                {item?.expiryDate?.month +
                                                    " / " +
                                                    item?.expiryDate?.year}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="mt-4">
                                        <div className="block text-[12px] text-grayColor">
                                            Passport First Page
                                        </div>{" "}
                                        <div
                                            onClick={(e) =>
                                                handleDownload(
                                                    config.SERVER_URL +
                                                        item?.documents
                                                            ?.passportFistPagePhoto
                                                )
                                            }
                                        >
                                            <div className="w-[130px] h-[130px] overflow-hidden rounded-md relative hover:cursor-pointer">
                                                <div className="absolute w-full h-full flex  justify-center items-center text-[25px] hover:bg-[#fff5] text-green-600">
                                                    <BsDownload />
                                                </div>
                                                {item?.documents?.passportFistPagePhoto
                                                    .toLowerCase()
                                                    .endsWith(".pdf") ? (
                                                    <img
                                                        // src={samplevisa}
                                                        alt="Sample Visa"
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <img
                                                        src={
                                                            config.SERVER_URL +
                                                            item?.documents
                                                                ?.passportFistPagePhoto
                                                        }
                                                        alt=""
                                                        className="w-full h-full object-cover"
                                                    />
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-4">
                                        <div className="block text-[12px] text-grayColor">
                                            Passport Last Page
                                        </div>{" "}
                                        <div
                                            onClick={(e) =>
                                                handleDownload(
                                                    config.SERVER_URL +
                                                        item?.documents
                                                            ?.passportLastPagePhoto
                                                )
                                            }
                                        >
                                            <div className="w-[130px] h-[130px] overflow-hidden rounded-md relative hover:cursor-pointer">
                                                <div className="absolute w-full h-full flex  justify-center items-center text-[25px] hover:bg-[#fff5] text-green-600">
                                                    <BsDownload />
                                                </div>{" "}
                                                {item?.documents?.passportLastPagePhoto
                                                    .toLowerCase()
                                                    .endsWith(".pdf") ? (
                                                    <img
                                                        // src={samplevisa}
                                                        alt="Sample Visa"
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <img
                                                        src={
                                                            config.SERVER_URL +
                                                            item?.documents
                                                                ?.passportLastPagePhoto
                                                        }
                                                        alt=""
                                                        className="w-full h-full object-cover"
                                                    />
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-4">
                                        <div className="block text-[12px] text-grayColor">
                                            Passport Size Photo
                                        </div>{" "}
                                        <div
                                            onClick={(e) =>
                                                handleDownload(
                                                    config.SERVER_URL +
                                                        item?.documents
                                                            ?.passportSizePhoto
                                                )
                                            }
                                        >
                                            <div className="w-[130px] h-[130px] overflow-hidden rounded-md relative hover:cursor-pointer">
                                                <div className="absolute w-full h-full flex  justify-center items-center text-[25px] hover:bg-[#fff5] text-green-600">
                                                    <BsDownload />
                                                </div>{" "}
                                                {item?.documents?.passportSizePhoto
                                                    .toLowerCase()
                                                    .endsWith(".pdf") ? (
                                                    <img
                                                        // src={samplevisa}
                                                        alt="Sample Visa"
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <img
                                                        src={
                                                            config.SERVER_URL +
                                                            item?.documents
                                                                ?.passportSizePhoto
                                                        }
                                                        alt=""
                                                        className="w-full h-full object-cover"
                                                    />
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-4">
                                        <div className="block text-[12px] text-grayColor">
                                            Supportive Doc 1
                                        </div>{" "}
                                        <div
                                            onClick={(e) =>
                                                handleDownload(
                                                    config.SERVER_URL +
                                                        item?.documents
                                                            ?.supportiveDoc1
                                                )
                                            }
                                        >
                                            <div className="w-[130px] h-[130px] overflow-hidden rounded-md relative hover:cursor-pointer">
                                                <div className="absolute w-full h-full flex  justify-center items-center text-[25px] hover:bg-[#fff5] text-green-600">
                                                    <BsDownload />
                                                </div>
                                                {item?.documents?.supportiveDoc1
                                                    .toLowerCase()
                                                    .endsWith(".pdf") ? (
                                                    <img
                                                        // src={samplevisa}
                                                        alt="Sample Visa"
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <img
                                                        src={
                                                            config.SERVER_URL +
                                                            item?.documents
                                                                ?.supportiveDoc1
                                                        }
                                                        alt=""
                                                        className="w-full h-full object-cover"
                                                    />
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-4">
                                        <div className="block text-[12px] text-grayColor">
                                            Supportive Doc 2
                                        </div>{" "}
                                        <div
                                            onClick={(e) =>
                                                handleDownload(
                                                    config.SERVER_URL +
                                                        item?.documents
                                                            ?.supportiveDoc2
                                                )
                                            }
                                        >
                                            <div className="w-[130px] h-[130px] overflow-hidden rounded-md relative hover:cursor-pointer">
                                                <div className="absolute w-full h-full flex  justify-center items-center text-[25px] hover:bg-[#fff5] text-green-600">
                                                    <BsDownload />
                                                </div>
                                                {item?.documents?.supportiveDoc2
                                                    .toLowerCase()
                                                    .endsWith(".pdf") ? (
                                                    <img
                                                        // src={samplevisa}
                                                        alt="Sample Visa"
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <img
                                                        src={
                                                            config.SERVER_URL +
                                                            item?.documents
                                                                ?.supportiveDoc2
                                                        }
                                                        alt=""
                                                        className="w-full h-full object-cover"
                                                    />
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* <div>
                  <h2 className="font-medium text-grayColor">
                    Traveller Details
                  </h2>
                  <span className="flex items-center gap-[7px] mt-2">
                    <BiUser /> 
                  </span>
                  <span className="flex items-center gap-[7px] mt-2">
                    <MdOutlineEmail />
                  </span>
                  <span className="flex items-center gap-[7px] mt-2">
                    <FiMapPin />
                  </span>
                  <span className="flex items-center gap-[7px] mt-2">
                    <BiPhone /> 
                  </span>
                </div> */}
                            </div>
                        </td>
                    </tr>
                )}
            </>
        </>
    );
}

export default VisaApplicationSingleTableRow;
