import { Table, useTheme } from "flowbite-react";
import { MdAdsClick } from "react-icons/md";
import { FaCartPlus } from "react-icons/fa";
import { IoIosCash } from "react-icons/io";
import { useState, useEffect } from "react";
import axios from "../config/axios";
import type { FC } from "react";
import Chart from "react-apexcharts";
import NavbarSidebarLayout from "../layouts/navbar-sidebar";
import { formatPrice } from "../function/formatPrice";

const DashboardPage: FC = function () {
  return (
    <NavbarSidebarLayout>
      <div className="px-4 pt-6 relative">
        <SalesThisWeek />
        <div className="my-6"></div>
        <LatestCustomers />
        <div className="my-6">
          <AcquisitionOverview />
        </div>
      </div>
    </NavbarSidebarLayout>
  );
};

const SalesThisWeek: FC = function () {
  return (
    <div className="rounded-lg bg-white p-4 shadow dark:bg-gray-800 sm:p-6 xl:p-8">
      <div className="mb-4 flex items-center justify-between">
        <div className="shrink-0">
          <h3 className="text-base font-normal text-gray-600 dark:text-gray-400">
            Thống kê trong tuần
          </h3>
        </div>
        <div className="flex flex-1 items-center justify-end text-base font-bold text-green-600 dark:text-green-400">
          12.5%
          <svg
            className="h-5 w-5"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L6.707 7.707a1 1 0 01-1.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </div>
      <SalesChart />
      <div className="mt-5 flex items-center justify-between border-t border-gray-200 pt-3 dark:border-gray-700 sm:pt-6">
        <div className="shrink-0"></div>
      </div>
    </div>
  );
};

const SalesChart: FC = function () {
  const { mode } = useTheme();
  const isDarkTheme = mode === "dark";

  const borderColor = isDarkTheme ? "#374151" : "#F3F4F6";
  const labelColor = isDarkTheme ? "#93ACAF" : "#6B7280";
  const opacityFrom = isDarkTheme ? 0 : 1;
  const opacityTo = isDarkTheme ? 0 : 1;
  const [value7Days, setValue7Days] = useState<any>([]);
  const [total7Days, setTotal7Days] = useState<any>([]);
  const [change, setChange] = useState(false);
  useEffect(() => {
    setValue7Days(getRecent7Days());
  }, []);

  const getValue = async () => {
    let result = [];
    let tmp = 0;
    const get = async (date: string) => {
      let res = null;
      console.log("date", date);
      if (date != undefined) {
        res = await axios.post("api/v2/order/totalDate", {
          date,
        });
      }

      if (res?.data.total_revenue == null) {
        return 0;
      } else {
        return parseFloat(res.data.total_revenue);
      }
    };

    for (let i = 0; i < 7; i++) {
      tmp = await get(value7Days[i]);
      result.push(tmp);
    }
    return result;
  };

  useEffect(() => {
    const fetchData = async () => {
      const data = await getValue();
      if (data.length > 0) {
        setChange(true);
      }
      setTotal7Days(data);
    };
    fetchData();
  }, [value7Days]);

  function getRecentDays() {
    const today = new Date();
    const recentDays = [];

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const day = String(date.getDate()).padStart(2, "0");

      const formattedDate = `${day} ${getMonthName(date.getMonth())}`;
      recentDays.push(formattedDate);
    }

    return recentDays;
  }
  function getRecent7Days() {
    var result = [];
    var today = new Date();
    for (var i = 6; i >= 0; i--) {
      var day = new Date(today);
      day.setDate(today.getDate() - i);
      var formattedDate = day.toISOString().slice(0, 10);
      result.push(formattedDate);
    }

    return result;
  }

  function getMonthName(monthIndex: number) {
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    return months[monthIndex];
  }

  const options: ApexCharts.ApexOptions = {
    stroke: {
      curve: "smooth",
    },
    chart: {
      type: "area",
      fontFamily: "Inter, sans-serif",
      foreColor: labelColor,
      toolbar: {
        show: false,
      },
    },
    fill: {
      type: "gradient",
      gradient: {
        opacityFrom,
        opacityTo,
        type: "vertical",
      },
    },
    dataLabels: {
      enabled: false,
    },
    tooltip: {
      style: {
        fontSize: "14px",
        fontFamily: "Inter, sans-serif",
      },
    },
    grid: {
      show: true,
      borderColor: borderColor,
      strokeDashArray: 1,
      padding: {
        left: 35,
        bottom: 15,
      },
    },
    markers: {
      size: 5,
      strokeColors: "#ffffff",
      hover: {
        size: undefined,
        sizeOffset: 3,
      },
    },
    xaxis: {
      categories: getRecentDays(),
      labels: {
        style: {
          colors: [labelColor],
          fontSize: "14px",
          fontWeight: 500,
        },
      },
      axisBorder: {
        color: borderColor,
      },
      axisTicks: {
        color: borderColor,
      },
      crosshairs: {
        show: true,
        position: "back",
        stroke: {
          color: borderColor,
          width: 1,
          dashArray: 10,
        },
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: [labelColor],
          fontSize: "14px",
          fontWeight: 500,
        },
        formatter: function (value) {
          return formatPrice(value);
        },
      },
    },
    legend: {
      fontSize: "14px",
      fontWeight: 500,
      fontFamily: "Inter, sans-serif",
      labels: {
        colors: [labelColor],
      },
      itemMargin: {
        horizontal: 10,
      },
    },
    responsive: [
      {
        breakpoint: 1024,
        options: {
          xaxis: {
            labels: {
              show: false,
            },
          },
        },
      },
    ],
  };
  const series = [
    {
      name: "Doanh số",
      data: total7Days,
      color: "#1A56DB",
    },
  ];

  return <Chart height={420} options={options} series={series} type="area" />;
};

