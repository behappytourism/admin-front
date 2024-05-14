import React, { useEffect, useState } from "react";
import { BiEditAlt } from "react-icons/bi";
import { MdDelete } from "react-icons/md";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import axios from "../../axios";
import { PageLoader, Pagination } from "../../components";
import { config } from "../../constants";

export default function PromoCodeListPage() {
    const [promoCodes, setPromoCodes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filters, setFilters] = useState({
        skip: 0,
        limit: 10,
        totalAirlines: 0,
        searchQuery: "",
    });
    const [section, setSection] = useState("b2b");

    const { jwtToken } = useSelector((state) => state.admin);

    const fetchpromoCodes = async () => {
        try {
            setIsLoading(true);
            const response = await axios.get(
                `/promo-code/all?skip=${filters.skip}&limit=${filters.limit}&searchQuery=${filters.searchQuery}&section=${section}`,
                {
                    headers: { authorization: `Bearer ${jwtToken}` },
                }
            );

            setPromoCodes(response?.data);

            setIsLoading(false);
        } catch (err) {
            console.log(err);
        }
    };
    const handleSectionChange = (e, value) => {
        e.preventDefault();
        setSection(value);
    };

    const deleteAirline = async (id) => {
        try {
            const isConfirm = window.confirm("Are you sure to delete?");
            if (isConfirm) {
                await axios.delete(`/promo-code/delete/${id}/${section}`, {
                    headers: { authorization: `Bearer ${jwtToken}` },
                });

                const filtered = promoCodes.filter((promoCode) => {
                    return promoCode?._id !== id;
                });
                setPromoCodes(filtered);
            }
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchpromoCodes();
    }, [section]);

    return (
        <div>
            <div className="bg-white flex items-center justify-between gap-[10px] px-6 shadow-sm border-t py-2">
                <h1 className="font-[600] text-[15px] uppercase">
                    Promo Codes
                </h1>
                <div className="text-sm text-grayColor">
                    <Link to="/" className="text-textColor">
                        Dashboard{" "}
                    </Link>
                    <span>{">"} </span>
                    <span>Promo Codes</span>
                </div>
            </div>

            <div className="p-6">
                <div className="bg-white rounded shadow-sm">
                    <div className="flex items-center justify-between border-b border-dashed p-4">
                        <h1 className="font-medium">All Promo Codes</h1>
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
                                        fetchpromoCodes();
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
                            <Link to={`add/${section}`}>
                                <button className="px-3">+ Add New</button>
                            </Link>
                        </div>
                    </div>
                    <div className="flex items-center gap-[13px] px-4 border-b border-b-dahsed">
                        <button
                            className={
                                "px-2 py-4 h-auto bg-transparent text-primaryColor font-medium rounded-none " +
                                (section === "b2b"
                                    ? "border-b border-b-orange-500"
                                    : "")
                            }
                            onClick={(e) => {
                                handleSectionChange(e, "b2b");
                            }}
                        >
                            B2B
                        </button>

                        <button
                            className={
                                "px-2 py-4 h-auto bg-transparent text-primaryColor font-medium rounded-none " +
                                (section === "b2c"
                                    ? "border-b border-b-orange-500"
                                    : "")
                            }
                            onClick={(e) => {
                                handleSectionChange(e, "b2c");
                            }}
                        >
                            B2C
                        </button>
                    </div>
                    {isLoading ? (
                        <PageLoader />
                    ) : promoCodes?.length < 1 ? (
                        <div className="p-6 flex flex-col items-center">
                            <span className="text-sm text-grayColor block mt-[6px]">
                                Oops.. No PromoCode Found
                            </span>
                        </div>
                    ) : (
                        <div>
                            <table className="w-full">
                                <thead className="bg-[#f3f6f9] text-grayColor text-[14px] text-left">
                                    <tr>
                                        <th className="font-[500] p-3">
                                            Promo Code
                                        </th>
                                        <th className="font-[500] p-3">Type</th>
                                        <th className="font-[500] p-3">
                                            Value
                                        </th>
                                        <th className="font-[500] p-3">
                                            Min Pur
                                        </th>
                                        <th className="font-[500] p-3">
                                            Max Dis
                                        </th>{" "}
                                        <th className="font-[500] p-3"></th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm">
                                    {promoCodes?.map((promoCode, index) => {
                                        return (
                                            <tr
                                                key={index}
                                                className="border-b border-tableBorderColor"
                                            >
                                                <td className="p-3">
                                                    {promoCode?.code}
                                                </td>
                                                <td className="p-3 uppercase">
                                                    {promoCode?.type}
                                                </td>
                                                <td className="p-3 uppercase">
                                                    {promoCode?.value}
                                                </td>{" "}
                                                <td className="p-3 uppercase">
                                                    {
                                                        promoCode?.minPurchaseValue
                                                    }
                                                </td>{" "}
                                                <td className="p-3 uppercase">
                                                    {
                                                        promoCode?.maxPromoDiscount
                                                    }
                                                </td>
                                                <td className="p-3">
                                                    <div className="flex gap-[10px]">
                                                        <button
                                                            className="h-auto bg-transparent text-red-500 text-xl"
                                                            onClick={() =>
                                                                deleteAirline(
                                                                    promoCode?._id
                                                                )
                                                            }
                                                        >
                                                            <MdDelete />
                                                        </button>
                                                        <Link
                                                            to={`${promoCode?._id}/edit/${section}`}
                                                        >
                                                            <button className="h-auto bg-transparent text-green-500 text-xl">
                                                                <BiEditAlt />
                                                            </button>
                                                        </Link>
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
