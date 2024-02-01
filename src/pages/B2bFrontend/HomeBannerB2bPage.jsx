import React, { useEffect, useState } from "react";
import { BiEditAlt } from "react-icons/bi";
import { BsEyeFill } from "react-icons/bs";
import { MdDelete } from "react-icons/md";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import axios from "../../axios";
import { PageLoader, Pagination, Toggle } from "../../components";
import { config } from "../../constants";
import AttractionTicketImageModal from "../../features/Attractions/components/AttractionTicketImageModal";
import B2BHomeBannerModal from "../../features/B2bHome/componenets/B2bHomeBannerModal";
import B2BHomeSectionModal from "../../features/B2bHome/componenets/B2bHomeSectionModal";

export default function HomeBannerB2bPage() {
    const [banners, setBanners] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { jwtToken } = useSelector((state) => state.admin);
    const { id } = useParams();
    const [index, setIndex] = useState("");
    const [edit, setEdit] = useState(false);
    console.log(id, "iddddddddddddd");
    const fetchSections = async () => {
        try {
            setIsLoading(true);
            const response = await axios.get(
                `/frontend/b2b/home/banner/all/${id}`,
                {
                    headers: { authorization: `Bearer ${jwtToken}` },
                }
            );

            setBanners(response?.data);

            setIsLoading(false);
        } catch (err) {
            console.log(err);
        }
    };

    const deleteBanner = async (bannerId) => {
        try {
            const isConfirm = window.confirm("Are you sure to delete?");
            if (isConfirm) {
                await axios.delete(
                    `/frontend/b2b/home/banner/delete/${id}/${bannerId}`,
                    {
                        headers: { authorization: `Bearer ${jwtToken}` },
                    }
                );

                const filteredSection = banners.filter((banner) => {
                    return banner?._id !== bannerId;
                });
                setBanners(filteredSection);
            }
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchSections();
    }, []);

    return (
        <div>
            <div className="bg-white flex items-center justify-between gap-[10px] px-6 shadow-sm border-t py-2">
                <h1 className="font-[600] text-[15px] uppercase">
                    {" "}
                    Section Banners
                </h1>
                <div className="text-sm text-grayColor">
                    <Link to="/" className="text-textColor">
                        Dashboard{" "}
                    </Link>
                    <span>{">"} </span>
                    <span>Section Banners</span>
                </div>
            </div>

            <div className="p-6">
                <div className="bg-white rounded shadow-sm">
                    <div className="flex items-center justify-between border-b border-dashed p-4">
                        <h1 className="font-medium">All Banners</h1>
                        <div className="flex items-center gap-3">
                            <button
                                className="w-[150px] bg-orange-500"
                                onClick={(e) => {
                                    setIsModalOpen(true);
                                }}
                            >
                                + Add Banner
                            </button>
                        </div>
                    </div>
                    {isLoading ? (
                        <PageLoader />
                    ) : banners?.length < 1 ? (
                        <div className="p-6 flex flex-col items-center">
                            <span className="text-sm text-grayColor block mt-[6px]">
                                Oops.. No Banners Found
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
                                            Description
                                        </th>
                                        <th className="font-[500] p-3">Link</th>
                                        <th className="font-[500] p-3">
                                            Image
                                        </th>
                                        <th className="font-[500] p-3">
                                            Status{" "}
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm">
                                    {banners?.map((section, index) => {
                                        return (
                                            <tr
                                                key={index}
                                                className="border-b border-tableBorderColor"
                                            >
                                                {" "}
                                                <td className="p-3">
                                                    {section?.title}
                                                </td>
                                                <td className="p-3">
                                                    {section?.description}
                                                </td>
                                                <td className="p-3">
                                                    {section?.link}
                                                </td>
                                                <td className="p-3">
                                                    <div className="flex items-center gap-[15px]">
                                                        <img
                                                            src={
                                                                section?.image
                                                                    ? config?.SERVER_URL +
                                                                      section?.image
                                                                    : ""
                                                            }
                                                            className="w-[40px] max-h-[40px]"
                                                            alt=""
                                                        />
                                                    </div>
                                                </td>
                                                <td className="p-3">
                                                    <div className="flex gap-[10px]">
                                                        <button
                                                            className="h-auto bg-transparent text-red-500 text-xl"
                                                            onClick={() => {
                                                                deleteBanner(
                                                                    section._id
                                                                );
                                                            }}
                                                        >
                                                            <MdDelete />
                                                        </button>

                                                        <button
                                                            className="h-auto bg-transparent text-green-500 text-xl"
                                                            onClick={() => {
                                                                setIndex(index);
                                                                setEdit(true);
                                                                setIsModalOpen(
                                                                    true
                                                                );
                                                            }}
                                                        >
                                                            <BiEditAlt />
                                                        </button>
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
            {isModalOpen && (
                <B2BHomeBannerModal
                    // image={image}setIndex={setIndex}
                    edit={edit}
                    index={index}
                    setIndex={setIndex}
                    setIsModalOpen={setIsModalOpen}
                    isModalOpen={isModalOpen}
                    setBanners={setBanners}
                    banners={banners}
                    b2b={true}
                />
            )}
        </div>
    );
}
