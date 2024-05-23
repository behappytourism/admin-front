import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";

import axios from "../../axios";
import { PageLoader } from "../../components";
import Pagination from "../../components/Pagination";
import { AttractionsTableSingleRow } from "../../features/Attractions";

export default function AttractionsListPage() {
    const [attractions, setAttractions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filters, setFilters] = useState({
        skip: 0,
        limit: 10,
        searchInput: "",
        totalAttractions: 0,
    });

    const [searchParams, setSearchParams] = useSearchParams();
    const { jwtToken } = useSelector((state) => state.admin);

    const prevSearchParams = (e) => {
        let params = {};
        for (let [key, value] of searchParams.entries()) {
            params[key] = value;
        }
        return params;
    };

    const fetchAttractions = async ({ skip, limit, searchInput }) => {
        try {
            setIsLoading(true);

            const response = await axios.get(
                `/attractions/all?skip=${skip}&limit=${limit}&search=${searchInput}`,
                {
                    headers: { Authorization: `Bearer ${jwtToken}` },
                }
            );

            setAttractions(response?.data?.attractions);
            setFilters((prev) => {
                return {
                    ...prev,
                    totalAttractions: response?.data?.totalAttractions,
                };
            });
            setIsLoading(false);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        let skip =
            Number(searchParams.get("skip")) > 0
                ? Number(searchParams.get("skip")) - 1
                : 0;
        let limit =
            Number(searchParams.get("limit")) > 0
                ? Number(searchParams.get("limit"))
                : 10;
        let searchInput = searchParams.get("search") || "";

        setFilters((prev) => {
            return { ...prev, skip, limit, searchInput };
        });
        fetchAttractions({ skip, limit, searchInput });
    }, [searchParams]);

    return (
        <div>
            <div className="bg-white flex items-center justify-between gap-[10px] px-6 shadow-sm border-t py-2">
                <h1 className="font-[600] text-[15px] uppercase">
                    Attractions
                </h1>
                <div className="text-sm text-grayColor">
                    <Link to="/" className="text-textColor">
                        Dashboard{" "}
                    </Link>
                    <span>{">"} </span>
                    <span>Attractions</span>
                </div>
            </div>
            <div className="p-6">
                <div className="bg-white rounded shadow-sm">
                    <div className="flex items-center justify-between border-b border-dashed p-4">
                        <h1 className="font-medium">All Attractions</h1>
                        <div className="flex items-center gap-[15px]">
                            <form
                                action=""
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    fetchAttractions({ ...filters });
                                    let params = prevSearchParams();
                                    setSearchParams({
                                        ...params,
                                        search: filters.searchInput,
                                        skip: 0,
                                    });
                                }}
                                className="flex items-center gap-[10px]"
                            >
                                <input
                                    type="text"
                                    placeholder="Search here..."
                                    value={filters.searchInput || ""}
                                    onChange={(e) =>
                                        setFilters((prev) => {
                                            return {
                                                ...prev,
                                                searchInput: e.target.value,
                                            };
                                        })
                                    }
                                />
                                <button className="px-5">Search</button>
                            </form>
                            <Link to={`add?q=${searchParams}`}>
                                <button className="w-[150px] bg-orange-500">
                                    + Add Attraction
                                </button>
                            </Link>
                        </div>
                    </div>
                    {isLoading ? (
                        <PageLoader />
                    ) : attractions?.length < 1 ? (
                        <div className="p-6 flex flex-col items-center">
                            <span className="text-sm  text-grayColor block mt-[6px]">
                                Oops.. No Attractions found
                            </span>
                        </div>
                    ) : (
                        <div>
                            <table className="w-full">
                                <thead className="bg-[#f3f6f9] text-grayColor text-[14px] text-left">
                                    <tr>
                                        <th className="font-[500] p-3">Code</th>
                                        <th className="font-[500] p-3">
                                            Title
                                        </th>
                                        <th className="font-[500] p-3">
                                            Booking Type
                                        </th>
                                        <th className="font-[500] p-3">
                                            Offer
                                        </th>
                                        <th className="font-[500] p-3">
                                            Destination
                                        </th>
                                        <th className="font-[500] p-3">
                                            Rating
                                        </th>
                                        <th className="font-[500] p-3">B2c</th>
                                        <th className="font-[500] p-3">B2b </th>

                                        {/* <th className="font-[500] p-3">
                                            B2C Markup
                                        </th> */}
                                        <th className="font-[500] p-3">
                                            Action
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm">
                                    {attractions?.map((attraction, index) => {
                                        return (
                                            <AttractionsTableSingleRow
                                                key={index}
                                                {...attraction}
                                                attractions={attractions}
                                                setAttractions={setAttractions}
                                            />
                                        );
                                    })}
                                </tbody>
                            </table>

                            <div className="p-4">
                                <Pagination
                                    limit={filters?.limit}
                                    skip={filters?.skip}
                                    total={filters?.totalAttractions}
                                    incOrDecSkip={(number) => {
                                        let params = prevSearchParams();
                                        setSearchParams({
                                            ...params,
                                            skip: filters.skip + number + 1,
                                        });
                                    }}
                                    updateSkip={(skip) => {
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
