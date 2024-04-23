import { BiEditAlt } from "react-icons/bi";
import { BsEyeFill } from "react-icons/bs";
import { MdDelete } from "react-icons/md";
import { Link, useParams } from "react-router-dom";

export default function SeoVisaSubCategoryTablePage({}) {
    const { id, categoryId, subCategoryId } = useParams();

    return (
        <div className="p-6">
            <div className="bg-white rounded shadow-sm">
                <div className="flex items-center justify-between border-b border-dashed p-4">
                    <h1 className="font-medium">
                        Seo Category - {id} - {categoryId}
                    </h1>
                    <div className="flex items-center gap-3"></div>
                </div>

                <div>
                    <table className="w-full">
                        <thead className="bg-[#f3f6f9] text-grayColor text-[14px] text-left">
                            <tr>
                                <th className="font-[500] p-3">Category</th>

                                <th className="font-[500] p-3">Action</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm">
                            <tr className="border-b border-tableBorderColor">
                                <td className="p-3">
                                    <span className="block">
                                        Visa Nationalities
                                    </span>
                                </td>

                                <td className="p-3">
                                    <div className="flex gap-[10px]">
                                        <Link to={`visa-nationality`}>
                                            <button className="h-auto bg-transparent text-green-500 text-xl">
                                                <BsEyeFill />
                                            </button>
                                        </Link>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
