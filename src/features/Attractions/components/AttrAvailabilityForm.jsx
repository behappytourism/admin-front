import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { MdDelete } from "react-icons/md";
import { AiOutlinePlus } from "react-icons/ai";

import {
    addOffDate,
    changeAvailabilityData,
    changeOffDateData,
    removeOffDate,
    setData,
} from "../../../redux/slices/attractionFormSlice";

export default function AttrAvailabilityForm({ section }) {
    const { data, availability, offDates } = useSelector(
        (state) => state.attractionForm
    );
    const dispatch = useDispatch();

    const handleChange = (e) => {
        dispatch(setData({ name: e.target.name, value: e.target.value }));
    };

    const handleAvailabilityChange = (e, index) => {
        dispatch(
            changeAvailabilityData({
                name: e.target.name,
                value: e.target.value,
                index,
            })
        );
    };

    const handleOffDatesChange = (e, index) => {
        dispatch(
            changeOffDateData({
                name: e.target.name,
                value: e.target.value,
                index,
            })
        );
    };

    return (
        <div className={section === 3 ? "block" : "hidden"}>
            <div className="flex items-center gap-[10px] ">
                <input
                    type="checkbox"
                    className="w-[16px] h-[16px]"
                    checked={data?.isCustomDate || false}
                    onChange={(e) => {
                        dispatch(
                            setData({
                                name: "isCustomDate",
                                value: e.target.checked,
                            })
                        );
                    }}
                />
                <label
                    htmlFor=""
                    className="font-[600]  block text-blue-500 items-center"
                >
                    Custom Date
                </label>
            </div>
            {data?.isCustomDate && (
                <div className="grid grid-cols-3 gap-[20px] mt-4">
                    <div>
                        <label htmlFor="">Start Date</label>
                        <input
                            type="date"
                            name="startDate"
                            onChange={handleChange}
                            value={
                                data?.startDate
                                    ? new Date(data?.startDate)
                                          .toISOString()
                                          .substring(0, 10)
                                    : ""
                            }
                        />
                    </div>
                    <div>
                        <label htmlFor="">End Date</label>
                        <input
                            type="date"
                            name="endDate"
                            onChange={handleChange}
                            value={
                                data?.endDate
                                    ? new Date(data?.endDate)
                                          .toISOString()
                                          .substring(0, 10)
                                    : ""
                            }
                        />
                    </div>
                </div>
            )}
            <div className="mt-8">
                <table className="w-full max-w-[800px]">
                    <thead className="bg-[#f3f6f9] text-grayColor text-[14px] text-left">
                        <tr>
                            <th className="font-[500] p-3">Enable</th>
                            <th className="font-[500] p-3">Day of Week</th>
                            <th className="font-[500] p-3">Open</th>
                            <th className="font-[500] p-3">Close</th>
                        </tr>
                    </thead>
                    <tbody>
                        {availability?.map((item, index) => {
                            return (
                                <tr
                                    key={index}
                                    className="border-b border-tableBorderColor"
                                >
                                    <td className="p-3">
                                        <input
                                            type="checkbox"
                                            className="w-[16px] h-[16px]"
                                            checked={item?.isEnabled || false}
                                            name="isEnabled"
                                            onChange={(e) =>
                                                dispatch(
                                                    changeAvailabilityData({
                                                        name: e.target.name,
                                                        value: e.target.checked,
                                                        index,
                                                    })
                                                )
                                            }
                                        />
                                    </td>
                                    <td className="p-3">{item?.day}</td>
                                    <td className="p-3">
                                        <select
                                            name="open"
                                            value={item?.open || "00:00"}
                                            id=""
                                            onChange={(e) =>
                                                handleAvailabilityChange(
                                                    e,
                                                    index
                                                )
                                            }
                                        >
                                            {Array.from({ length: 24 }).map(
                                                (_, index) => {
                                                    return (
                                                        <option
                                                            value={
                                                                `0${index}`.slice(
                                                                    -2
                                                                ) + ":00"
                                                            }
                                                        >
                                                            {`0${index}`.slice(
                                                                -2
                                                            ) + ":00"}
                                                        </option>
                                                    );
                                                }
                                            )}
                                        </select>
                                    </td>
                                    <td className="p-3">
                                        <select
                                            name="close"
                                            value={item?.close || "00:00"}
                                            id=""
                                            onChange={(e) =>
                                                handleAvailabilityChange(
                                                    e,
                                                    index
                                                )
                                            }
                                        >
                                            {Array.from({ length: 24 }).map(
                                                (_, index) => {
                                                    return (
                                                        <option
                                                            value={
                                                                `0${index}`.slice(
                                                                    -2
                                                                ) + ":00"
                                                            }
                                                        >
                                                            {`0${index}`.slice(
                                                                -2
                                                            ) + ":00"}
                                                        </option>
                                                    );
                                                }
                                            )}
                                        </select>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
            <div className="mt-10">
                <span className="font-[600] mb-2 block text-blue-500">
                    Custom Off Dates
                </span>
                {offDates?.map((item, index) => {
                    return (
                        <div
                            key={index}
                            className="flex items-end gap-[10px] max-w-[250px] mb-3"
                        >
                            <div>
                                <label htmlFor="">From</label>
                                <input
                                    type="date"
                                    name="from"
                                    value={
                                        item?.from
                                            ? new Date(item?.from)
                                                  .toISOString()
                                                  .substring(0, 10)
                                            : ""
                                    }
                                    onChange={(e) =>
                                        handleOffDatesChange(e, index)
                                    }
                                />
                            </div>
                            <div>
                                <label htmlFor="">To</label>
                                <input
                                    type="date"
                                    name="to"
                                    value={
                                        item?.to
                                            ? new Date(item?.to)
                                                  .toISOString()
                                                  .substring(0, 10)
                                            : ""
                                    }
                                    onChange={(e) =>
                                        handleOffDatesChange(e, index)
                                    }
                                />
                            </div>
                            <div className="flex items-center gap-[10px]">
                                <button
                                    className="bg-transparent text-xl text-red-500"
                                    onClick={() => {
                                        dispatch(removeOffDate(index));
                                    }}
                                >
                                    <MdDelete />
                                </button>
                            </div>
                        </div>
                    );
                })}
                <button
                    className=" text-xl w-[40px] flex items-center justify-center bg-orange-500"
                    onClick={() => {
                        dispatch(addOffDate());
                    }}
                >
                    <AiOutlinePlus />
                </button>
            </div>
        </div>
    );
}
