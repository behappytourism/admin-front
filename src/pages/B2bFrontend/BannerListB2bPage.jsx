import React, { useEffect } from "react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { Link, useSearchParams } from "react-router-dom";
import { PageLoader, Pagination } from "../../components";
import { A2AIndexTable, AddA2AModal } from "../../features/A2A";
import axios from "../../axios";
import BannerTableRow from "../../features/Banner/componenets/BannerTableRow";

function BannerListB2bPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState([]);

    const [searchParams, setSearchParams] = useSearchParams();

    const { jwtToken } = useSelector((state) => state.admin);

    const fetchBanners = async () => {
        try {
            setIsLoading(true);

            const response = await axios.get(`/frontend/b2b/banners/all`, {
                headers: { Authorization: `Bearer ${jwtToken}` },
            });
            console.log(response.data);
            setResult(response.data);

            setIsLoading(false);
        } catch (err) {
            console.log(err);
            setIsLoading(false);
        }
    };
    useEffect(() => {
        fetchBanners();
    }, []);

    return (
        <div>
            <div className="bg-white flex items-center justify-between gap-[10px] px-6 shadow-sm border-t py-2">
                <h1 className="font-[600] text-[15px] uppercase">Banners</h1>
                <div className="text-sm text-grayColor">
                    <Link to="/" className="text-textColor">
                        Dashboard{" "}
                    </Link>
                    <span>{">"} </span>
                    <span>Banners</span>
                </div>
            </div>
            <div className="p-6">
                <div className="bg-white rounded shadow-sm">
                    <div className="flex items-center justify-between border-b border-dashed p-4">
                        <h1 className="font-medium">All Banners</h1>
                        <div className="flex items-center gap-[15px]">
                            <div>
                                <Link to={`add`}>
                                    <button
                                        className="w-[160px] bg-orange-500"
                                        // onClick={() => setIsAddA2AModalOpen(true)}
                                    >
                                        + Add Banner
                                    </button>
                                </Link>
                            </div>
                        </div>
                    </div>
                    {isLoading ? (
                        <PageLoader />
                    ) : result?.length < 1 ? (
                        <div className="p-6 flex flex-col items-center">
                            <span className="text-sm  text-grayColor block mt-[6px]">
                                Oops.. No Banner found
                            </span>
                        </div>
                    ) : (
                        <div>
                            <table className="w-full">
                                <thead className="bg-[#f3f6f9] text-grayColor text-[14px] text-left">
                                    <tr>
                                        <th className="font-[500] p-3">#</th>
                                        <th className="font-[500] p-3">Name</th>

                                        <th className="font-[500] p-3">
                                            Action
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm">
                                    {result?.map((banner, index) => {
                                        return (
                                            <BannerTableRow
                                                key={banner?._id}
                                                banner={banner}
                                                index={index}
                                                setResult={setResult}
                                                result={result}
                                            />
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

export default BannerListB2bPage;
