import React, { useEffect, useState } from "react";
import { BiEditAlt } from "react-icons/bi";
import { BsEyeFill } from "react-icons/bs";
import { MdDelete } from "react-icons/md";
import { useSelector } from "react-redux";
import { Link, useParams, useSearchParams } from "react-router-dom";
import axios from "../../axios";
import { PageLoader, Pagination } from "../../components";
import SeoAttractionSubCategoryTablePage from "../../features/Seo/components/SeoAttractionSubCategoryTable";
import SeoBlogSubCategoryTablePage from "../../features/Seo/components/SeoBlogSubCategoryPage";
import SeoToursSubCategoryTablePage from "../../features/Seo/components/SeoToursSubCategoryTablePage";
import SeoVisaSubCategoryTablePage from "../../features/Seo/components/SeoVisaSubCategoryPage";

export default function SeoSubCategoryPage() {
    const [isLoading, setIsLoading] = useState(true);
    const [categories, setCategories] = useState([]);
    const [filters, setFilters] = useState({
        skip: 0,
        limit: 10,
        totalCategories: 0,
        searchQuery: "",
    });
    const { id, categoryId } = useParams();

    const { jwtToken } = useSelector((state) => state.admin);

    // const fetchMainCategory = async () => {
    //     try {
    //         setIsLoading(true);

    //         const response = await axios.get(
    //             `/seo/sub-categories/${id}/${categoryId}?skip=${filters.skip}&limit=${filters.limit}&searchQuery=${filters.searchQuery}`,
    //             {
    //                 headers: { authorization: `Bearer ${jwtToken}` },
    //             }
    //         );

    //         setCategories(response?.data);
    //         setFilters((prev) => {
    //             return {
    //                 ...prev,
    //                 totalAirports: response?.data?.totalAirports,
    //             };
    //         });
    //         setIsLoading(false);
    //     } catch (err) {
    //         console.log(err);
    //     }
    // };

    // const deleteAirport = async (id) => {
    //     try {
    //         const isConfirm = window.confirm("Are you sure to delete?");
    //         if (isConfirm) {
    //             await axios.delete(`/airports/delete/${id}`, {
    //                 headers: { authorization: `Bearer ${jwtToken}` },
    //             });

    //             const filteredAirports = categories.filter((airport) => {
    //                 return category?._id !== id;
    //             });
    //             setCategories(filteredAirports);
    //         }
    //     } catch (err) {
    //         console.log(err);
    //     }
    // };

    // useEffect(() => {
    //     fetchMainCategory();
    // }, [filters.skip, filters.limit]);

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
            {categoryId === "attraction" && (
                <SeoAttractionSubCategoryTablePage />
            )}
            {categoryId === "visa" && <SeoVisaSubCategoryTablePage />}
            {categoryId === "tours" && <SeoToursSubCategoryTablePage />}
            {categoryId === "blog" && <SeoBlogSubCategoryTablePage />}
        </div>
    );
}
