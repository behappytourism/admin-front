import React, { useEffect, useState } from "react";
import { BiEditAlt } from "react-icons/bi";
import { BsEyeFill } from "react-icons/bs";
import { MdDelete } from "react-icons/md";
import { useSelector } from "react-redux";
import { Link, useSearchParams } from "react-router-dom";
import axios from "../../axios";
import { PageLoader, Pagination } from "../../components";

export default function SeoMainCategoryPage() {
    const [isLoading, setIsLoading] = useState(true);
    const [categories, setCategories] = useState([]);
    const [filters, setFilters] = useState({
        skip: 0,
        limit: 10,
        totalCategories: 0,
        searchQuery: "",
    });

    const { jwtToken } = useSelector((state) => state.admin);

    const fetchMainCategory = async () => {
        try {
            setIsLoading(true);

            const response = await axios.get(
                `/seo/main-categories/?skip=${filters.skip}&limit=${filters.limit}&searchQuery=${filters.searchQuery}`,
                {
                    headers: { authorization: `Bearer ${jwtToken}` },
                }
            );

            setCategories(response?.data);
            setFilters((prev) => {
                return {
                    ...prev,
                    totalAirports: response?.data?.totalAirports,
                };
            });
            setIsLoading(false);
        } catch (err) {
            console.log(err);
        }
    };

    const deleteAirport = async (id) => {
        try {
            const isConfirm = window.confirm("Are you sure to delete?");
            if (isConfirm) {
                await axios.delete(`/airports/delete/${id}`, {
                    headers: { authorization: `Bearer ${jwtToken}` },
                });

                const filteredAirports = categories.filter((airport) => {
                    return category?._id !== id;
                });
                setCategories(filteredAirports);
            }
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchMainCategory();
    }, [filters.skip, filters.limit]);

    return (
        <div>
            <div className="bg-white flex items-center justify-between gap-[10px] px-6 shadow-sm border-t py-2">
                <h1 className="font-[600] text-[15px] uppercase">
                    Seo Category
                </h1>
                <div className="text-sm text-grayColor">
                    <Link to="/" className="text-textColor">
                        Dashboard{" "}
                    </Link>
                    <span>{">"} </span>
                    <span>Seo Category</span>
                </div>
            </div>

            <div className="p-6">
                <div className="bg-white rounded shadow-sm">
                    <div className="flex items-center justify-between border-b border-dashed p-4">
                        <h1 className="font-medium">Seo Category</h1>
                        <div className="flex items-center gap-3">
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    if (filters?.skip !== 0) {
                                        setFilters((prev) => {
                                            return {
                                                ...prev,
                                                skip: 0,
                                            };
                                        });
                                    } else {
                                        fetchMainCategory();
                                    }
                                }}
                                className="flex items-center gap-3"
                            >
                                <input
                                    type="text"
                                    placeholder="Search here..."
                                    onChange={(e) => {
                                        setFilters((prev) => {
                                            return {
                                                ...prev,
                                                searchQuery: e.target.value,
                                            };
                                        });
                                    }}
                                    value={filters.searchQuery || ""}
                                />
                                <button
                                    type="submit"
                                    className="px-3 bg-primaryColor"
                                >
                                    Search
                                </button>
                            </form>
                            {/* <Link to="add">
                                <button className="px-3">+ Add Airport</button>
                            </Link> */}
                        </div>
                    </div>
                    {isLoading ? (
                        <PageLoader />
                    ) : categories?.length < 1 ? (
                        <div className="p-6 flex flex-col items-center">
                            <span className="text-sm text-grayColor block mt-[6px]">
                                Oops.. No Category Found
                            </span>
                        </div>
                    ) : (
                        <div>
                            <table className="w-full">
                                <thead className="bg-[#f3f6f9] text-grayColor text-[14px] text-left">
                                    <tr>
                                        <th className="font-[500] p-3">
                                            Category
                                        </th>

                                        <th className="font-[500] p-3">
                                            Action
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm">
                                    {categories?.map((category, index) => {
                                        return (
                                            <tr
                                                key={index}
                                                className="border-b border-tableBorderColor"
                                            >
                                                <td className="p-3">
                                                    <span className="block">
                                                        {category?.name}
                                                    </span>
                                                </td>

                                                <td className="p-3">
                                                    <div className="flex gap-[10px]">
                                                        <Link
                                                            to={`${category?.seoType}/category`}
                                                        >
                                                            <button className="h-auto bg-transparent text-green-500 text-xl">
                                                                <BsEyeFill />
                                                            </button>
                                                        </Link>

                                                        {/* <Link
                                                            to={`${category?.seoType}`}
                                                        >
                                                            <button className="h-auto bg-transparent text-green-500 text-xl">
                                                                <BiEditAlt />
                                                            </button>
                                                        </Link> */}
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
