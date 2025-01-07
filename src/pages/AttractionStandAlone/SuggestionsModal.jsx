import React from "react";
import { useDispatch } from "react-redux";
import { addAttractionStandAloneDatas } from "../../redux/slices/attrStandAloneSlice";

function SuggestionsModal({
    value,
    setValue,
    dropdown,
    setDropdown,
    suggestions,
}) {
    const dispatch = useDispatch();

    const handleAttractions = (element) => {
        dispatch(
            addAttractionStandAloneDatas({ name: "attraction", value: element })
        );
    };

    return (
        <div>
            {value && dropdown ? (
                <div className="bg-white absolute max-h-[20em] w-[32em] mt-1 shadow border bg-light rounded-lg overflow-y-auto z-50">
                    <div className="w-full p-5 overflow-y-auto">
                        {suggestions?.length ? (
                            <div>
                                <h1 className="text-lg font-bold">
                                    Attractions
                                </h1>
                            </div>
                        ) : (
                            ""
                        )}
                        <div className="pt-2">
                            {suggestions?.map((ele) => (
                                <div
                                    key={ele?._id}
                                    className="border-b p-1 cursor-pointer hover:bg-slate-50"
                                    onClick={() => {
                                        setValue(ele?.title);
                                        setDropdown(!dropdown);
                                        handleAttractions(ele);
                                    }}
                                >
                                    <h1>{ele?.title}</h1>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            ) : (
                ""
            )}
        </div>
    );
}

export default SuggestionsModal;
