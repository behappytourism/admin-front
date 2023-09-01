import React, { useEffect } from "react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { Link, useSearchParams } from "react-router-dom";
import { PageLoader, Pagination } from "../../components";
import { A2AIndexTable, AddA2AModal } from "../../features/A2A";
import axios from "../../axios";
import { MdDelete } from "react-icons/md";
import { BiEditAlt } from "react-icons/bi";

export default function InsuranceListingPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState([]);
    const [isAddA2AModalOpen, setIsAddA2AModalOpen] = useState(false);
    const [airports, setAirports] = useState([]);
    const [filters, setFilters] = useState({
        skip: 0,
        limit: 10,
        searchQuery: "",
        totalPlans: 0,
        category: "SG",
    });
    const [plans, setPlans] = useState([]);
    const { jwtToken } = useSelector((state) => state.admin);
    const [searchParams, setSearchParams] = useSearchParams();

    const prevSearchParams = (e) => {
        let params = {};
        for (let [key, value] of searchParams.entries()) {
            params[key] = value;
        }
        return params;
    };

    const fetchInsurance = async ({ skip, limit, searchQuery, category }) => {
        try {
            setIsLoading(true);

            const response = await axios.get(
                `/insurance/list/all/?category=${category}&skip=${skip}&limit=${limit}&searchQuery=${searchQuery}`,
                {
                    headers: { authorization: `Bearer ${jwtToken}` },
                }
            );

            console.log(response.data, "response");

            setPlans(response?.data?.plans);
            setFilters((prev) => {
                return {
                    ...prev,
                    totalPlans: response.data?.totalPlans,
                };
            });
            setIsLoading(false);
        } catch (err) {
            console.log(err);
            setPlans([]);
            setIsLoading(false);
        }
    };

    console.log(plans, "plans");

    useEffect(() => {
        let skip =
            Number(searchParams.get("skip")) > 0
                ? Number(searchParams.get("skip")) - 1
                : 0;
        let limit =
            Number(searchParams.get("limit")) > 0
                ? Number(searchParams.get("limit"))
                : 10;
        let searchQuery = searchParams.get("searchQuery") || "";
        let category = searchParams.get("category") || "SG";
        setFilters((prev) => {
            return { ...prev, skip, limit, searchQuery, category };
        });
        fetchInsurance({ skip, limit, searchQuery, category });
    }, [searchParams]);

    console.log(plans, "plans");

    return (
        <div>
            <div className="bg-white flex items-center justify-between gap-[10px] px-6 shadow-sm border-t py-2">
                <h1 className="font-[600] text-[15px] uppercase">
                    Insurance Plans
                </h1>
                <div className="text-sm text-grayColor">
                    <Link to="/" className="text-textColor">
                        Dashboard{" "}
                    </Link>
                    <span>{">"} </span>
                    <span>Insurance Plans</span>
                </div>
            </div>
            <div className="p-6">
                <div className="bg-white rounded shadow-sm">
                    <div className="flex items-center justify-between border-b border-dashed p-4">
                        <h1 className="font-medium">All Insurance Plans</h1>
                        <div className="flex items-center gap-[15px]">
                            <form
                                action=""
                                // onSubmit={(e) => {
                                //     e.preventDefault();
                                //     fetchA2A({ ...filters });
                                //     let params = prevSearchParams();
                                //     setSearchParams({
                                //         ...params,
                                //         search: filters.searchInput,
                                //         skip: 0,
                                //     });
                                // }}
                                className="flex items-center gap-[10px]"
                            >
                                {/* <input
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
                                /> */}
                                <div>
                                    {/* <label htmlFor="">Type</label> */}
                                    <select
                                        name="bookingType"
                                        value={filters.category || ""}
                                        onChange={(e) => {
                                            setSearchParams((prev) => {
                                                return {
                                                    ...prev,
                                                    category: e.target.value,
                                                };
                                            });
                                        }}
                                    >
                                        <option value="SG">Single</option>
                                        <option value="FM">Family</option>
                                    </select>
                                </div>
                                {/* <button className="px-5">Search</button> */}
                            </form>
                            {/* <div>
                                <Link to={`add`}>
                                    <button
                                        className="w-[160px] bg-orange-500"
                                        // onClick={() => setIsAddA2AModalOpen(true)}
                                    >
                                        + Add A2A
                                    </button>
                                </Link>
                                {isAddA2AModalOpen && (
                                    <AddA2AModal
                                        setIsAddA2AModalOpen={
                                            setIsAddA2AModalOpen
                                        }
                                        isAddA2AModalOpen={isAddA2AModalOpen}
                                        airports={airports}
                                        result={result}
                                        setResult={setResult}
                                    />
                                )}
                            </div> */}
                        </div>
                    </div>
                    {isLoading ? (
                        <PageLoader />
                    ) : plans?.length < 1 ? (
                        <div className="p-6 flex flex-col items-center">
                            <span className="text-sm  text-grayColor block mt-[6px]">
                                Oops.. No Enquiries found
                            </span>
                        </div>
                    ) : (
                        <div>
                            <table className="w-full">
                                <thead className="bg-[#f3f6f9] text-grayColor text-[14px] text-left">
                                    <tr>
                                        <th className="font-[500] p-3">
                                            Index
                                        </th>
                                        <th className="font-[500] p-3">Name</th>
                                        <th className="font-[500] p-3">Type</th>
                                        <th className="font-[500] p-3">
                                            Category
                                        </th>
                                        <th className="font-[500] p-3">
                                            Price
                                        </th>
                                        {/* <th className="font-[500] p-3">
                                            Action
                                        </th> */}
                                    </tr>
                                </thead>
                                <tbody className="text-sm">
                                    {plans?.map((plan, index) => {
                                        console.log(plan, index);
                                        return (
                                            <tr className="border-b border-tableBorderColor">
                                                <td className="p-3">
                                                    {index + 1}
                                                </td>
                                                <td className="p-3 capitalize">
                                                    {plan.name}
                                                </td>
                                                <td className="p-3">
                                                    {plan.type}
                                                </td>
                                                <td className="p-3">
                                                    {plan.category}
                                                </td>
                                                <td className="p-3">
                                                    {plan.price}
                                                </td>
                                                {/* <td className="p-3">
                                                    <div className="flex items-center gap-[10px]">
                                                        <button
                                                            className="h-auto bg-transparent text-red-500 text-xl"
                                                            // onClick={() =>
                                                            //     deleteA2A(
                                                            //         plan?._id
                                                            //     )
                                                            // }
                                                        >
                                                            <MdDelete />
                                                        </button>
                                                        <Link
                                                            to={`/a2a/${plan?._id}`}
                                                        >
                                                            <button className="h-auto bg-transparent text-green-500 text-xl">
                                                                <BiEditAlt />
                                                            </button>
                                                        </Link>
                                                    </div>
                                                </td> */}
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>

                            {/* <div className="p-4">
                                <Pagination
                                    limit={filters?.limit}
                                    skip={filters?.skip}
                                    total={filters?.totalA2aList}
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
                            </div> */}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
