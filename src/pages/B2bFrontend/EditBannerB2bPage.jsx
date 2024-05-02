import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { BtnLoader, PageLoader, RichTextEditor } from "../../components";
import AddSectionModal from "../../features/Attractions/components/AddSectionModal";
import AddDetailModal from "../../features/Visa/components/AddDetailsModal";
import AddFaqsModal from "../../features/Visa/components/AddFaqsModal";
import { useHandleClickOutside, useImageChange } from "../../hooks";
import axios from "../../axios";
import { MdDelete } from "react-icons/md";
import { BiEditAlt } from "react-icons/bi";
import { config } from "../../constants";
import AddBannerModal from "../../features/Banner/componenets/AddBannerModal";

function EditBannerB2bPage() {
    const { countries, isGeneralLoading } = useSelector(
        (state) => state.general
    );

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [edit, setEdit] = useState(false);
    const [editIndex, setEditIndex] = useState("");

    const { jwtToken } = useSelector((state) => state.admin);

    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [data, setData] = useState({
        banners: [],
    });

    const [categoryModal, setCategoryModal] = useState({
        isOpen: false,
        isEdit: false,
    });

    const [filters, setFilters] = useState({
        skip: 0,
        limit: 10,
        totalResellers: 0,
    });

    const { id } = useParams();

    const handleChange = (e) => {
        setData((prev) => {
            return { ...prev, [e.target.name]: e.target.value };
        });
    };

    const fetchBanner = async () => {
        try {
            setIsLoading(true);

            if (id != null) {
                const response = await axios.get(
                    `/frontend/b2b/banners/single/${id}`,
                    {
                        headers: { authorization: `Bearer ${jwtToken}` },
                    }
                );

                setData(response.data);
                setData(response.data);
            }

            setIsLoading(false);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchBanner();
    }, []);

    const deleteBanner = async (bannerId) => {
        try {
            if (window.confirm("Are you sure to delete?")) {
                const response = await axios.delete(
                    `/frontend/b2b/banners/delete/${id}/${bannerId}`,
                    {
                        headers: { authorization: `Bearer ${jwtToken}` },
                    }
                );
                const updatedData = {
                    ...data,
                    banners: data.banners.filter(
                        (item, indexs) => item?._id !== bannerId
                    ),
                };
                setData(updatedData);
            }
        } catch (err) {}
    };
    console.log(data, "data");

    return (
        <div>
            <div className="bg-white flex items-center justify-between gap-[10px] px-6 shadow-sm border-t py-2">
                <h1 className="font-[600] text-[15px] uppercase">
                    Edit Banner
                </h1>
                <div className="text-sm text-grayColor">
                    <Link to="/" className="text-textColor">
                        Dashboard{" "}
                    </Link>
                    <span>{">"} </span>
                    <Link to="/banners" className="text-textColor">
                        Banner{" "}
                    </Link>
                    <span>{">"} </span>
                    <span>Edit</span>
                </div>
            </div>
            {isLoading ? (
                <div>
                    <PageLoader />
                </div>
            ) : (
                <div className="p-6">
                    <div className="bg-white rounded shadow-sm">
                        <div className="flex items-center justify-between border-b border-dashed p-4">
                            <h1 className="font-medium capitalize">
                                Edit Banner ({data?.name})
                            </h1>
                            <div className="flex items-center gap-[15px]">
                                <div>
                                    <button
                                        className="px-3 bg-orange-500"
                                        onClick={() => {
                                            setEditIndex("");
                                            setCategoryModal({
                                                isOpen: true,
                                                isEdit: false,
                                            });
                                        }}
                                    >
                                        New Banner
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="p-6">
                            <div>
                                <div className="">
                                    <div className="">
                                        {categoryModal?.isOpen && (
                                            <AddBannerModal
                                                data={data}
                                                setData={setData}
                                                categoryModal={categoryModal}
                                                setCategoryModal={
                                                    setCategoryModal
                                                }
                                                editIndex={editIndex}
                                                setEditIndex={setEditIndex}
                                                b2b={true}
                                            />
                                        )}
                                    </div>
                                </div>
                                <div className="mt-[1em]">
                                    {data.banners?.length > 0 ? (
                                        <table className="w-full">
                                            <thead className="bg-[#f3f6f9] text-grayColor text-[14px] text-left">
                                                <tr>
                                                    <th className="font-[500] p-3">
                                                        #
                                                    </th>
                                                    <th className="font-[500] p-3">
                                                        Document Title
                                                    </th>
                                                    <th className="font-[500] p-3">
                                                        Document Body
                                                    </th>
                                                    <th className="font-[500] p-3">
                                                        Image
                                                    </th>
                                                    <th className="font-[500] p-3">
                                                        Action
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {data.banners?.map(
                                                    (banner, index) => {
                                                        return (
                                                            <tr
                                                                key={index}
                                                                className="border-b border-tableBorderColor"
                                                            >
                                                                <td className="p-3">
                                                                    #{index + 1}
                                                                </td>
                                                                <td className="p-3">
                                                                    {banner?.title ||
                                                                        "N/A"}
                                                                </td>
                                                                <td className="p-3">
                                                                    {banner?.body ||
                                                                        "N/A"}
                                                                </td>
                                                                <td>
                                                                    <img
                                                                        src={
                                                                            config?.SERVER_URL +
                                                                            banner?.image
                                                                        }
                                                                        alt=""
                                                                        className="w-[40px] max-h-[40px] mt-3"
                                                                    />
                                                                </td>

                                                                <td className="p-3">
                                                                    <div className="flex gap-[10px]">
                                                                        <button
                                                                            className="h-auto bg-transparent text-red-500 text-xl"
                                                                            onClick={() => {
                                                                                deleteBanner(
                                                                                    banner._id
                                                                                );
                                                                            }}
                                                                        >
                                                                            <MdDelete />
                                                                        </button>
                                                                        <button
                                                                            className="h-auto bg-transparent text-green-500 text-xl"
                                                                            onClick={() => {
                                                                                setEditIndex(
                                                                                    index
                                                                                );
                                                                                setCategoryModal(
                                                                                    {
                                                                                        isOpen: true,
                                                                                        isEdit: true,
                                                                                    }
                                                                                );
                                                                            }}
                                                                        >
                                                                            <BiEditAlt />
                                                                        </button>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        );
                                                    }
                                                )}
                                            </tbody>
                                        </table>
                                    ) : (
                                        <span className="text-sm text-grayColor font-medium text-center block">
                                            Banner not added!!!
                                        </span>
                                    )}
                                </div>

                                {error && (
                                    <span className="text-sm text-red-500 block mt-4">
                                        {error}
                                    </span>
                                )}

                                {/* <div className="mt-4 flex items-center justify-end gap-[12px]">
                                <button
                                    className="bg-slate-300 text-textColor px-[15px]"
                                    type="button"
                                    onClick={() => navigate(-1)}
                                >
                                    Cancel
                                </button>
                                <button
                                    className="w-[100px] bg-primaryColor"
                                    type="button"
                                    onClick={handleSubmit}
                                >
                                    {isLoading ? <BtnLoader /> : "Save"}
                                </button>
                            </div> */}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default EditBannerB2bPage;
