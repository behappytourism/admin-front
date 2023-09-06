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

export default function EditMarkupProfilePage() {
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isPageLoading, setIsPageLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        category: "",
    });

    const [type, setType] = useState("profile");

    const [initalAttractionList, setInitalAttractionList] = useState([]);

    const [filter, setFilter] = useState({
        attractionName: "",
    });

    const [attractionList, setAttractionList] = useState([]);
    const [visaTypeList, setVisaTypeList] = useState([]);
    const [activity, setActivity] = useState([]);
    const [visa, setVisa] = useState([]);
    const [a2a, setA2a] = useState([]);
    const [roomType, setRoomType] = useState([]);
    const [quotation, setQuotation] = useState({
        hotelMarkupType: "flat",
        hotelMarkup: 0,
        landmarkMarkupType: "flat",
        landmarkMarkup: 0,
        visaMarkupType: "flat",
        visaMarkup: 0,
    });

    const [a2aTypeList, setA2aTypeList] = useState([]);
    const [hotelList, setHotelList] = useState([]);

    const [section, setSection] = useState("attraction");
    const [hotelSection, setHotelSection] = useState("category");

    const { profileId } = useParams();
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

    const handleChange = (e) => {
        setFormData((prev) => {
            return { ...prev, [e.target.name]: e.target.value };
        });
    };

    return (
        <div>
            <div className="bg-white flex items-center justify-between gap-[10px] px-6 shadow-sm border-t py-2">
                <h1 className="font-[600] text-[15px] uppercase">
                    Edit Profile
                </h1>
                <div className="text-sm text-grayColor">
                    <Link to="/" className="text-textColor">
                        Dashboard{" "}
                    </Link>
                    <span>{">"} </span>
                    <Link to="/markup/profile" className="text-textColor">
                        Profile{" "}
                    </Link>
                    <span>{">"} </span>

                    <Link
                        // to={`/attractions/${id}/edit`}
                        className="text-textColor"
                    >
                        Edit{" "}
                    </Link>
                </div>
            </div>

            {isPageLoading ? (
                <PageLoader />
            ) : (
                <div className="p-6">
                    <div className="bg-white rounded p-6 shadow-sm">
                        <div className="flex items-center justify-between border-b border-dashed p-4">
                            <h1 className="text-base font-medium flex items-center gap-[10px]">
                                <SiYourtraveldottv /> Edit Markup Profile
                            </h1>
                        </div>

                        <div className="grid grid-cols-3 items-end gap-5">
                            <div>
                                <label htmlFor="">Name</label>
                                <input
                                    type="text"
                                    // placeholder="Ex: "
                                    name="name"
                                    value={formData.name || ""}
                                    onChange={handleChange}
                                    required
                                    disabled
                                />
                            </div>
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
                                    (section === "visa"
                                        ? "border-b border-b-orange-500"
                                        : "")
                                }
                                onClick={(e) => {
                                    handleSectionChange(e, "visa");
                                }}
                            >
                                Visa
                            </button>
                            <button
                                className={
                                    "px-2 py-4 h-auto bg-transparent text-primaryColor font-medium rounded-none " +
                                    (section === "hotel"
                                        ? "border-b border-b-orange-500"
                                        : "")
                                }
                                onClick={(e) => {
                                    handleSectionChange(e, "hotel");
                                }}
                            >
                                Hotel
                            </button>
                            <button
                                className={
                                    "px-2 py-4 h-auto bg-transparent text-primaryColor font-medium rounded-none " +
                                    (section === "a2a"
                                        ? "border-b border-b-orange-500"
                                        : "")
                                }
                                onClick={(e) => {
                                    handleSectionChange(e, "a2a");
                                }}
                            >
                                A2a
                            </button>
                            <button
                                className={
                                    "px-2 py-4 h-auto bg-transparent text-primaryColor font-medium rounded-none " +
                                    (section === "quotation"
                                        ? "border-b border-b-orange-500"
                                        : "")
                                }
                                onClick={(e) => {
                                    handleSectionChange(e, "quotation");
                                }}
                            >
                                Quotation
                            </button>
                            <button
                                className={
                                    "px-2 py-4 h-auto bg-transparent text-primaryColor font-medium rounded-none " +
                                    (section === "flight"
                                        ? "border-b border-b-orange-500"
                                        : "")
                                }
                                onClick={(e) => {
                                    handleSectionChange(e, "flight");
                                }}
                            >
                                Flight
                            </button>
                            <button
                                className={
                                    "px-2 py-4 h-auto bg-transparent text-primaryColor font-medium rounded-none " +
                                    (section === "insurance"
                                        ? "border-b border-b-orange-500"
                                        : "")
                                }
                                onClick={(e) => {
                                    handleSectionChange(e, "insurance");
                                }}
                            >
                                Insurance
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
                                <AttractionProfileListTable
                                    type={type}
                                    setFormData={setFormData}
                                />
                            </div>
                        )}
                        {section === "visa" && (
                            <div
                                className={
                                    section === "visa"
                                        ? "block pt-10"
                                        : "hidden"
                                }
                            >
                                {" "}
                                <VisaProfileListTable />
                            </div>
                        )}
                        {section === "a2a" && (
                            <div
                                className={
                                    section === "a2a" ? "block pt-10" : "hidden"
                                }
                            >
                                {" "}
                                <A2aProfileListTable />
                            </div>
                        )}
                        {section === "hotel" && (
                            <div
                                className={
                                    section === "hotel"
                                        ? "block pt-10"
                                        : "hidden"
                                }
                            >
                                <div className="flex items-center gap-[13px] px-4 border-b border-b-dahsed">
                                    <button
                                        className={
                                            "px-2 py-4 h-auto bg-transparent text-primaryColor font-medium rounded-none " +
                                            (hotelSection === "category"
                                                ? "border-b border-b-orange-500"
                                                : "")
                                        }
                                        onClick={(e) => {
                                            handleHotelSectionChange(
                                                e,
                                                "category"
                                            );
                                        }}
                                    >
                                        Markup StarCategory
                                    </button>

                                    <button
                                        className={
                                            "px-2 py-4 h-auto bg-transparent text-primaryColor font-medium rounded-none " +
                                            (hotelSection === "hotel"
                                                ? "border-b border-b-orange-500"
                                                : "")
                                        }
                                        onClick={(e) => {
                                            handleHotelSectionChange(
                                                e,
                                                "hotel"
                                            );
                                        }}
                                    >
                                        Markup Hotel
                                    </button>
                                </div>{" "}
                                <div
                                    className={
                                        hotelSection === "category"
                                            ? "block pt-10"
                                            : "hidden"
                                    }
                                >
                                    {" "}
                                    <HotelStarCategoryTable />
                                </div>
                                {hotelSection === "hotel" && (
                                    <div
                                        className={
                                            section === "hotel"
                                                ? "block pt-10"
                                                : "hidden"
                                        }
                                    >
                                        {" "}
                                        <HotelRoomTypeTable />
                                    </div>
                                )}
                            </div>
                        )}
                        {section === "quotation" && (
                            <div
                                className={
                                    section === "quotation"
                                        ? "block pt-10"
                                        : "hidden"
                                }
                            >
                                {" "}
                                <QuotationProfileTable />
                            </div>
                        )}
                        {section === "flight" && (
                            <div
                                className={
                                    section === "flight"
                                        ? "block pt-10"
                                        : "hidden"
                                }
                            >
                                {" "}
                                <FlightProfileTable />
                            </div>
                        )}
                        {section === "insurance" && (
                            <div
                                className={
                                    section === "insurance"
                                        ? "block pt-10"
                                        : "hidden"
                                }
                            >
                                {" "}
                                <InsuranceProfileTable />
                            </div>
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
