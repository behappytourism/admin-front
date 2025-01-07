import React, { useState } from "react";
import { MultipleSelectDropdown, SelectDropdown } from "../../components";
import EmailTemplateChooseModal from "./EmailTemplateChooseModal";

function EmailCampaignForm({
    data,
    handleChange,
    selectedSection,
    emailLists,
    emailTemplates,
    setData,
    groupName,
    setPrevEmailTemplate,
    emailFooters,
    emailConfigs,
}) {
    const [isModal, setIsModal] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState("");
    const handleChooseTemplate = async (value) => {
        try {
            setData((prev) => {
                return { ...prev, ["emailTemplateId"]: value };
            });
        } catch (err) {
            conosle.log(err);
        }
    };
    return (
        <div className={selectedSection === "-details" ? "block" : "hidden"}>
            <div className="flex gap-5 underline">
                <span className="block text-[15px] pb-5">
                    Group Name -{groupName?.toUpperCase()}
                </span>
            </div>
            <div className="grid grid-cols-3 gap-4">
                <div>
                    <label htmlFor="">Name</label>
                    <input
                        type="text"
                        placeholder="Enter  name"
                        name="name"
                        value={data?.name || ""}
                        onChange={handleChange}
                        required
                    />
                </div>{" "}
                <div>
                    <label htmlFor=""> Date</label>
                    <input
                        type="date"
                        placeholder="Enter date"
                        name="date"
                        value={data.date || ""}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="">Hour</label>
                    <select
                        name="hour"
                        value={data.hour || ""}
                        onChange={handleChange}
                        id=""
                        className="capitalize"
                    >
                        <option value="" hidden>
                            Select Hour
                        </option>
                        {Array.from({ length: 24 }, (_, index) => index)?.map(
                            (category, index) => {
                                const value = category
                                    .toString()
                                    .padStart(2, "0");

                                return (
                                    <option
                                        value={value}
                                        key={index}
                                        className="capitalize"
                                    >
                                        {value}
                                    </option>
                                );
                            }
                        )}
                    </select>
                </div>
                <div>
                    <label htmlFor="">Min</label>

                    <select
                        name="min"
                        value={data.min || ""}
                        onChange={handleChange}
                        id=""
                        className="capitalize"
                    >
                        <option value="" hidden>
                            Select Min
                        </option>
                        {Array.from({ length: 60 }, (_, i) => {
                            const value = i.toString().padStart(2, "0");
                            return (
                                <option
                                    key={value}
                                    value={value}
                                    className="capitalize"
                                >
                                    {value}
                                </option>
                            );
                        })}
                    </select>
                </div>
                <div>
                    <label htmlFor="">Mail List *</label>
                    <div className="">
                        <MultipleSelectDropdown
                            data={emailLists}
                            displayName={"name"}
                            selectedData={data?.emailListId || ""}
                            setSelectedData={(selData) =>
                                setData((prev) => {
                                    return {
                                        ...prev,
                                        ["emailListId"]: selData,
                                    };
                                })
                            }
                            valueName={"_id"}
                            randomIndex={"name"}
                            // disabled={!isEditPermission}
                        />
                    </div>
                </div>
                <div>
                    <label htmlFor="">Template *</label>
                    <div className="flex items-center gap-2">
                        <button
                            className="w-[100px]"
                            onClick={(e) => {
                                setIsModal(true);
                            }}
                        >
                            Choose
                        </button>
                        <p>
                            {
                                emailTemplates.find(
                                    (temp) =>
                                        temp._id.toString() ==
                                        data.emailTemplateId
                                )?.name
                            }
                        </p>
                    </div>
                </div>
                <div>
                    <label htmlFor="">Email Configs</label>
                    <div className="">
                        <SelectDropdown
                            data={emailConfigs}
                            valueName={"_id"}
                            displayName={"name"}
                            placeholder={"Select Email Configs "}
                            selectedData={data?.emailConfigId || ""}
                            setSelectedData={(selData) =>
                                setData((prev) => {
                                    console.log(selData, "selectedData");

                                    return {
                                        ...prev,
                                        ["emailConfigId"]: selData,
                                    };
                                })
                            }
                        />
                    </div>
                </div>{" "}
                <div>
                    <label htmlFor="">Email Footers</label>
                    <div className="">
                        <SelectDropdown
                            data={emailFooters}
                            valueName={"_id"}
                            displayName={"name"}
                            placeholder={"Select Email Footers"}
                            selectedData={data?.emailFooterId || ""}
                            setSelectedData={(selData) =>
                                setData((prev) => {
                                    return {
                                        ...prev,
                                        ["emailFooterId"]: selData,
                                    };
                                })
                            }
                        />
                    </div>
                </div>
            </div>
            <div className="pt-4">
                <label htmlFor="">Subject</label>
                <input
                    type="tex"
                    placeholder="Enter Email Subject"
                    name="subject"
                    value={data.subject || ""}
                    onChange={handleChange}
                    required
                />
            </div>
            {isModal && (
                <EmailTemplateChooseModal
                    setIsModal={setIsModal}
                    emailTemplateId={data?.emailTemplateId}
                    handleChooseTemplate={handleChooseTemplate}
                    emailTemplates={emailTemplates}
                    // tags={keyValue}
                    // setImages={setImages}
                />
            )}
        </div>
    );
}

export default EmailCampaignForm;
