import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "../../axios";
import { useSelector } from "react-redux";
import { Pagination, PageLoader } from "../../components";

function B2bEnquiryDetailPage() {
  const { jwtToken } = useSelector((state) => state.admin);

  const [enquires, setEnquires] = useState([]);
  const [filters, setFilters] = useState({
    skip: 0,
    limit: 10,
    totalEnquires: 0,
  });
  const [isLoading, setIsLoading] = useState(false);

  const fetchDetails = async ({ ...filters }) => {
    try {
      setIsLoading(true);
      const res = await axios.get(
        `/frontend/b2b/getInTouch/getUser-messages?limit=${filters.limit}&skip=${filters.skip}`,
        {
          headers: { Authorization: `Bearer ${jwtToken}` },
        }
      );
      setEnquires(res?.data?.enquires);
      setFilters({
        ...filters,
        totalEnquires: res?.data?.totalCount,
      });
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  };

  useEffect(() => {
    fetchDetails({ ...filters });
  }, [filters.skip]);

  return (
    <div>
      <div className="bg-white flex items-center justify-between gap-[10px] px-6 shadow-sm border-t py-2">
        <h1 className="font-[600] text-[15px] uppercase">Home Enquiry</h1>
        <div className="text-sm text-grayColor">
          <Link to="/" className="text-textColor">
            Dashboard{" "}
          </Link>
          <span>{">"} </span>
          <span>Home Enquiry</span>
        </div>
      </div>
      {!isLoading ? (
        <div className="py-1 px-5">
          <div>
            <table className="w-full">
              <thead className="bg-[#f3f6f9] text-grayColor text-[14px] text-left">
                <tr>
                  <th className="font-[500] p-3">Name</th>
                  <th className="font-[500] p-3">Email</th>
                  <th className="font-[500] p-3">Phone Number</th>
                  <th className="font-[500] p-3">Message</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {enquires?.map((ele, index) => (
                  <tr
                    key={index}
                    className="border-b border-tableBorderColor bg-white"
                  >
                    <td className="p-3">{ele?.name}</td>
                    <td className="p-3">{ele?.email}</td>
                    <td className="p-3">{ele?.phone}</td>
                    <td className="p-3">{ele?.message}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-4">
            <Pagination
              limit={filters?.limit}
              skip={filters?.skip}
              total={filters?.totalEnquires}
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
      ) : (
        <div className="bg-white w-full h-20">
          <PageLoader />
        </div>
      )}
    </div>
  );
}

export default B2bEnquiryDetailPage;
