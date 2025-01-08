import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { PageLoader } from "../../components";
import axios from "../../axios";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Pagination, BtnLoader } from "../../components";
import StandAloneTableList from "./StandAloneTableList";
import { useSearchParams } from "react-router-dom";
import { clearAttractionStandAloneDataAfterAdding } from "../../redux/slices/attrStandAloneSlice";

function StandAloneList() {
    const dispatch = useDispatch();

    const [standAlone, setStandAlone] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const { jwtToken } = useSelector((state) => state.admin);
    const [filters, setFilters] = useState({
        limit: 10,
        skip: 0,
        totalStandAlone: 0,
        searchInput: "",
    });
    const [searchParams, setSearchParams] = useSearchParams();
    const prevSearchParams = (e) => {
        let params = {};
        for (let [key, value] of searchParams.entries()) {
            params[key] = value;
        }
        return params;
    };
    const [isPageLoading, setIsPageLoading] = useState(false);

    const navigate = useNavigate();

    const fetchAllDetails = async ({ skip, limit, searchInput }) => {
        try {
            setIsPageLoading(true);
            const res = await axios.get(
                `/attractions/standalone/all?=skip=${skip}&limit=${limit}&search=${searchInput}`,
                {
                    headers: { Authorization: `Bearer ${jwtToken}` },
                }
            );
            setFilters({
                ...filters,
                totalStandAlone: res?.data?.totalStandAlone,
            });
            setStandAlone(res?.data?.attractionStandAlone);
            setIsPageLoading(false);
        } catch (error) {
            setIsPageLoading(false);

            console.log(error);
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
        fetchAllDetails({ skip, limit, searchInput });
    }, [searchParams]);

    useEffect(() => {
        dispatch(clearAttractionStandAloneDataAfterAdding());
    }, []);

    return (
        <div>
            <div className="bg-white flex items-center justify-between gap-[10px] px-6 shadow-sm border-t py-2">
                <div>
                    <h1 className="font-[600] text-[15px] uppercase">
                        Attraction Stand Alone
                    </h1>
                </div>
                <div>
                    <div className="text-sm text-grayColor">
                        <Link to="/" className="text-textColor">
                            Dashboard{" "}
                        </Link>
                        <span>{">"} </span>
                        <Link to="/attractions" className="text-textColor">
                            Attractions
                        </Link>
                        <span>{">"} </span>
                        <span>StandAlone </span>
                        <span>{">"} </span>
                        <span>List</span>
                    </div>
                </div>
            </div>
            {isPageLoading ? (
                <PageLoader />
            ) : (
                <div className="p-6 ">
                    <div className="bg-white rounded shadow-sm">
                        <div className="flex items-center justify-between border-b border-dashed p-4">
                            <h1 className="font-medium">
                                All Attractions Stand Alone
                            </h1>
                            <div className="flex items-center gap-[15px]">
                                <form
                                    action=""
                                    onSubmit={(e) => {
                                        e.preventDefault();
                                        fetchAllDetails({ ...filters });
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
                                <button
                                    className="w-[150px] bg-orange-500"
                                    onClick={() => {
                                        navigate("/addStandalone");
                                    }}
                                >
                                    + Add StandAlone
                                </button>
                            </div>
                        </div>
                        {isLoading ? (
                            <PageLoader />
                        ) : standAlone?.length < 1 ? (
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
                                            <th className="font-[500] p-3">
                                                Title
                                            </th>
                                            <th className="font-[500] p-3">
                                                slug
                                            </th>
                                            <th className="font-[500] p-3">
                                                Attraction's
                                            </th>
                                            <th className="font-[500] p-3">
                                                images
                                            </th>
                                            <th className="font-[500] p-3">
                                                Action
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-sm">
                                        {standAlone?.map((ele) => {
                                            return (
                                                <StandAloneTableList
                                                    ele={ele}
                                                    fetchAllDetails={
                                                        fetchAllDetails
                                                    }
                                                />
                                            );
                                        })}
                                    </tbody>
                                </table>

                                <div className="p-4">
                                    <Pagination
                                        limit={filters?.limit}
                                        skip={filters?.skip}
                                        total={filters?.totalStandAlone}
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
            )}
        </div>
    );
}

export default StandAloneList;
