import React from "react";
import { BsBuilding } from "react-icons/bs";
import { FiUser } from "react-icons/fi";
import { FaSkype, FaWhatsapp } from "react-icons/fa";
import { useOutletContext } from "react-router-dom";

export default function SingleVendorDetailsPage() {
    const { reseller } = useOutletContext();
    console.log(reseller);
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
                            {reseller?.b2bUserId?.companyName}
                        </span>
                    </div>
                    <div className="mt-3">
                        <span className="block text-[12px] text-grayColor">
                            Address
                        </span>
                        <span className="block text-[15px]">
                            {reseller?.b2bUserId?.address}
                        </span>
                    </div>
                    <div className="mt-3">
                        <span className="block text-[12px] text-grayColor">
                            Website
                        </span>
                        <span className="block text-[15px]">
                            {reseller?.b2bUserId?.website}
                        </span>
                    </div>
                    <div className="mt-3">
                        <span className="block text-[12px] text-grayColor">
                            Location
                        </span>
                        <span className="block text-[15px]">
                            {reseller?.b2bUserId?.city}
                            {reseller?.b2bUserId?.zipcode &&
                                `, ${reseller?.b2bUserId?.zipcode}`}
                        </span>
                    </div>
                    <div className="mt-3">
                        <span className="block text-[12px] text-grayColor">
                            Cuntry
                        </span>
                        <span className="block text-[15px]">
                            {reseller?.b2bUserId?.country?.countryName}
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
        </div>
    );
}
