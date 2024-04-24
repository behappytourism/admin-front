import React, { useEffect, useState } from "react";
import { BiEditAlt } from "react-icons/bi";
import { BsEyeFill } from "react-icons/bs";
import { MdDelete } from "react-icons/md";
import { useSelector } from "react-redux";
import { Link, useParams, useSearchParams } from "react-router-dom";
import axios from "../../axios";
import { PageLoader, Pagination } from "../../components";
import AddSeoSearchModal from "../../features/Seo/components/AddSeoSearchModal";

export default function SeoProductListPage() {
    const [isLoading, setIsLoading] = useState(true);
    const [categories, setCategories] = useState([]);
    const [filters, setFilters] = useState({
        skip: 0,
        limit: 10,
        totalSeoSubCategory: 0,
        search: "",
    });
    const [categoryModal, setCategoryModal] = useState({
        isOpen: false,
        isEdit: false,
    });
    const [selectedCategory, setSelectedCategory] = useState({});

    const { id, subCategoryId, categoryId } = useParams();

    const { jwtToken } = useSelector((state) => state.admin);

    const fetchMainCategory = async () => {
        try {
            setIsLoading(true);

            const response = await axios.get(
                `/seo/sub-categories/${id}/${categoryId}/${subCategoryId}?skip=${filters.skip}&limit=${filters.limit}&search=${filters.search}`,
                {
                    headers: { authorization: `Bearer ${jwtToken}` },
                }
            );

            setCategories(response?.data.seoSubCategory);
            setFilters((prev) => {
                return {
                    ...prev,
                    totalSeoSubCategory: response?.data?.totalSeoSubCategory,
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

    const addCategory = (newCategory) => {
        setCategories((prev) => {
            return [newCategory, ...prev];
        });
    };

    const updateCategory = (updatedCategory) => {
        const objIndex = categories.findIndex((category) => {
            return category?.slug === updatedCategory?.slug;
        });

        let temp = categories;
        temp[objIndex] = updatedCategory;
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
                        Seo Category - {id} - {categoryId}
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
                                                search: e.target.value,
                                            };
                                        });
                                    }}
                                    value={filters.search || ""}
                                />
                                <button
                                    type="submit"
                                    className="px-3 bg-primaryColor"
                                >
                                    Search
                                </button>
                            </form>
                            <button
                                className="px-3"
                                onClick={() =>
                                    setCategoryModal({
                                        isOpen: true,
                                        isEdit: false,
                                    })
                                }
                            >
                                + Add{" "}
                            </button>
                        </div>
                        {categoryModal?.isOpen && (
                            <AddSeoSearchModal
                                categoryModal={categoryModal}
                                setCategoryModal={setCategoryModal}
                                selectedCategory={selectedCategory}
                                addCategory={addCategory}
                                updateCategory={updateCategory}
                            />
                        )}
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
                                        <th className="font-[500] p-3">Slug</th>

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
                                                        {category?.slug}
                                                    </span>
                                                </td>

                                                <td className="p-3">
                                                    <div className="flex gap-[10px]">
                                                        <button
                                                            className="h-auto bg-transparent text-red-500 text-xl"
                                                            onClick={() =>
                                                                deleteAirport(
                                                                    category?._id
                                                                )
                                                            }
                                                        >
                                                            <MdDelete />
                                                        </button>

                                                        <button
                                                            className="h-auto bg-transparent text-green-500 text-xl"
                                                            onClick={() => {
                                                                setSelectedCategory(
                                                                    category
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
                                    })}
                                </tbody>
                            </table>

                            <div className="p-4">
                                <Pagination
                                    limit={filters?.limit}
                                    skip={filters?.skip}
                                    total={filters?.totalSeoSubCategory}
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
        </div>
    );
}
