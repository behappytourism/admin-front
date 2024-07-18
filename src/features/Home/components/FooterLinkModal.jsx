import React, { useRef, useState } from "react";
import { useHandleClickOutside } from "../../../hooks";
import { MdClose } from "react-icons/md";

export default function FooterLinkModal({
    footerLinkModal,
    setFooterLinkModal,
    selectedLink,
    addNewNavLink,
    updateNavLink,
}) {
    const [data, setData] = useState({
        name: (footerLinkModal?.isEdit && selectedLink?.link?.name) || "",
        link: (footerLinkModal?.isEdit && selectedLink?.link?.link) || "",
        isRelativeUrl:
            (footerLinkModal?.isEdit && selectedLink?.link?.isRelativeUrl) ||
            false,
        displayOrder:
            (footerLinkModal?.isEdit && selectedLink?.link?.displayOrder) || "",
    });

    const wrapperRef = useRef();
    useHandleClickOutside(wrapperRef, () =>
        setFooterLinkModal({ isOpen: false, isEdit: false })
    );

    const handleChange = (e) => {
        setData((prev) => {
            return { ...prev, [e.target.name]: e.target.value };
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (footerLinkModal?.isEdit) {
            updateNavLink(selectedLink?.navIndex, { ...data });
        } else {
            addNewNavLink({ ...data });
        }
        setFooterLinkModal({ isOpen: false, isEdit: false });
    };

    return (
        <div className="fixed inset-0 w-full h-full bg-[#fff5] flex items-center justify-center z-20 ">
            <div
                ref={wrapperRef}
                className="bg-[#fff] w-full max-h-[90vh] max-w-[500px] rounded shadow-[0_1rem_3rem_rgb(0_0_0_/_18%)] overflow-y-auto"
            >
                <div className="flex items-center justify-between border-b p-4">
                    <h2 className="font-medium mb-2">
                        {footerLinkModal?.isEdit
                            ? "Update Footer Link"
                            : "Add Footer Link"}
                    </h2>
                    <button
                        className="h-auto bg-transparent text-textColor text-xl"
                        onClick={() =>
                            setFooterLinkModal({
                                isOpen: false,
                                isEdit: false,
                            })
                        }
                    >
                        <MdClose />
                    </button>
                </div>
                <div className="p-4">
                    <form action="" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="">Name</label>
                            <input
                                type="text"
                                name="name"
                                placeholder="Enter Footer Link Name"
                                onChange={handleChange}
                                value={data.name || ""}
                                required
                            />
                        </div>
                        <div className="mt-4">
                            <label htmlFor="">Link</label>
                            <input
                                type="text"
                                name="link"
                                placeholder="Enter Footer Link"
                                onChange={handleChange}
                                value={data.link || ""}
                                required
                            />
                        </div>
                        <div className="flex items-center gap-[12px] mt-4">
                            <input
                                type="checkbox"
                                checked={data.isRelativeUrl || ""}
                                onChange={(e) => {
                                    setData((prev) => {
                                        return {
                                            ...prev,
                                            isRelativeUrl: e.target.checked,
                                        };
                                    });
                                }}
                                className="w-[16px] h-[16px]"
                            />
                            <label htmlFor="" className="mb-0">
                                Relative URL
                            </label>
                        </div>
                        <div className="mt-4">
                            <label htmlFor="">Display Order</label>
                            <input
                                type="number"
                                name="displayOrder"
                                placeholder="Enter Footer Display Order"
                                onChange={handleChange}
                                value={data.displayOrder || ""}
                                required
                            />
                        </div>
                        <div className="mt-4 flex items-center justify-end gap-[12px]">
                            <button
                                className="bg-slate-300 text-textColor px-[15px]"
                                type="button"
                                onClick={() =>
                                    setFooterLinkModal({
                                        isOpen: false,
                                        isEdit: false,
                                    })
                                }
                            >
                                Cancel
                            </button>
                            <button className="w-[140px]">
                                {footerLinkModal?.isEdit
                                    ? "Update Link"
                                    : "Add Link"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
