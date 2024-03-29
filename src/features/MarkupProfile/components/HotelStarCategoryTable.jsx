import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "../../../axios";
import { PageLoader, Pagination } from "../../../components";
import AttractionProfileRow from "./AttractionProfileRow";
import HotelStarCategoryRow from "./HotelStarCategoryRow";
// import BookingsOrdersSingleRow from "./BookingsOrdersSingleRow";

export default function HotelStarCategoryTable({ type }) {
    const [isPageLoading, setIsPageLoading] = useState(false);

    const [categories, setCategories] = useState([]);
    const navigate = useNavigate();
    const { jwtToken } = useSelector((state) => state.admin);
    const { profileId, marketId } = useParams();
    const { id } = useParams();

    const fetchCategoryInitialData = async () => {
        try {
            setIsPageLoading(true);

            if (type === "market") {
                if (marketId) {
                    const response = await axios.get(
                        `/market/get-all-category/${marketId}`,
                        {
                            headers: { authorization: `Bearer ${jwtToken}` },
                        }
                    );

                    setCategories(response.data);
                } else {
                    const response = await axios.get(
                        `/market/b2b/get-all-category/${id}`,
                        {
                            headers: { authorization: `Bearer ${jwtToken}` },
                        }
                    );

                    setCategories(response.data);
                }
            } else {
                if (profileId) {
                    const response = await axios.get(
                        `/profile/get-all-category/${profileId}`,
                        {
                            headers: { authorization: `Bearer ${jwtToken}` },
                        }
                    );

                    setCategories(response.data);
                } else {
                    const response = await axios.get(
                        `/profile/b2b/get-all-category/${id}`,
                        {
                            headers: { authorization: `Bearer ${jwtToken}` },
                        }
                    );

                    setCategories(response.data);
                }
            }

            setIsPageLoading(false);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchCategoryInitialData();
    }, []);
    return (
        <div>
            <div className="overflow-x-auto ">
                {isPageLoading ? (
                    <PageLoader />
                ) : categories?.length < 1 ? (
                    <div className="p-6 flex flex-col items-center">
                        <span className="text-sm text-grayColor block mt-[6px]">
                            Oops.. No Categories found
                        </span>
                    </div>
                ) : (
                    <table className="w-full">
                        <thead className="bg-[#f3f6f9] text-grayColor text-[14px] text-left">
                            <tr>
                                <th className="font-[500] p-3">
                                    Star Category
                                </th>
                                <th className="font-[500] p-3">
                                    Markup Type(API)
                                </th>
                                <th className="font-[500] p-3">Markup (API)</th>
                                <th className="font-[500] p-3">Markup Type</th>
                                <th className="font-[500] p-3">Markup </th>

                                <th className="font-[500] p-3">Edit</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm ">
                            {categories?.map((category, index) => {
                                return (
                                    // <div>category</div>
                                    <HotelStarCategoryRow
                                        key={index}
                                        category={category}
                                        setCategories={setCategories}
                                        type={type}
                                    />
                                );
                            })}
                        </tbody>
                    </table>
                )}
            </div>

            {/* <div className="p-4">
                <Pagination
                    limit={filters?.limit}
                    skip={filters?.skip}
                    total={filters?.totalOrders}
                    incOrDecSkip={(number) =>
                        setFilters((prev) => {
                            return {
                                ...prev,
                                skip: prev.skip + number,
                            };
                        })
                    }
                    updateSkip={(skip) =>
                        setFilters((prev) => {
                            return { ...prev, skip };
                        })
                    }
                />
            </div> */}
        </div>
    );
}
