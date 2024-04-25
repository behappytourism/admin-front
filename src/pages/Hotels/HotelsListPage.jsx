import React, { useEffect, useState } from "react";
import { MdDelete } from "react-icons/md";
import { BiEditAlt, BiFilter } from "react-icons/bi";
import { Link, useSearchParams } from "react-router-dom";
import { AiFillEye, AiFillStar, AiOutlineSetting } from "react-icons/ai";
import { useSelector } from "react-redux";

import { PageLoader, Pagination } from "../../components";
import axios from "../../axios";
import { formatDate, hasPermission } from "../../utils";
import { FaDownload } from "react-icons/fa";
import { FiDownload } from "react-icons/fi";

function HotelsListPage() {
    const [hotels, setHotels] = useState({});
    const [filters, setFilters] = useState({
        skip: 0,
        limit: 10,
        totalHotels: 0,
        searchInput: "",
        loadedFrom: "",
        status: "",
        starCategory: "",
        country: "",
    });
    const [isLoading, setIsLoading] = useState(true);

    const [searchParams, setSearchParams] = useSearchParams();
    const { jwtToken, admin } = useSelector((state) => state.admin);
    const { countries } = useSelector((state) => state.general);

    const isDeletePermission = hasPermission({
        roles: admin?.roles,
        name: "hotels",
        permission: "delete",
    });

    const prevSearchParams = (e) => {
        let params = {};
        for (let [key, value] of searchParams.entries()) {
            params[key] = value;
        }
        return params;
    };

    const handleChange = (e) => {
        setFilters((prev) => {
            return { ...prev, [e.target.name]: e.target.value };
        });
    };

    const handleHotelsListExcelDownload = async () => {
        try {
            const response = await axios.get(
                `hotels/all/excel?skip=${filters.skip}&limit=${filters.limit}&search=${filters.searchInput}&loadedFrom=${filters.loadedFrom}&status=${filters.status}&starCategory=${filters.starCategory}&country=${filters.country}`,
                {
                    headers: { Authorization: `Bearer ${jwtToken}` },
                    responseType: "blob",
                }
            );

            const href = URL.createObjectURL(response.data);

            const link = document.createElement("a");
            link.href = href;
            link.setAttribute("download", "hotels-list.xlsx");
            document.body.appendChild(link);
            link.click();

            document.body.removeChild(link);
            URL.revokeObjectURL(href);
        } catch (err) {
            console.log(err);
        }
    };

    const fetchHotels = async ({ skip, limit, searchInput, status, loadedFrom, starCategory, country }) => {
        try {
            setIsLoading(true);

            const response = await axios.get(
                `/hotels/all?skip=${skip}&limit=${limit}&search=${searchInput}&loadedFrom=${loadedFrom}&status=${status}&starCategory=${starCategory}&country=${country}`,
                {
                    headers: { Authorization: `Bearer ${jwtToken}` },
                }
            );

            setHotels(response?.data?.hotels);
            setFilters((prev) => {
                return { ...prev, totalHotels: response?.data?.totalHotels };
            });
            setIsLoading(false);
        } catch (err) {
            console.log(err);
        }
    };

    const deleteHotel = async (id) => {
        try {
            const isConfirm = window.confirm("Are you sure to delete?");
            if (isConfirm) {
                await axios.delete(`/hotels/delete/${id}`, {
                    headers: { Authorization: `Bearer ${jwtToken}` },
                });

                const filteredHotels = hotels?.filter((item) => {
                    return item?._id !== id;
                });
                setHotels(filteredHotels);
            }
        } catch (err) {
            console.log(err);
        }
    };

    const handleContractsDownload = async (hotelId, hotelName) => {
        try {
            const response = await axios.get(`/hotels/contracts/download/xlsx/${hotelId}`, {
                headers: { Authorization: `Bearer ${jwtToken}` },
                responseType: "blob",
            });

            const href = URL.createObjectURL(response.data);

            const link = document.createElement("a");
            link.href = href;
            link.setAttribute("download", `${hotelName || "hotel"}.xlsx`);
            document.body.appendChild(link);
            link.click();

            document.body.removeChild(link);
            URL.revokeObjectURL(href);
        } catch (err) {
            console.log(err);
        }
    };

    const clearFilters = () => {
        setFilters({
            skip: 0,
            limit: 10,
            totalHotels: 0,
            searchInput: "",
            loadedFrom: "",
            status: "",
            starCategory: "",
            country: "",
        });

        fetchHotels({
            skip: 0,
            limit: 10,
            totalHotels: 0,
            searchInput: "",
            loadedFrom: "",
            status: "",
            starCategory: "",
            country: "",
        });
        let params = prevSearchParams();
        setSearchParams({
            ...params,
            search: "",
            status: "",
            loadedFrom: "",
            limit: 10,
            skip: 0,
            starCategory: "",
            country: "",
        });
    };

    useEffect(() => {
        let skip = Number(searchParams.get("skip")) > 0 ? Number(searchParams.get("skip")) - 1 : 0;
        let limit = Number(searchParams.get("limit")) > 0 ? Number(searchParams.get("limit")) : 10;
        let searchInput = searchParams.get("search") || "";
        let status = searchParams.get("status") || "";
        let loadedFrom = searchParams.get("loadedFrom") || "";
        let starCategory = searchParams.get("starCategory") || "";
        let country = searchParams.get("country") || "";

        setFilters((prev) => {
            return { ...prev, skip, limit, searchInput, status, loadedFrom, starCategory, country };
        });

        fetchHotels({ skip, limit, searchInput, status, loadedFrom, starCategory, country });
    }, []);

    return (
        <div>
            <div className="bg-white flex items-center justify-between gap-[10px] px-6 shadow-sm border-t py-2">
                <h1 className="font-[600] text-[15px] uppercase">Hotels</h1>
                <div className="text-sm text-grayColor">
                    <Link to="/" className="text-textColor">
                        Dashboard{" "}
                    </Link>
                    <span>{">"} </span>
                    <span>Hotels</span>
                </div>
            </div>

            <div className="p-6">
                <div className="bg-white rounded shadow-sm">
                    <div className="flex items-center justify-between border-b border-dashed p-4">
                        <h1 className="font-medium">All Hotels</h1>
                        {/* <div className="flex items-center gap-[15px]">
                            <Link to="add">
                                <button className="px-3 whitespace-nowrap bg-orange-500">+ Add Hotel</button>
                            </Link>
                            <button
                                className="px-3 flex items-center gap-1"
                                onClick={handleHotelsListExcelDownload}
                            >
                                <FiDownload />
                                Download
                            </button>
                        </div> */}
                    </div>

                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            setFilters((prev) => {
                                return {
                                    ...prev,
                                    skip: 0,
                                };
                            });
                            fetchHotels({ ...filters, skip: 0 });
                            let params = prevSearchParams();
                            setSearchParams({
                                ...params,
                                search: filters.searchInput,
                                status: filters.status,
                                loadedFrom: filters.loadedFrom,
                                limit: filters.limit,
                                skip: 0,
                                starCategory: filters.starCategory,
                                country: filters.country,
                            });
                        }}
                        className="grid grid-cols-7 items-end gap-4 border-b border-dashed p-4"
                    >
                        <div className="col-span-2">
                            <label htmlFor="">Search</label>
                            <input
                                type="text"
                                placeholder="Search here..."
                                name="searchInput"
                                value={filters.searchInput || ""}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label htmlFor="">Star Category</label>
                            <select
                                id=""
                                name="starCategory"
                                value={filters.starCategory}
                                onChange={handleChange}
                            >
                                <option value="">All</option>
                                <option value="1">1 Star</option>
                                <option value="2">2 Star</option>
                                <option value="3">3 Star</option>
                                <option value="4">4 Star</option>
                                <option value="5">5 Star</option>
                                <option value="apartment">Apartment</option>
                                <option value="hostel">Hostel</option>
                                <option value="unrated">Unrated</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="">Hotel Loaded From</label>
                            <select
                                id=""
                                name="loadedFrom"
                                value={filters.loadedFrom || ""}
                                onChange={handleChange}
                            >
                                <option value="">All</option>
                                <option value="contract">Contract</option>
                                <option value="hotel-bed">Hotel Bed</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="">Country</label>
                            <select
                                id=""
                                name="country"
                                value={filters.country}
                                onChange={handleChange}
                                className="capitalize"
                            >
                                <option value="">All</option>
                                {countries?.map((country, cIndex) => {
                                    return (
                                        <option value={country?._id} key={cIndex} className="capitalize">
                                            {country?.countryName}
                                        </option>
                                    );
                                })}
                            </select>
                        </div>
                        <div className="">
                            <label htmlFor="">Status</label>
                            <select id="" name="status" value={filters.status || ""} onChange={handleChange}>
                                <option value="">All</option>
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                                <option value="published">Published</option>
                                <option value="unpublished">Unpublished</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="">Limit</label>
                            <select id="" name="limit" value={filters.limit} onChange={handleChange}>
                                <option value="10">10</option>
                                <option value="50">50</option>
                                <option value="100">100</option>
                                <option value="500">500</option>
                                <option value="1000">1000</option>
                                <option value="1000000">All</option>
                            </select>
                        </div>
                        <button className="flex items-center justify-center gap-[10px]">
                            <BiFilter /> Filter
                        </button>
                        <button className="bg-slate-200 text-textColor" onClick={clearFilters} type="button">
                            Clear
                        </button>
                    </form>

                    {isLoading ? (
                        <PageLoader />
                    ) : hotels?.length < 1 ? (
                        <div className="p-6 flex flex-col items-center">
                            <span className="text-sm text-grayColor block mt-[6px]">
                                Oops.. No Hotels found
                            </span>
                        </div>
                    ) : (
                        <div>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-[#f3f6f9] text-grayColor text-[14px] text-left">
                                        <tr>
                                            <th className="font-[500] p-3">Hotel</th>
                                            <th className="font-[500] p-3">City</th>
                                            <th className="font-[500] p-3">Emirate</th>
                                            <th className="font-[500] p-3">Star Category</th>
                                            <th className="font-[500] p-3">Status</th>
                                            <th className="font-[500] p-3">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-sm">
                                        {hotels?.map((hotel, index) => {
                                            return (
                                                <tr className="border-b border-tableBorderColor" key={index}>
                                                    <td className="p-3">
                                                        {hotel?.hotelName}{" "}
                                                        <span className="text-red-500">
                                                            {hotel?.isPublished === false &&
                                                                `- (Not Published)`}
                                                        </span>
                                                        <span className="block text-[13px] text-grayColor mt-[3px]">
                                                            Last updated at -{" "}
                                                            {formatDate(hotel?.updatedAt, true)}
                                                        </span>
                                                    </td>
                                                    <td className="p-3 capitalize whitespace-nowrap">
                                                        {hotel?.city?.cityName || "N/A"}
                                                    </td>
                                                    <td className="p-3 capitalize">
                                                        {hotel?.state?.stateName},{" "}
                                                        {hotel?.country?.countryName}
                                                    </td>
                                                    <td className="p-3 capitalize">
                                                        {hotel?.starCategory ? (
                                                            !isNaN(hotel?.starCategory) ? (
                                                                <div className="flex gap-[4px] items-center">
                                                                    <span className="">
                                                                        {hotel?.starCategory}
                                                                    </span>
                                                                    <span className="text-lg text-yellow-500">
                                                                        <AiFillStar />{" "}
                                                                    </span>
                                                                </div>
                                                            ) : (
                                                                hotel?.starCategory
                                                            )
                                                        ) : (
                                                            "N/A"
                                                        )}
                                                    </td>
                                                    <td className="p-3">
                                                        <div className="flex items-center gap-[10px]">
                                                            <span
                                                                className={
                                                                    "block w-[10px] h-[10px] min-w-[10px] min-h-[10px] rounded-full " +
                                                                    (hotel?.isActive === true
                                                                        ? "bg-green-500"
                                                                        : "bg-red-500")
                                                                }
                                                            ></span>
                                                            {hotel?.isActive === true ? "Active" : "Inactive"}
                                                        </div>
                                                    </td>
                                                    {/* <td className="p-3">
                                                        <div className="flex gap-[10px]">
                                                            <button
                                                                className="h-auto bg-transparent font-[500] underline text-blue-500 flex items-center justify-center gap-1"
                                                                onClick={() =>
                                                                    handleContractsDownload(
                                                                        hotel?._id
                                                                    )
                                                                }
                                                            >
                                                                <FiDownload />
                                                                Download
                                                            </button>
                                                            <Link to={`${hotel?._id}/contracts`}>
                                                                <button className="h-auto bg-transparent text-blue-500 text-xl flex items-center justify-center">
                                                                    <AiFillEye />
                                                                </button>
                                                            </Link>
                                                        </div>
                                                    </td> */}
                                                    <td className="p-3">
                                                        <div className="flex gap-[10px]">
                                                            {isDeletePermission && (
                                                                <button
                                                                    className="h-auto bg-transparent text-red-500 text-xl flex items-center justify-center"
                                                                    onClick={() => deleteHotel(hotel?._id)}
                                                                    title="Delete Hotel"
                                                                >
                                                                    <MdDelete />
                                                                </button>
                                                            )}

                                                            {/* <Link to={`${hotel?._id}/room-types`}>
                                                                <button
                                                                    className="h-auto bg-transparent text-green-500 text-xl flex items-center justify-center"
                                                                    title="Hotel Settings"
                                                                >
                                                                    <AiOutlineSetting />
                                                                </button>
                                                            </Link> */}
                                                            <Link to={`${hotel?._id}/edit`}>
                                                                <button
                                                                    className="h-auto bg-transparent text-green-500 text-xl flex items-center justify-center"
                                                                    title="Edit Hotel Details"
                                                                >
                                                                    <BiEditAlt />
                                                                </button>
                                                            </Link>
                                                            {/* <button
                                                                className="h-auto bg-transparent font-[500] text-xl underline text-blue-500 flex items-center justify-center gap-1"
                                                                onClick={() =>
                                                                    handleContractsDownload(
                                                                        hotel?._id,
                                                                        hotel?.hotelName
                                                                    )
                                                                }
                                                                title="Download Contracts And Promotions"
                                                            >
                                                                <FiDownload />
                                                            </button> */}
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>

                            <div className="p-4">
                                <Pagination
                                    limit={filters?.limit}
                                    skip={filters?.skip}
                                    total={filters?.totalHotels}
                                    incOrDecSkip={(number) => {
                                        setFilters((prev) => {
                                            return {
                                                ...prev,
                                                skip: prev.skip + number,
                                            };
                                        });
                                        fetchHotels({ ...filters, skip: filters.skip + number });
                                        let params = prevSearchParams();
                                        setSearchParams({
                                            ...params,
                                            skip: filters.skip + number + 1,
                                        });
                                    }}
                                    updateSkip={(skip) => {
                                        setFilters((prev) => {
                                            return {
                                                ...prev,
                                                skip: skip,
                                            };
                                        });
                                        fetchHotels({ ...filters, skip: skip });
                                        let params = prevSearchParams();
                                        setSearchParams({
                                            ...params,
                                            skip: skip + 1,
                                        });
                                    }}
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default HotelsListPage;
