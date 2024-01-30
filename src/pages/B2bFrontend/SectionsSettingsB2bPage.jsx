import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { MdDelete } from "react-icons/md";

import axios from "../../axios";
import { BtnLoader, PageLoader } from "../../components";
import { config } from "../../constants";

export default function SectionsSettingsB2bPage() {
    const [attractions, setAttractions] = useState([]);
    const [data, setData] = useState({
        isBestSellingAttractionsSectionEnabled: false,
        bestSellingAttractions: [],
        isTopAttractionsSectionEnabled: false,
        topAttractions: [],
        isBlogsEnabled: false,
    });
    const [selectedTopAttraction, setSelectedTopAttraction] = useState("");
    const [selectedBestAttraction, setSelectedBestAttraction] = useState("");
    const [isPageLoading, setIsPageLoading] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const { jwtToken } = useSelector((state) => state.admin);

    const fetchSectionSettings = async () => {
        try {
            setIsPageLoading(true);

            const response = await axios.get("/frontend/b2b/home/sections", {
                headers: { Authorization: `Bearer ${jwtToken}` },
            });

            setAttractions(response?.data?.attractions);
            setData({
                topAttractions: response?.data?.topAttractions,
                isBestSellingAttractionsSectionEnabled:
                    response.data?.isBestSellingAttractionsSectionEnabled,
                bestSellingAttractions: response?.data?.bestSellingAttractions,
                isTopAttractionsSectionEnabled:
                    response?.data?.isTopAttractionsSectionEnabled,
                isBlogsEnabled: response?.data?.isBlogsEnabled,
            });
            setIsPageLoading(false);
        } catch (err) {
            console.log(err);
        }
    };

    const addToTopAttractions = () => {
        if (selectedTopAttraction) {
            const objIndex = attractions.findIndex((attraction) => {
                return attraction?._id === selectedTopAttraction;
            });
            setData((prev) => {
                return {
                    ...prev,
                    topAttractions: [
                        ...prev.topAttractions,
                        attractions[objIndex],
                    ],
                };
            });
        }
    };

    const removeTopAttraction = (index) => {
        const filteredAttractions = data.topAttractions?.filter(
            (_, attrIndex) => {
                return attrIndex !== index;
            }
        );
        setData((prev) => {
            return { ...prev, topAttractions: filteredAttractions };
        });
    };

    const addToBestAttractions = () => {
        if (selectedBestAttraction) {
            const objIndex = attractions.findIndex((attraction) => {
                return attraction?._id === selectedBestAttraction;
            });
            setData((prev) => {
                return {
                    ...prev,
                    bestSellingAttractions: [
                        ...prev.bestSellingAttractions,
                        attractions[objIndex],
                    ],
                };
            });
        }
    };

    const removeBestAttraction = (index) => {
        const filteredAttractions = data.bestSellingAttractions?.filter(
            (_, attrIndex) => {
                return attrIndex !== index;
            }
        );
        setData((prev) => {
            return { ...prev, bestSellingAttractions: filteredAttractions };
        });
    };

    const handleSectionUpdate = async () => {
        try {
            setIsLoading(true);
            setError("");

            const topAttractions = data.topAttractions?.map((attraction) => {
                return attraction?._id;
            });
            const bestSellingAttractions = data.bestSellingAttractions?.map(
                (attraction) => {
                    return attraction?._id;
                }
            );
            await axios.patch(
                `/frontend/b2b/home/sections/update`,
                { ...data, bestSellingAttractions, topAttractions },
                {
                    headers: { Authorization: `Bearer ${jwtToken}` },
                }
            );
            setIsLoading(false);
        } catch (err) {
            setError(
                err?.response?.data?.error || "Something went wrong, Try again"
            );
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchSectionSettings();
    }, []);

    return (
        <div>
            <div className="bg-white flex items-center justify-between gap-[10px] px-6 shadow-sm border-t py-2">
                <h1 className="font-[600] text-[15px] uppercase">
                    Sections Setting
                </h1>
                <div className="text-sm text-grayColor">
                    <Link to="/" className="text-textColor">
                        Dashboard{" "}
                    </Link>
                    <span>{">"} </span>
                    <span>Home </span>
                    <span>{">"} </span>
                    <span>Settings </span>
                    <span>{">"} </span>
                    <span>Sections</span>
                </div>
            </div>

            {isPageLoading ? (
                <div>
                    <PageLoader />
                </div>
            ) : (
                <div className="p-6">
                    <div className="bg-white rounded p-6 shadow-sm">
                        <div className="flex items-center gap-[10px]">
                            <input
                                type="checkbox"
                                className="w-[16px] h-[16px]"
                                checked={
                                    data.isBestSellingAttractionsSectionEnabled ||
                                    false
                                }
                                onChange={(e) => {
                                    setData((prev) => {
                                        return {
                                            ...prev,
                                            isBestSellingAttractionsSectionEnabled:
                                                e.target.checked,
                                        };
                                    });
                                }}
                            />
                            <label htmlFor="" className="mb-0">
                                Show Best Selling Attractions
                            </label>
                        </div>

                        <div className="mt-4">
                            <label htmlFor="">Attraction</label>
                            <div className="flex max-w-[500px] items-center gap-[10px]">
                                <select
                                    name=""
                                    value={selectedBestAttraction}
                                    onChange={(e) =>
                                        setSelectedBestAttraction(
                                            e.target.value
                                        )
                                    }
                                    id=""
                                >
                                    <option value="" hidden>
                                        Select Attraction
                                    </option>
                                    {attractions?.map((attraction, index) => {
                                        return (
                                            <option
                                                value={attraction?._id}
                                                key={index}
                                            >
                                                {attraction?.title}
                                            </option>
                                        );
                                    })}
                                </select>
                                <button
                                    className="w-[200px]"
                                    onClick={addToBestAttractions}
                                >
                                    Add Attraction
                                </button>
                            </div>
                        </div>

                        <div className="mt-4">
                            <div className="flex gap-[20px] overflow-x-auto">
                                {data.bestSellingAttractions?.map(
                                    (attraction, index) => {
                                        return (
                                            <div
                                                key={index}
                                                className="w-[200px] min-w-[200px]"
                                            >
                                                <div className="group relative w-full aspect-video rounded overflow-hidden">
                                                    <img
                                                        src={
                                                            config.SERVER_URL +
                                                            attraction
                                                                ?.images[0]
                                                        }
                                                        alt=""
                                                        className="w-full h-full object-cover"
                                                    />
                                                    <div
                                                        className="hidden group-hover:flex absolute inset-0 items-center justify-center bg-[#0007] text-red-500 text-xl cursor-pointer transition-all"
                                                        onClick={() =>
                                                            removeBestAttraction(
                                                                index
                                                            )
                                                        }
                                                    >
                                                        <MdDelete />
                                                    </div>
                                                </div>
                                                <span className="block text-[15px] font-medium mt-1">
                                                    {attraction?.title}
                                                </span>
                                            </div>
                                        );
                                    }
                                )}
                            </div>
                        </div>

                        <div className="flex items-center gap-[10px] mt-6">
                            <input
                                type="checkbox"
                                className="w-[16px] h-[16px]"
                                checked={
                                    data.isTopAttractionsSectionEnabled || false
                                }
                                onChange={(e) =>
                                    setData((prev) => {
                                        return {
                                            ...prev,
                                            isTopAttractionsSectionEnabled:
                                                e.target.checked,
                                        };
                                    })
                                }
                            />
                            <label htmlFor="" className="mb-0">
                                Show Top Attractions
                            </label>
                        </div>
                        <div className="mt-4">
                            <label htmlFor="">Attraction</label>
                            <div className="flex max-w-[500px] items-center gap-[10px]">
                                <select
                                    name=""
                                    value={selectedTopAttraction}
                                    onChange={(e) =>
                                        setSelectedTopAttraction(e.target.value)
                                    }
                                    id=""
                                >
                                    <option value="" hidden>
                                        Select Attraction
                                    </option>
                                    {attractions?.map((attraction, index) => {
                                        return (
                                            <option
                                                value={attraction?._id}
                                                key={index}
                                            >
                                                {attraction?.title}
                                            </option>
                                        );
                                    })}
                                </select>
                                <button
                                    className="w-[200px]"
                                    onClick={addToTopAttractions}
                                >
                                    Add Attraction
                                </button>
                            </div>
                        </div>

                        <div className="mt-4">
                            <div className="flex gap-[20px] overflow-x-auto">
                                {data.topAttractions?.map(
                                    (attraction, index) => {
                                        return (
                                            <div
                                                key={index}
                                                className="w-[200px] min-w-[200px]"
                                            >
                                                <div className="group relative w-full aspect-video rounded overflow-hidden">
                                                    <img
                                                        src={
                                                            config.SERVER_URL +
                                                            attraction
                                                                ?.images[0]
                                                        }
                                                        alt=""
                                                        className="w-full h-full object-cover"
                                                    />
                                                    <div
                                                        className="hidden group-hover:flex absolute inset-0 items-center justify-center bg-[#0007] text-red-500 text-xl cursor-pointer transition-all"
                                                        onClick={() =>
                                                            removeTopAttraction(
                                                                index
                                                            )
                                                        }
                                                    >
                                                        <MdDelete />
                                                    </div>
                                                </div>
                                                <span className="block text-[15px] font-medium mt-1">
                                                    {attraction?.title}
                                                </span>
                                            </div>
                                        );
                                    }
                                )}
                            </div>
                        </div>

                        <div className="flex items-center gap-[10px] mt-6">
                            <input
                                type="checkbox"
                                className="w-[16px] h-[16px]"
                                checked={data.isBlogsEnabled || false}
                                onChange={(e) => {
                                    setData((prev) => {
                                        return {
                                            ...prev,
                                            isBlogsEnabled: e.target.checked,
                                        };
                                    });
                                }}
                            />
                            <label htmlFor="" className="mb-0">
                                Show Blogs
                            </label>
                        </div>

                        {error && (
                            <span className="text-sm block text-red-500 mt-2">
                                {error}
                            </span>
                        )}

                        <div className="mt-6 flex items-center justify-end">
                            <button
                                className="w-[140px]"
                                disabled={isLoading}
                                onClick={handleSectionUpdate}
                            >
                                {isLoading ? <BtnLoader /> : "Update Section"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
