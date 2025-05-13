/* eslint-disable jsx-a11y/anchor-is-valid */
import {
  Breadcrumb,
  Button,
  Badge,
  Table,
  Label,
  TextInput,
} from "flowbite-react";
import type { FC } from "react";
import { useState, useEffect } from "react";
import { HiHome } from "react-icons/hi";
import NavbarSidebarLayout from "../../layouts/navbar-sidebar";
import axios from "../../config/axios";
import { fetchOrderStatus } from "../../Slice/order_status";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../store";
import checkActionValid from "../../function/checkActionValid";
import { showToast } from "../../Slice/toast";
import ToastComponent from "../../components/toast";
import { CiSearch } from "react-icons/ci";

import moment from "moment";
import { FaSortDown } from "react-icons/fa";
import { reloadSide } from "../../function/reloadSide";

const UserListPage: FC = function () {
  const [orders, setOrders] = useState<Order[]>([]);
  const dispatch = useDispatch<AppDispatch>();
  const [searchValue, setSearchValue] = useState<string>("");

  useEffect(() => {
    dispatch(fetchOrderStatus());
    const getOrders = async () => {
      try {
        const res = await axios.get(
          "/api/v2/order/get-all-order-admin?entity=orders&action=view"
        );
        setOrders(res.data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };
    getOrders();
  }, []);

  const handleGetOrderByStatus = async (status: number) => {
    await axios
      .post("/api/v2/order/get-order-by-status", { status: status })
      .then((res) => {
        setOrders(res.data);
        dispatch(
          showToast({ type: "success", message: "Thay đổi thành công" })
        );
      })
      .catch((error) => {
        console.log(error);
        dispatch(showToast({ type: "error", message: "Thay đổi thất bại" }));
      });
  };

  const handleSearch = async () => {
    if (searchValue === "") {
      const result = await axios.get(
        "/api/v2/order/get-all-order-admin?entity=orders&action=view"
      );
      if (result) {
        setOrders(result.data);
      }
      dispatch(
        showToast({ type: "error", message: "Vui lòng thêm giá trị tìm kiếm" })
      );
    } else {
      axios
        .get(`/api/v2/order-search?search=${searchValue}`)
        .then((res) => {
          if (res.data.code) {
            setOrders(res.data.data);
          } else {
            dispatch(showToast({ type: "error", message: res.data.message }));
          }
        })
        .catch((err) => {
          dispatch(
            showToast({ type: "error", message: "Something went wrong" })
          );
        })
        .finally(() => {
          setSearchValue("");
        });
    }
  };

  return (
    <NavbarSidebarLayout isFooter={false}>
      <ToastComponent />
      <div className="block items-center justify-between border-b border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800 sm:flex">
        <div className="mb-1 w-full">
          <div className="mb-4">
            <Breadcrumb className="mb-4">
              <Breadcrumb.Item href="#">
                <div className="flex items-center gap-x-3">
                  <HiHome className="text-xl" />
                  <span className="dark:text-white">Home</span>
                </div>
              </Breadcrumb.Item>
              <Breadcrumb.Item href="/orders/list">Orders</Breadcrumb.Item>
              <Breadcrumb.Item>List</Breadcrumb.Item>
            </Breadcrumb>
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl">
              All orders
            </h1>
          </div>
          <div className="mb-3 hidden items-center dark:divide-gray-700 sm:mb-0 sm:flex sm:divide-x sm:divide-gray-100">
            <div className="lg:pr-3">
              <Label htmlFor="users-search" className="sr-only">
                Search
              </Label>
              <div className="relative mt-1 lg:w-64 xl:w-96">
                <TextInput
                  id="users-search"
                  name="users-search"
                  placeholder="Search id, name, email, phone"
                  onChange={(e) => setSearchValue(e.target.value)}
                />
              </div>
            </div>
            <div className="mt-3 flex space-x-1 pl-0 sm:mt-0 sm:pl-2">
              <div className="cursor-pointer p-2" onClick={handleSearch}>
                <CiSearch size="30" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden shadow">
              <AllUsersTable
                orders={orders}
                handleGetOrderByStatus={handleGetOrderByStatus}
              />
            </div>
          </div>
        </div>
      </div>
    </NavbarSidebarLayout>
  );
};

type Product = {
  productName: string;
  quantity: number;
  unitPrice: string;
  thumbnail: string;
};
interface Order {
  orderId: string;
  shipFee: number;
  note: string;
  products: Product[];
  total: string;
  orderDate: string;
  status: number;
  employeeId: null | string;
  fullname: string;
  phone_number: string;
  address: string;
}

interface OrderStatus {
  id: number;
  name: string;
}

function convertToCurrencyFormat(amount: number) {
  return amount.toLocaleString("vi-VN", {
    style: "currency",
    currency: "VND",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
}

function Accordion({ order }: { order: Order }) {
  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState(1);
  const dispatch = useDispatch<AppDispatch>();

  const orderStatus: OrderStatus[] = useSelector(
    (state: RootState) => state.order_status.orderStatus.list
  );

  const role = useSelector((state: RootState) => state.role.currentAction.list);

  const selectStatus = (status: number) => {
    const now = orderStatus?.find((s) => s.id === status);
    let tag = { color: "", name: "" };
    switch (now?.id) {
      case 1:
        tag = { color: "info", name: now.name };
        break;
      case 2:
        tag = { color: "pink", name: now.name };
        break;
      case 3:
        tag = { color: "indigo", name: now.name };
        break;
      case 4:
        tag = { color: "gray", name: now.name };
        break;
      case 5:
        tag = { color: "purple", name: now.name };
        break;
      case 6:
        tag = { color: "success", name: now.name };
        break;
      case 7:
        tag = { color: "failure", name: now.name };
        break;
      case 8:
        tag = { color: "failure", name: now.name };
        break;
      case 9:
        tag = { color: "pink", name: now.name };
        break;
      case 10:
        tag = { color: "success", name: now.name };
        break;
      default:
        tag = { color: "info", name: "Lỗi chưa xác định" };
        break;
    }
    return tag;
  };

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };

  const handleChangeStatus = (od: string) => {
    const changeStatus = async (od: string) => {
      const res = await axios.put("/api/v2/order/update-order-status", {
        orderId: parseInt(od),
        status: status,
        entity: "orders",
        action: "update",
      });
      if (res.data.success === true) {
        reloadSide();
      }
      const type = res.data.success ? "success" : "error";
      dispatch(showToast({ type: type, message: res.data.message }));
    };
    changeStatus(od);
  };

  return (
    <div>
      <ToastComponent />
      <div onClick={toggleAccordion}>
        <div className="grid grid-cols-[50px_1fr_1fr_1fr_1fr_1fr] gap-x-[70px] items-left border-2 border-slate-300">
          <div className="whitespace-nowrap p-4 text-sm font-normal text-gray-900 dark:text-white w-4">
            {order.orderId}
          </div>
          <div className="p-4 text-sm font-semibold text-gray-900 dark:text-white  min-w-[300px] text-left">
            {order.products[0]?.productName}
          </div>
          <div className="whitespace-nowrap p-4 text-sm font-semibold text-gray-900 dark:text-white text-left">
            {moment.utc(order.orderDate).format("hh:mm:ss MM/DD/YYYY")}
          </div>
          <div className="whitespace-nowrap p-4 text-sm font-semibold text-gray-900 dark:text-white">
            {convertToCurrencyFormat(parseFloat(order.total) + order.shipFee)}
          </div>

          <div className="flex whitespace-nowrap p-4 justify-start min-w-[120px]">
            <Badge color={selectStatus(order.status).color}>
              {selectStatus(order.status).name}
            </Badge>
          </div>
          <div className="whitespace-nowrap p-4 text-sm font-semibold text-gray-900 dark:text-white">
            {order.employeeId}
          </div>
          <div></div>
        </div>
      </div>

      {isOpen && (
        <div className="mb-5 p-3">
          <div>
            {order.products.map((product) => (
              <div className="flex items-center justify-between my-3">
                <img src={product.thumbnail} alt="" className="w-[80px] " />
                <p className="w-[400px]">{product.productName}</p>
                <span>x{product.quantity}</span>
                <span>
                  {convertToCurrencyFormat(parseFloat(product.unitPrice))}
                </span>
                <span>
                  {convertToCurrencyFormat(
                    product.quantity * parseInt(product.unitPrice)
                  )}{" "}
                </span>
                <div></div>
              </div>
            ))}

            <div className="flex justify-between px-20 ">
              <div></div>
              <div className="flex w-[260px] mb-10">
                <p>Nội dung ghi chú:</p>
                <p>{order.note}</p>
              </div>
            </div>
            <div className="flex justify-between px-20">
              <div></div>
              <div className="flex items-center gap-5">
                <select
                  name=""
                  id=""
                  onChange={(e) => {
                    setStatus(parseInt(e.target.value));
                  }}
                >
                  {orderStatus.length > 0 &&
                    orderStatus.map((item) => (
                      <option
                        value={item.id}
                        selected={order.status == item.id ? true : false}
                        disabled={item.id < order.status ? true : false}
                        className={`${
                          item.id < order.status
                            ? "text-gray-400 cursor-not-allowed"
                            : ""
                        }`}
                      >
                        {item.name}
                      </option>
                    ))}
                </select>
                <Button
                  color="success"
                  onClick={handleChangeStatus.bind(null, order.orderId)}
                  disabled={checkActionValid(role, "orders", "update")}
                >
                  Xác nhận
                </Button>
              </div>
            </div>
            <div className="flex justify-between mt-10 px-20">
              <div>
                <p>Thông tin người đặt:</p>
                <ul>
                  <li>Tên: {order.fullname}</li>
                  <li>Số điện thoại: {order.phone_number}</li>
                  <li>Địa chỉ: {order.address}</li>
                </ul>
              </div>
              <div>
                <div className="flex items-center gap-8">
                  <p>Mã đơn hàng:</p> <span>{order.orderId}</span>{" "}
                </div>
                <div className="flex items-center gap-8">
                  <p>Phương thức giao hàng:</p> <span>COD</span>{" "}
                </div>
                <div className="flex items-center gap-8">
                  <p>Phí Ship:</p>{" "}
                  <span>{convertToCurrencyFormat(order.shipFee)}</span>{" "}
                </div>
                <div className="flex items-center gap-8">
                  <p>Tổng tiền thanh toán:</p>{" "}
                  <span>
                    {convertToCurrencyFormat(parseFloat(order.total))}
                  </span>{" "}
                </div>
                <div className="flex items-center gap-8">
                  <p>Ngày đặt hàng:</p> <span>{order.orderDate}</span>{" "}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const AllUsersTable: FC<{
  orders: Order[];
  handleGetOrderByStatus: (status: number) => void;
}> = function ({ orders, handleGetOrderByStatus }) {
  const [showList, setShowList] = useState(false);
  const orderStatus = useSelector(
    (state: RootState) => state.order_status.orderStatus.list
  );

  return (
    <Table
      striped
      className="min-w-full divide-y divide-gray-200 dark:divide-gray-600"
    >
      <Table.Head className="bg-gray-50 dark:bg-gray-700">
        <Table.HeadCell className="flex justify-between items-center">
          <div>Mã đơn</div> <div>Tên sản phẩm</div>{" "}
          <div className="ml-16">Ngày đặt</div>
          <div className="ml-10">Tổng</div>
          <div
            className="px-4 py-1 flex space-x-2 justify-center items-center relative"
            onClick={() => {
              setShowList(!showList);
            }}
          >
            <p>Trạng thái</p>{" "}
            <span className="flex justify-center items-center mb-2">
              {<FaSortDown size={20} />}
            </span>
            {showList && (
              <ul className="absolute top-8 right-[-170px] bg-white p-3 z-50">
                {orderStatus.length > 0 &&
                  orderStatus.map((item: OrderStatus) => (
                    <li
                      key={item.id}
                      value={item.id}
                      className="text-xs py-1 text-gray-600 hover:cursor-pointer hover:bg-gray-300 hover:text-black"
                      onClick={() => {
                        handleGetOrderByStatus(item.id);
                      }}
                    >
                      {item.name}
                    </li>
                  ))}
              </ul>
            )}
          </div>
          <div>Mã nhân viên</div>
        </Table.HeadCell>
      </Table.Head>

      <Table.Body className="bg-white dark:bg-gray-800 min-h-[00px]">
        <div className="min-h-[400px]">
          {orders.length > 0 ? (
            orders.map((order) => <Accordion order={order} />)
          ) : (
            <div className="flex justify-center">
              <p className="text-2xl">Empty</p>
            </div>
          )}
        </div>
      </Table.Body>
    </Table>
  );
};

export default UserListPage;
