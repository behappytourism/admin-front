import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

import axios from "../../axios";
import { PageLoader, Pagination } from "../../components";
import { formatDate } from "../../utils";
import { BiEditAlt } from "react-icons/bi";
import EmailImageUploadModal from "../../features/Email/EmailImageUploadModal";
import { config } from "../../constants";
import { MdDelete } from "react-icons/md";

export default function EmailImageLisitingPage() {
    const [images, setImages] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filters, setFilters] = useState({
        skip: 0,
        limit: 10,
        totalImages: 0,
    });
    const [isModal, setIsModal] = useState(false);
    const [selectedImage, setSelectedImage] = useState();

    const { jwtToken } = useSelector((state) => state.admin);

    const fetchimages = async () => {
        try {
            setIsLoading(true);

            const response = await axios.get(
                `/email/image/all?skip=${filters?.skip}&limit=${filters?.limit}`,
                {
                    headers: { Authorization: `Bearer ${jwtToken}` },
                }
            );

            setImages(response?.data?.emailImages);
            setFilters((prev) => {
                return {
                    ...prev,
                    totalimages: response?.data?.totalEmailImages,
                };
            });
            setIsLoading(false);
        } catch (err) {
            console.log(err);
        }
    };

    const deleteImage = async (id) => {
        try {
            const isConfirm = window.confirm("Are you sure to delete?");
            if (isConfirm) {
                await axios.delete(`/email/image/delete/${id}`, {
                    headers: { authorization: `Bearer ${jwtToken}` },
                });

                const filteredImages = images.filter((img) => {
                    return img?._id !== id;
                });
                setImages(filteredImages);
            }
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchimages();
    }, []);

    return (
        <div>
            {/* <div className="bg-white flex items-center justify-between gap-[10px] px-6 shadow-sm border-t py-2">
                <h1 className="font-[600] text-[15px] uppercase">
                    Email Images List
                </h1>
                <div className="text-sm text-grayColor">
                    <Link to="/" className="text-textColor">
                        Dashboard{" "}
                    </Link>
                    <span>{">"} </span>
                    <Link to="/email/lists" className="text-textColor">
                        Images List
                    </Link>
                    <span>{">"} </span>
                    <span>Sent </span>
                </div>
            </div> */}

            {isLoading ? (
                <PageLoader />
            ) : (
                <div className="p-6">
                    <div className="bg-white rounded shadow-sm">
                        <div className="flex items-center justify-between border-b border-dashed p-4">
                            <h1 className="font-medium">All Email Images</h1>
                            <button
                                className="px-3"
                                onClick={(e) => {
                                    setIsModal(true);
                                }}
                            >
                                + Add
                            </button>
                        </div>
                        {images?.length < 1 ? (
                            <div className="p-6 flex flex-col items-center">
                                <span className="text-sm text-grayColor block mt-[6px]">
                                    Oops.. No images found
                                </span>
                            </div>
                        ) : (
                            <div>
                                <table className="w-full">
                                    <thead className="bg-[#f3f6f9] text-grayColor text-[14px] text-left">
                                        <tr>
                                            <th className="font-[500] p-3">
                                                Name
                                            </th>
                                            <th className="font-[500] p-3">
                                                Image
                                            </th>

                                            <th className="font-[500] p-3"></th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-sm">
                                        {images?.map((image, index) => {
                                            return (
                                                <tr
                                                    key={index}
                                                    className="border-b border-tableBorderColor"
                                                >
                                                    <td className="p-3">
                                                        {image?.name}
                                                    </td>
                                                    <td className="p-3 capitalize">
                                                        {image?.image && (
                                                            <img
                                                                src={
                                                                    config.SERVER_URL +
                                                                    image?.image
                                                                }
                                                                alt=""
                                                                className="w-[40px] h-[40px] rounded object-cover"
                                                            />
                                                        )}{" "}
                                                    </td>

                                                    <td className="p-3">
                                                        <div className="flex gap-[10px]">
                                                            <button
                                                                className="h-auto bg-transparent text-red-500 text-xl"
                                                                onClick={() =>
                                                                    deleteImage(
                                                                        image?._id
                                                                    )
                                                                }
                                                            >
                                                                <MdDelete />
                                                            </button>

                                                            {/* <button
                                                                className="h-auto bg-transparent text-green-500 text-xl"
                                                                onClick={() => {
                                                                    setIsModal(
                                                                        true
                                                                    );
                                                                }}
                                                            >
                                                                <BiEditAlt />
                                                            </button> */}
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>

                                <div className="p-4">
                                    <Pagination
                                        limit={filters?.limit}
                                        skip={filters?.skip}
                                        total={filters?.totalimages}
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
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {isModal && (
                <EmailImageUploadModal
                    setIsModal={setIsModal}
                    setImages={setImages}
                />
            )}
        </div>
    );
}
