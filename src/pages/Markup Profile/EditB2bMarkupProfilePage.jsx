import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { SiYourtraveldottv } from "react-icons/si";
import {
    fetchAttractionInitialData,
    fetchVisaInitialData,
} from "../../redux/slices/markupProfileFormSlice";

import axios from "../../axios";
import { BtnLoader, PageLoader, RichTextEditor } from "../../components";
import AttractionProfileListTable from "../../features/MarkupProfile/components/AttractionProfileListTable";
import VisaProfileListTable from "../../features/MarkupProfile/components/VisaProfileListTable";
import A2aProfileListTable from "../../features/MarkupProfile/components/A2aProfileListTable";
import HotelStarCategoryTable from "../../features/MarkupProfile/components/HotelStarCategoryTable";
import QuotationProfileTable from "../../features/MarkupProfile/components/QuotationProfileTable";
import HotelRoomTypeTable from "../../features/MarkupProfile/components/HotelRoomTypeTable";
import FlightProfileTable from "../../features/MarkupProfile/components/FlightProfileTable";
import InsuranceProfileTable from "../../features/MarkupProfile/components/InsuranceProfileTable";
import TransferProfileTable from "../../features/MarkupProfile/components/TransferProfileTable";

export default function EditB2bMarkupProfilePage({ selectedProfile }) {
    const [error, setError] = useState("");
    const [hotelSection, setHotelSection] = useState("category");
    const [formData, setFormData] = useState({
        name: "",
        category: "",
    });
    const [isLoading, setIsLoading] = useState(false);
    const [isPageLoading, setIsPageLoading] = useState(false);

    const [initalAttractionList, setInitalAttractionList] = useState([]);

    const [attractionList, setAttractionList] = useState([]);
    const [visaTypeList, setVisaTypeList] = useState([]);
    const [a2aTypeList, setA2aTypeList] = useState([]);
    const [hotelList, setHotelList] = useState([]);

    const [activity, setActivity] = useState([]);
    const [visa, setVisa] = useState([]);
    const [a2a, setA2a] = useState([]);
    const [roomType, setRoomType] = useState([]);

    const [section, setSection] = useState("attraction");
    const [filter, setFilter] = useState({
        attractionName: "",
    });
    const [type, setType] = useState("profile");

    const handleChange = (e) => {
        setFormData((prev) => {
            return { ...prev, [e.target.name]: e.target.value };
        });
    };

    const [quotation, setQuotation] = useState({
        hotelMarkupType: "flat",
        hotelMarkup: 0,
        landmarkMarkupType: "flat",
        landmarkMarkup: 0,
        visaMarkupType: "flat",
        visaMarkup: 0,
    });

    const { id } = useParams();
    const navigate = useNavigate();
    const { jwtToken } = useSelector((state) => state.admin);

    const handleSectionChange = (e, value) => {
        e.preventDefault();
        setSection(value);
    };

    const handleHotelSectionChange = (e, value) => {
        e.preventDefault();
        setHotelSection(value);
    };

    return (
        <div>
            {isPageLoading ? (
                <PageLoader />
            ) : (
                <div className="">
                    <div className="bg-white rounded pb-6 shadow-sm">
                        <div className="flex items-center justify-between border-b border-dashed p-4">
                            <h1 className="text-base font-medium flex items-center gap-[10px]">
                                <SiYourtraveldottv /> Edit Markup
                            </h1>
                        </div>

                        <div className="flex items-center gap-[13px] px-4 border-b border-b-dahsed">
                            <button
                                className={
                                    "px-2 py-4 h-auto bg-transparent text-primaryColor font-medium rounded-none " +
                                    (section === "attraction"
                                        ? "border-b border-b-orange-500"
                                        : "")
                                }
                                onClick={(e) => {
                                    handleSectionChange(e, "attraction");
                                }}
                            >
                                Attraction
                            </button>

                            <button
                                className={
                                    "px-2 py-4 h-auto bg-transparent text-primaryColor font-medium rounded-none " +
                                    (section === "transfer"
                                        ? "border-b border-b-orange-500"
                                        : "")
                                }
                                onClick={(e) => {
                                    handleSectionChange(e, "transfer");
                                }}
                            >
                                Transfer
                            </button>
                        </div>

                        {section === "attraction" && (
                            <div
                                className={
                                    section === "attraction"
                                        ? "block pt-10"
                                        : "hidden"
                                }
                            >
                                {" "}
                                <AttractionProfileListTable type={type} />
                            </div>
                        )}
                      
                        {section === "transfer" && (
                            <div
                                className={
                                    section === "transfer"
                                        ? "block pt-10"
                                        : "hidden"
                                }
                            >
                                {" "}
                                <TransferProfileTable type={"profile"} />
                            </div>
                        )}

                        {error && (
                            <span className="text-sm block text-red-500 mt-2">
                                {error}
                            </span>
                        )}
                        {error && (
                            <span className="text-sm block text-red-500 mt-2">
                                {error}
                            </span>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
