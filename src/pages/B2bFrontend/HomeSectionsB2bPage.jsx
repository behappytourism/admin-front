import React, { useEffect, useState } from "react";
import { BiEditAlt } from "react-icons/bi";
import { BsEyeFill } from "react-icons/bs";
import { MdDelete } from "react-icons/md";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import axios from "../../axios";
import { PageLoader, Pagination, Toggle } from "../../components";
import { config } from "../../constants";
import AttractionTicketImageModal from "../../features/Attractions/components/AttractionTicketImageModal";
import B2BHomeSectionModal from "../../features/B2bHome/componenets/B2bHomeSectionModal";

export default function HomeSettingsB2bPage() {
    const [sections, setSections] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { jwtToken } = useSelector((state) => state.admin);
    const [index, setIndex] = useState("");
    const [edit, setEdit] = useState(false);
    const fetchSections = async () => {
        try {
            setIsLoading(true);
            const response = await axios.get(`/frontend/b2b/home/section/all`, {
                headers: { authorization: `Bearer ${jwtToken}` },
            });

            setSections(response?.data);

            setIsLoading(false);
        } catch (err) {
            setIsLoading(false);

            console.log(err);
        }
    };
    const deleteSection = async (id) => {
        try {
            const isConfirm = window.confirm("Are you sure to delete?");
            if (isConfirm) {
                await axios.delete(`/frontend/b2b/home/section/delete/${id}`, {
                    headers: { authorization: `Bearer ${jwtToken}` },
                });

                const filteredSection = sections.filter((section) => {
                    return section?._id !== id;
                });
                setSections(filteredSection);
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
                    Home Sections
                </h1>
                <div className="text-sm text-grayColor">
                    <Link to="/" className="text-textColor">
                        Dashboard{" "}
                    </Link>
                    <span>{">"} </span>
                    <span>Home Sections</span>
                </div>
            </div>

            <div className="p-6">
                <div className="bg-white rounded shadow-sm">
                    <div className="flex items-center justify-between border-b border-dashed p-4">
                        <h1 className="font-medium">All Sections</h1>
                        <div className="flex items-center gap-3">
                            <button
                                className="w-[150px] bg-orange-500"
                                onClick={(e) => {
                                    setIsModalOpen(true);
                                    setIndex("");
                                    setEdit(false);
                                }}
                            >
                                + Add Section
                            </button>
                        </div>
                    </div>
                    {isLoading ? (
                        <PageLoader />
                    ) : sections?.length < 1 ? (
                        <div className="p-6 flex flex-col items-center">
                            <span className="text-sm text-grayColor block mt-[6px]">
                                Oops.. No Sections Found
                            </span>
                        </div>
                    ) : (
                        <div>
                            <table className="w-full">
                                <thead className="bg-[#f3f6f9] text-grayColor text-[14px] text-left">
                                    <tr>
                                        <th className="font-[500] p-3">Name</th>
                                        <th className="font-[500] p-3">
                                            Description
                                        </th>
                                        <th className="font-[500] p-3">
                                            Status{" "}
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm">
                                    {sections?.map((section, index) => {
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
                                                    <div className="flex gap-[10px]">
                                                        <button
                                                            className="h-auto bg-transparent text-red-500 text-xl"
                                                            onClick={() => {
                                                                deleteSection(
                                                                    section._id
                                                                );
                                                            }}
                                                        >
                                                            <MdDelete />
                                                        </button>
                                                        <Link
                                                            to={`${section._id}/edit`}
                                                        >
                                                            <button className="h-auto bg-transparent text-green-500 text-xl">
                                                                <BsEyeFill />
                                                            </button>
                                                        </Link>
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
                <B2BHomeSectionModal
                    // image={image}
                    setIndex={setIndex}
                    edit={edit}
                    index={index}
                    setIsModalOpen={setIsModalOpen}
                    isModalOpen={isModalOpen}
                    setSections={setSections}
                    sections={sections}
                />
            )}
        </div>
    );
}