const LatestCustomers: FC = function () {
  interface info {
    success: boolean;
    total_revenue: string;
    total_orders: number;
  }
  const [selectDay, setSelectDay] = useState(1);
  const [fromDay, setFromDay] = useState("");
  const [toDay, setToDay] = useState("");
  const [report, setReport] = useState<info>({
    success: true,
    total_revenue: "0",
    total_orders: 0,
  });

  useEffect(() => {
    const handleReport = async function () {
      if (fromDay != "" && toDay != "") {
        const res = await axios.post("/api/v2/order/date-to-date", {
          startDate: fromDay,
          endDate: toDay,
        });

        setReport(res.data);
      }
    };
    handleReport();
  }, [fromDay, toDay]);

  useEffect(() => {
    const getInfo = async (selectDay: number) => {
      if (selectDay == 1) {
        const res = await axios.get("/api/v2/order/get-total-1d");
        setReport(res.data);
      } else if (selectDay == 2) {
        const res = await axios.get("/api/v2/order/get-total-3d");
        setReport(res.data);
      } else if (selectDay == 3) {
        const res = await axios.get("/api/v2/order/get-total-7d");
        setReport(res.data);
      } else {
        const res = await axios.get(
          "http://localhost/WriteResfulAPIPHP/admin/order/total30D.php"
        );
        setReport(res.data);
      }
    };
    getInfo(selectDay);
  }, [selectDay]);

  function convertToCurrencyFormat(amount: number) {
    return amount.toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    });
  }

  return (
    <div className="mb-4 h-full rounded-lg bg-white p-4 shadow dark:bg-gray-800 sm:p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-xl font-bold leading-none text-gray-900 dark:text-white">
          Thống kê chi tiết
        </h3>
      </div>
      <div className="flow-root">
        <div className="flex justify-between items-center mb-5">
          <div className="w-[200px] h-[80px] bg-red-600 text-white rounded p-4">
            <div className="flex items-center gap-2">
              ICON
              <p className="text-sm"> Lượt khách tiếp cận</p>
            </div>
            <p className="text-center">888</p>
          </div>
          <div className="w-[200px] h-[80px] bg-yellow-600 text-white rounded p-4">
            <div className="flex items-center gap-2">
              <MdAdsClick />
              <p className="text-sm">Click xem sản phẩm</p>
            </div>
            <p className="text-center">6000</p>
          </div>
          <div className="w-[200px] h-[80px] bg-green-600 text-white rounded p-4">
            <div className="flex items-center gap-2">
              <FaCartPlus />
              <p className="text-sm">Đơn hàng mới</p>
            </div>
            <p className="text-center">
              {report.total_orders ? report.total_orders : 0}
            </p>
          </div>
          <div className="w-[200px] h-[80px] bg-blue-600 text-white rounded p-4">
            <div className="flex items-center gap-2">
              <IoIosCash />
              <p className="text-sm">Doanh số</p>
            </div>
            <p className="text-center">
              {convertToCurrencyFormat(parseFloat(report.total_revenue))}
            </p>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between border-t border-gray-200 pt-3 dark:border-gray-700 sm:pt-6">
        <div className="shrink-0">
          <div className="flex">
            <div className="mr-10">
              <select
                name=""
                id=""
                className="bring-0 rounded"
                onChange={(e) => {
                  setSelectDay(parseInt(e.target.value));
                }}
              >
                <option value="1" selected>
                  Hôm nay
                </option>
                <option value="2">3 ngày gần nhất</option>
                <option value="3">7 ngày gần nhất</option>
                <option value="4">30 ngày gần nhất</option>
              </select>
            </div>
            <div className="flex gap-4">
              <div className="flex items-center gap-1">
                <label htmlFor="">Từ</label>
                <input
                  type="date"
                  name=""
                  id=""
                  className="bring-0 rounded"
                  onChange={(e) => {
                    setFromDay(e.target.value);
                  }}
                />
              </div>
              <div className="flex items-center gap-1">
                <label htmlFor="">Đến</label>
                <input
                  type="date"
                  name=""
                  id=""
                  className="bring-0 rounded"
                  onChange={(e) => {
                    setToDay(e.target.value);
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const AcquisitionOverview: FC = function () {
  const [top, setTop] = useState([]);
  useEffect(() => {
    const getProduct = async () => {
      const res = await axios.get("api/v2/order/top-selling");
      console.log(res.data);
      setTop(res.data);
    };
    getProduct();
  }, []);
  return (
    <div className="rounded-lg bg-white p-4 shadow dark:bg-gray-800 sm:p-6 xl:p-8">
      <h3 className="mb-6 text-xl font-bold leading-none text-gray-900 dark:text-white">
        Sản phẩm bán chạy nhất
      </h3>
      <div className="flex flex-col">
        <div className="overflow-x-auto rounded-lg">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden shadow sm:rounded-lg">
              <Table className="min-w-full table-fixed">
                <Table.Head>
                  <Table.HeadCell className="whitespace-nowrap rounded-l border-x-0 bg-gray-50 py-3 px-4 text-left align-middle text-xs font-semibold uppercase text-gray-700 dark:bg-gray-700 dark:text-white">
                    Thumbnail
                  </Table.HeadCell>
                  <Table.HeadCell className="whitespace-nowrap border-x-0 bg-gray-50 py-3 px-4 text-left align-middle text-xs font-semibold uppercase text-gray-700 dark:bg-gray-700 dark:text-white">
                    Name
                  </Table.HeadCell>
                  <Table.HeadCell className="min-w-[140px] whitespace-nowrap rounded-r border-x-0 bg-gray-50 py-3 px-4 text-left align-middle text-xs font-semibold uppercase text-gray-700 dark:bg-gray-700 dark:text-white">
                    Top Sale
                  </Table.HeadCell>
                </Table.Head>
                <Table.Body className="divide-y divide-gray-100 dark:divide-gray-700">
                  {top &&
                    top.map((product: any) => (
                      <Table.Row className="text-gray-500 dark:text-gray-400">
                        <Table.Cell className="whitespace-nowrap border-t-0 p-4 text-left align-middle text-sm font-normal">
                          <img className="w-[80px]" src={product.thumbnail} />
                        </Table.Cell>
                        <Table.Cell className="whitespace-nowrap border-t-0 p-4 align-middle text-xs font-medium text-gray-900 dark:text-white">
                          {product.title}
                        </Table.Cell>
                        <Table.Cell className="whitespace-nowrap border-t-0 p-4 align-middle text-xs">
                          <div className="flex items-center">
                            <span className="mr-2 text-md font-medium">
                              Đã bán {product.total_sales}
                            </span>
                          </div>
                        </Table.Cell>
                      </Table.Row>
                    ))}
                </Table.Body>
              </Table>
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between border-t border-gray-200 pt-3 dark:border-gray-700 sm:pt-6">
        <div className="shrink-0"></div>
      </div>
    </div>
  );
};

export default DashboardPage;
