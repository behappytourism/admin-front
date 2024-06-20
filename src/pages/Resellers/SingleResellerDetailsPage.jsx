import React from "react";
import { BsBuilding, BsDownload } from "react-icons/bs";
import { FiUser } from "react-icons/fi";
import { FaSkype, FaWhatsapp } from "react-icons/fa";
import { useOutletContext } from "react-router-dom";
import { config } from "../../constants";

export default function SingleResellerDetailsPage() {
    const { reseller } = useOutletContext();
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
        <div>
            <div className="p-4 grid grid-cols-2 gap-[20px]">
                <div>
                    <div className="flex items-center gap-[8px] mb-3">
                        <span>
                            <BsBuilding />
                        </span>
                        <span className="font-[600] text-[15px] ">
                            Company Details
                        </span>
                    </div>
                    <div className="">
                        <span className="block text-[12px] text-grayColor">
                            Company Name
                        </span>
                        <span className="block text-[15px]">
                            {reseller?.companyName}
                        </span>
                    </div>
                    <div className="mt-3">
                        <span className="block text-[12px] text-grayColor">
                            Address
                        </span>
                        <span className="block text-[15px]">
                            {reseller?.address}
                        </span>
                    </div>
                    <div className="mt-3">
                        <span className="block text-[12px] text-grayColor">
                            Website
                        </span>
                        <span className="block text-[15px]">
                            {reseller?.website}
                        </span>
                    </div>
                    <div className="mt-3">
                        <span className="block text-[12px] text-grayColor">
                            Location
                        </span>
                        <span className="block text-[15px]">
                            {reseller?.city}
                            {reseller?.zipcode && `, ${reseller?.zipcode}`}
                        </span>
                    </div>
                    <div className="mt-3">
                        <span className="block text-[12px] text-grayColor">
                            Cuntry
                        </span>
                        <span className="block text-[15px]">
                            {reseller?.country?.countryName}
                        </span>
                    </div>
                </div>
                <div>
                    <div className="flex items-center gap-[8px] mb-3">
                        <span>
                            <FiUser />
                        </span>
                        <span className="font-[600] text-[15px]">
                            Profile Details
                        </span>
                    </div>
                    <div className="">
                        <span className="block text-[12px] text-grayColor">
                            Name
                        </span>
                        <span className="block text-[15px]">
                            {reseller?.name}
                        </span>
                    </div>
                    <div className="mt-3">
                        <span className="block text-[12px] text-grayColor">
                            Phone Number
                        </span>
                        <span className="block text-[15px]">
                            {reseller?.country?.phonecode}{" "}
                            {reseller?.phoneNumber}
                        </span>
                        <span className="block text-[15px] mt-[2px]">
                            {reseller?.telephoneNumber}
                        </span>
                    </div>
                    <div className="mt-3">
                        <span className="block text-[12px] text-grayColor">
                            Email
                        </span>
                        <span className="block text-[15px]">
                            {reseller?.email}
                        </span>
                    </div>
                    <div className="mt-3">
                        <span className="block text-[12px] text-grayColor">
                            Designation
                        </span>
                        <span className="block text-[15px]">
                            {reseller?.designation}
                        </span>
                    </div>
                    <div className="mt-3">
                        <span className="block text-[12px] text-grayColor">
                            Social
                        </span>
                        {reseller?.skypeId && (
                            <span className="text-[15px] flex items-center gap-[10px]">
                                <FaSkype /> {reseller?.skypeId}
                            </span>
                        )}
                        {reseller?.whatsappNumber && (
                            <span className="text-[15px] flex items-center gap-[10px] mt-1">
                                <FaWhatsapp /> {reseller?.country?.phonecode}{" "}
                                {reseller?.whatsappNumber}
                            </span>
                        )}
                    </div>
                </div>
            </div>
            <div className="p-4 grid grid-cols-2 ">
                <div>
                    <div className="flex items-center gap-[8px] mb-3">
                        <span>
                            <BsBuilding />
                        </span>
                        <span className="font-[600] text-[15px] ">
                            Company Documents
                        </span>
                    </div>
                </div>
                <div></div>
                <div>
                    <span className="block text-[12px] text-grayColor">
                        Tax Certificate
                    </span>
                    <div className="">
                        <div
                            onClick={(e) =>
                                handleDownload(
                                    config.SERVER_URL + reseller?.taxCertificate
                                )
                            }
                        >
                            <div className="w-[130px] h-[130px] overflow-hidden rounded-md relative hover:cursor-pointer">
                                <div className="absolute w-full h-full flex  justify-center items-center text-[25px] hover:bg-[#fff5] text-green-600">
                                    <BsDownload />
                                </div>
                                {reseller?.taxCertificate
                                    ?.toLowerCase()
                                    ?.endsWith(".pdf") ? (
                                    <img
                                        // src={samplevisa}
                                        alt="Sample Visa"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <img
                                        src={
                                            config.SERVER_URL +
                                            reseller?.taxCertificate
                                        }
                                        alt=""
                                        className="w-full h-full object-cover"
                                    />
                                )}
                            </div>
                        </div>
                    </div>{" "}
                </div>
                <div>
                    <span className="block text-[12px] text-grayColor">
                        Trade License
                    </span>
                    <div className="">
                        <div
                            onClick={(e) =>
                                handleDownload(
                                    config.SERVER_URL + reseller?.tradeLicense
                                )
                            }
                        >
                            <div className="w-[130px] h-[130px] overflow-hidden rounded-md relative hover:cursor-pointer">
                                <div className="absolute w-full h-full flex  justify-center items-center text-[25px] hover:bg-[#fff5] text-green-600">
                                    <BsDownload />
                                </div>
                                {reseller?.tradeLicense
                                    ?.toLowerCase()
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
                                            reseller?.tradeLicense
                                        }
                                        alt=""
                                        className="w-full h-full object-cover"
                                    />
                                )}
                            </div>
                        </div>
                    </div>{" "}
                </div>
            </div>
        </div>
    );
}
