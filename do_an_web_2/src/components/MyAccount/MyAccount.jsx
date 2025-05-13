import React, { useState, useEffect, useCallback } from "react";
import { Sidebar, Button, Modal, Accordion, Badge } from "flowbite-react";
import axios from "../../config/configAxios";
import moment from "moment/moment";
import MyToast from "../MyToast/MyToast";
import { rgAddress, rgEmail, rgName, rgPhone } from "../../utils/regex";
// Import ICON
import { IoLocation } from "react-icons/io5";
import { BiSolidCoupon } from "react-icons/bi";
import { IoCheckmarkCircle } from "react-icons/io5";
import { CiEdit } from "react-icons/ci";
import { HiArrowSmLeft, HiUser, HiViewBoards } from "react-icons/hi";
import { Link, useNavigate } from "react-router-dom";

import { FaTachometerAlt } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../Slice/status";
import {
  fetchCouponUser,
  fetchInfoUser,
  fetchOrderUser,
  fetchChangeInfo,
  fetchCancelOrder,
  clearChagneInfo,
  fetchSelectAddress,
  clearSelectAddress,
  clearAddAddress,
  clearEditAddress,
  clearDeleteAddress,
  clearCancelOrder,
  fetchEditAddress,
  fetchDeleteAddress,
  fetchAddAddress,
} from "../../Slice/userSlice";
import { fetchAddressWithId } from "../../Slice/userSlice";
import { formatPrice } from "../../config/formatPrice";
import "./MyAccount.css";
import { handleCopyToClipboard } from "../../config/copyToClipboard";
import { IoIosArrowDown } from "react-icons/io";
import { setShowToast } from "../../Slice/MyToastSlice";
// import FormAddAddress from "./FormAddAddress";
// import RadioAddress from "./RadioAddress";
// import FormEditAddress from "./FromEditAddress";
import { useMyContext } from "../../Context/ContextAPI";
import { ConfirmModal } from "../ConfirmModal/ConfirmModal";
const MyAccount = React.memo(() => {
  const [account, setAccount] = useState(true);
  const [order, setOrder] = useState(false);
  const [address, setAddress] = useState(false);
  const [infoAccount, setInfoAccount] = useState(false);
  const [discount, setDiscount] = useState(false);

  const [addressForm, setAddressForm] = useState(false);
  const [editAddress, setEditAddress] = useState(null);
  const [openEditAddressForm, setOpenEditAddressForm] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [rePass1, setRePass1] = useState("");
  const [rePass2, setRePass2] = useState("");
  const [openModalHistory, setOpenModalHistory] = useState(false);
  const userInfo = useSelector((state) => state.user.information);
  const allOrderUser = useSelector((state) => state.user.order);
  const userCoupon = useSelector((state) => state.user.coupon);
  const userAddress = useSelector((state) => state.user.address);
  const userChangeInfo = useSelector((state) => state.user.changeInfo);
  const selectAddress = useSelector((state) => state.user.selectAddress);
  const addAddress = useSelector((state) => state.user.addAddress);
  const usereditAddress = useSelector((state) => state.user.editAddress);
  const userdeleteAddress = useSelector((state) => state.user.deleteAddress);
  const userCancelOrder = useSelector((state) => state.user.cancelOrder);
  const { setOpenConfirmModal } = useMyContext();
  const [seletedOrder, setSelectedOrder] = useState(null);
  const [idTracking, setIdTracking] = useState(null);
  const [ordertracking, setOrderTracking] = useState(null);
  let navigate = useNavigate();
  const dispatch = useDispatch();
  const handleLogout = () => {
    dispatch(logout());
    // dispatch(clearCart());
    setOpenModal(false);
    navigate("/login");
  };
  useEffect(() => {
    if (account || infoAccount) {
      dispatch(fetchInfoUser());
    }
  }, [account, infoAccount]);
  useEffect(() => {
    if (order) {
      dispatch(fetchOrderUser());
    }
  }, [order]);
  useEffect(() => {
    if (discount) {
      dispatch(fetchCouponUser());
    }
  }, [discount]);
  useEffect(() => {
    if (userInfo.info) {
      setFirstName(userInfo.info.first_name);
      setLastName(userInfo.info.last_name);
      setFullName(userInfo.info.fullname);
    }
  }, [userInfo.info]);
  useEffect(() => {
    if (!userChangeInfo.loading && userChangeInfo.error !== null) {
      setPassword("");
      setRePass1("");
      setRePass2("");
      dispatch(
        setShowToast({
          show: true,
          type: userChangeInfo.error !== 0 ? "error" : "success",
          message: userChangeInfo.message,
        })
      );
      dispatch(clearChagneInfo());
    }
  }, [userChangeInfo.error, userChangeInfo.loading]);
  const handleChangeInfo = () => {
    let rgName =
      /^(?!\s*$)[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểếỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ\s]+$/;
    if (!firstName || !lastName || !fullName) {
      dispatch(
        setShowToast({
          show: true,
          type: "error",
          message: "First name, last name, display name là bắt buộc",
        })
      );
      return;
    }
    if (
      !rgName.test(fullName) ||
      !rgName.test(firstName) ||
      !rgName.test(lastName)
    ) {
      dispatch(
        setShowToast({
          show: true,
          type: "error",
          message:
            "First name, last name, display name không được có kí tự đặc biệt",
        })
      );
      return;
    }
    if (password || rePass1 || rePass2) {
      if (!password || !rePass1 || !rePass2) {
        dispatch(
          setShowToast({
            show: true,
            type: "error",
            message: "Mật khẩu không được để trống",
          })
        );
        return;
      }
      let rgPass = /^(?=.*[A-Z]).{8,}$/;
      if (!rgPass.test(rePass1)) {
        dispatch(
          setShowToast({
            show: true,
            type: "error",
            message:
              "Mật khẩu phải có ít nhất 8 ký tự, trong đó có ít nhất 1 ký tự viết hoa",
          })
        );
        return;
      }
      if (rePass1 !== rePass2) {
        dispatch(
          setShowToast({
            show: true,
            type: "error",
            message: "Mật khẩu không trùng khớp",
          })
        );
        return;
      }
    }
    dispatch(
      fetchChangeInfo({
        firstName,
        lastName,
        fullName,
        password,
        newPassword: rePass1,
        repeatPassword: rePass2,
      })
    );
  };
  useEffect(() => {
    if (addAddress.error === 0) {
      setAddressForm(false);
      dispatch(
        setShowToast({
          show: true,
          message: addAddress.message,
          type: "success",
        })
      );
      dispatch(clearAddAddress());
      dispatch(fetchAddressWithId());
    }
  }, [addAddress.error]);
  useEffect(() => {
    if (usereditAddress.error === 0) {
      setOpenEditAddressForm(false);
      dispatch(
        setShowToast({
          show: true,
          message: usereditAddress.message,
          type: "success",
        })
      );
      dispatch(clearEditAddress());
      dispatch(fetchAddressWithId());
    }
  }, [usereditAddress.error]);
  useEffect(() => {
    if (selectAddress.error !== null) {
      dispatch(
        setShowToast({
          show: true,
          message: selectAddress.message,
          type: selectAddress.error === 1 ? "error" : "success",
        })
      );
      dispatch(clearSelectAddress());
      dispatch(fetchAddressWithId());
    }
  }, [selectAddress.error]);
  useEffect(() => {
    if (userdeleteAddress.error !== null) {
      dispatch(
        setShowToast({
          show: true,
          message: userdeleteAddress.message,
          type: userdeleteAddress.error === 0 ? "success" : "error",
        })
      );
      dispatch(clearDeleteAddress());
      dispatch(fetchAddressWithId());
    }
  }, [userdeleteAddress.error]);
  useEffect(() => {
    if (userCancelOrder.error !== null) {
      dispatch(
        setShowToast({
          show: true,
          message: userCancelOrder.message,
          type: userCancelOrder.error === 0 ? "success" : "error",
        })
      );
      dispatch(clearCancelOrder());
      dispatch(fetchOrderUser());
    }
  }, [userCancelOrder.error]);

  const handleSelectAddress = useCallback((id) => {
    dispatch(fetchSelectAddress(id));
  }, []);
  const setShowFormEditAddress = useCallback((show, item) => {
    setOpenEditAddressForm(show);
    setEditAddress(item);
  }, []);
  const handleComfirmModal = useCallback(() => {
    dispatch(fetchCancelOrder(seletedOrder));
  }, [seletedOrder]);
  const setColor = (status) => {
    switch (status) {
      case 1:
        return "info";
      case 2:
        return "pink";
      case 3:
        return "indigo";
      case 4:
        return "gray";
      case 5:
        return "purple";
      case 6:
        return "success";
      case 7:
        return "failure";
      case 8:
        return "failure";
      case 9:
        return "pink";
      case 10:
        return "success";
      default:
        return "info";
    }
  };

  // Order Tracking
  const selectOrderTracking = (id) => {
    setIdTracking(id);
    setOpenModalHistory(true);
  };

  const getTrackingOrder = async (id) => {
    try {
      const res = await axios.get(`/api/user/tracking-order/${id}`);
      setOrderTracking(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (idTracking) {
      getTrackingOrder(idTracking);
    }
  }, [idTracking]);
  return (
    <div>
      <ConfirmModal
        message="Bạn có chắc chắn muốn hủy đơn hàng này không?"
        handleConfirmModal={handleComfirmModal}
      />
      <div className="breadcrumb bg-[#f4f9fc] h-[110px] py-5 ">
        <div className="flex items-center justify-center">
          <a href="/" className="px-1">
            Trang Chủ
          </a>{" "}
          / <p className="font-medium px-1"> Tài khoản của tôi</p>
        </div>
        <div className="text-3xl font-bold text-center">Tài khoản của tôi</div>
      </div>
      <div className="w-[1170px] m-auto">
        <div className="my-account flex gap-x-[50px] my-[40px]">
          <Sidebar
            aria-label="Default sidebar example"
            className="max-h-[320px]"
          >
            <Sidebar.Items>
              <Sidebar.ItemGroup>
                <Sidebar.Item
                  href="#"
                  icon={FaTachometerAlt}
                  onClick={() => {
                    setAccount(true);
                    setOrder(false);
                    setAddress(false);
                    setInfoAccount(false);
                    setDiscount(false);
                  }}
                >
                  Trang tài khoản
                </Sidebar.Item>
                <Sidebar.Item
                  href="#"
                  icon={HiViewBoards}
                  labelColor="dark"
                  onClick={() => {
                    setOrder(true);
                    setAccount(false);
                    setAddress(false);
                    setInfoAccount(false);
                    setDiscount(false);
                  }}
                >
                  Đơn hàng
                </Sidebar.Item>
                <Sidebar.Item
                  href="#"
                  icon={BiSolidCoupon}
                  onClick={() => {
                    setOrder(false);
                    setAccount(false);
                    setAddress(false);
                    setDiscount(true);
                    setInfoAccount(false);
                  }}
                >
                  Mã giảm giá
                </Sidebar.Item>
                <Sidebar.Item
                  href="#"
                  icon={IoLocation}
                  onClick={() => {
                    setOrder(false);
                    setAccount(false);
                    setAddress(true);
                    setInfoAccount(false);
                    setDiscount(false);
                  }}
                >
                  Địa chỉ
                </Sidebar.Item>
                <Sidebar.Item
                  href="#"
                  icon={HiUser}
                  onClick={() => {
                    setOrder(false);
                    setAccount(false);
                    setAddress(false);
                    setInfoAccount(true);
                    setDiscount(false);
                  }}
                >
                  Tài khoản
                </Sidebar.Item>
                <Sidebar.Item
                  href="#"
                  icon={HiArrowSmLeft}
                  onClick={() => {
                    setOpenModal(true);
                  }}
                >
                  Đăng xuất
                </Sidebar.Item>
              </Sidebar.ItemGroup>
            </Sidebar.Items>
          </Sidebar>
          <Modal show={openModal} onClose={() => setOpenModal(false)}>
            <Modal.Header>Xác nhận đăng xuất</Modal.Header>
            <Modal.Body>
              <div className="space-y-6">
                <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                  Quý khách hàng có chắn chắn muốn đăng xuất không?
                </p>
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button onClick={handleLogout}>Đăng xuất</Button>
              <Button color="gray" onClick={() => setOpenModal(false)}>
                Hủy
              </Button>
            </Modal.Footer>
          </Modal>
          <div className="right ml-10">
            {account && (
              <div>
                <p>
                  Xin chào{" "}
                  <strong>
                    {userInfo.info &&
                      (userInfo.info.fullname || userInfo.info.email)}
                  </strong>{" "}
                  (không phải tài khoản{" "}
                  <strong>
                    {userInfo.info &&
                      (userInfo.info.fullname || userInfo.info.email)}
                  </strong>
                  ? Hãy thoát ra và đăng nhập vào tài khoản của bạn)
                </p>
                <p className="mt-3">
                  Từ trang quản lý tài khoản bạn có thể xem đơn hàng mới, quản
                  lý địa chỉ giao hàng và thanh toán, và sửa mật khẩu và thông
                  tin tài khoản.
                </p>
              </div>
            )}

            {order &&
              (allOrderUser.orders.length <= 0 ? (
                <div className="pt-10">
                  <p className="text-4xl font-extrabold">Orders</p>
                  <div className="flex justify-between items-center border-t-[#fd6e4f] border-t-4 w-full h-[70px] mt-2 bg-[#f7f6f7] p-3">
                    <div className="flex items-center">
                      <IoCheckmarkCircle className="fill-[#fd6e4f]" />
                      <p className="font-thin text-base text-slate-500 ml-2">
                        Bạn chưa có đơn hàng nào.
                      </p>
                    </div>
                    <Link
                      to="/productS"
                      className="h-full w-[200px] bg-orange-500 text-white p-2 font-bold hover:bg-slate-900 duration-200 my-10 text-center"
                    >
                      Đến trang sản phẩm
                    </Link>
                  </div>
                </div>
              ) : (
                <div>
                  <Accordion collapseAll>
                    {allOrderUser.orders.map((order) => (
                      <Accordion.Panel key={order.id}>
                        <Accordion.Title className="flex items-center justify-between">
                          <div>Đơn hàng có mã {order.id}</div>
                          <div>
                            Ngày đặt:{" "}
                            {new Date(order.order_date).toLocaleString(
                              "vi-VN",
                              {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                                second: "2-digit",
                              }
                            )}
                          </div>
                        </Accordion.Title>
                        <Accordion.Content>
                          <div>
                            <div>
                              <div className="flex justify-between">
                                Mã đơn: {order.id}
                                {order.status === 1 && (
                                  <Button
                                    color="failure"
                                    onClick={() => {
                                      setOpenConfirmModal(true);
                                      setSelectedOrder(order.id);
                                    }}
                                  >
                                    Hủy
                                  </Button>
                                )}
                              </div>
                              {order.order_detail.map((product) => (
                                <div
                                  className="flex items-center justify-between "
                                  key={product.id}
                                >
                                  <p className="font-bold">{product.name}</p>
                                  <p>
                                    Đơn giá: {formatPrice(product.unitPrice)}
                                  </p>
                                  <p>x{product.quantity}</p>
                                  <p>
                                    {formatPrice(
                                      (() => {
                                        return (
                                          product.unitPrice * product.quantity
                                        );
                                      })()
                                    )}
                                  </p>
                                </div>
                              ))}
                            </div>
                            <Badge
                              color={setColor(order.status)}
                              className="w-[100px] mt-2 ml-[90%]"
                            >
                              {order.name}
                            </Badge>
                            <button
                              className=" flex items-center justify-center ml-[90%]"
                              onClick={() => {
                                selectOrderTracking(order.id);
                              }}
                            >
                              <p className="text-[#f05252] text-sm">
                                Xem thêm chi tiết
                              </p>
                              <span>
                                <IoIosArrowDown fill="#f05252" />
                              </span>
                            </button>
                            <p className="text-x font-normal mt-5 ml-[70%]">
                              Phí vận chuyển:
                              {" " + formatPrice(order.shipFee)}
                            </p>
                            <p className="text-x font-normal mt-5 ml-[70%]">
                              Được giảm: - {formatPrice(order.discount)}
                            </p>
                            <p className="text-2xl font-normal mt-5 ml-[70%]">
                              Tổng tiền:
                              {" " + formatPrice(order.total_money)}
                            </p>
                          </div>
                        </Accordion.Content>
                      </Accordion.Panel>
                    ))}
                  </Accordion>
                  {
                    <Modal
                      show={openModalHistory}
                      onClose={() => {
                        setOpenModalHistory(false);
                        setIdTracking(null);
                        setOrderTracking(null);
                      }}
                    >
                      <Modal.Header>Theo dõi đơn hàng</Modal.Header>
                      <Modal.Body className="">
                        <div className="flex space-x-4">
                          {ordertracking != null && (
                            <section class="bg-white py-2 antialiased dark:bg-gray-900 ">
                              <div class="mx-auto max-w-screen-xl px-4 2xl:px-0">
                                <h2 class="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl">
                                  Lịch sử theo dõi đơn {ordertracking.id_order}
                                </h2>

                                <div class="mt-6 sm:mt-8 lg:flex lg:gap-8">
                                  <div class="w-[40%] divide-y divide-gray-200 overflow-hidden rounded-lg border border-gray-200 dark:divide-gray-700 dark:border-gray-700 lg:max-w-xl xl:max-w-2xl">
                                    <div class="p-6">
                                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                        Thông tin nhận hàng
                                      </h3>
                                      <div>
                                        <div>
                                          <p>Tên: </p>
                                          <p>{ordertracking.name_user}</p>
                                        </div>
                                        <div>
                                          <p>Số điện thoại: </p>{" "}
                                          <p>{ordertracking.phone_number}</p>
                                        </div>
                                        <div>
                                          <p>Địa chỉ: </p>{" "}
                                          <p>{ordertracking.address}</p>
                                        </div>
                                      </div>
                                    </div>
                                  </div>

                                  <div class="mt-6 grow sm:mt-8 lg:mt-0">
                                    <div class="space-y-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                                      <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
                                        Lịch sử giao hàng
                                      </h3>

                                      <ol class="relative ms-3 border-s border-gray-200 dark:border-gray-700">
                                        {ordertracking?.trackings?.map(
                                          (item) => (
                                            <li
                                              class={`mb-10 ms-6 ${
                                                item.id_status <
                                                  ordertracking?.trackings[0]
                                                    .id_status ||
                                                item.id_status === 10
                                                  ? "text-primary-700 dark:text-primary-500"
                                                  : item.id_status <= 9 &&
                                                    item.id_status >= 7
                                                  ? "text-red-700 dark:text-red-500"
                                                  : ""
                                              }`}
                                            >
                                              {item.id_status <
                                                ordertracking?.trackings[0]
                                                  .id_status ||
                                              item.id_status === 10 ? (
                                                <span class="absolute -start-3 flex h-6 w-6 items-center justify-center rounded-full bg-primary-100 ring-8 ring-white dark:bg-primary-900 dark:ring-gray-800">
                                                  <svg
                                                    class="h-4 w-4"
                                                    aria-hidden="true"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width="24"
                                                    height="24"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                  >
                                                    <path
                                                      stroke="currentColor"
                                                      stroke-linecap="round"
                                                      stroke-linejoin="round"
                                                      stroke-width="2"
                                                      d="M5 11.917 9.724 16.5 19 7.5"
                                                    />
                                                  </svg>
                                                </span>
                                              ) : (
                                                <span class="absolute -start-3 flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 ring-8 ring-white dark:bg-gray-700 dark:ring-gray-800">
                                                  <svg
                                                    class="h-4 w-4 text-gray-500 dark:text-gray-400"
                                                    aria-hidden="true"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width="24"
                                                    height="24"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                  >
                                                    <path
                                                      stroke="currentColor"
                                                      stroke-linecap="round"
                                                      stroke-linejoin="round"
                                                      stroke-width="2"
                                                      d="m4 12 8-8 8 8M6 10.5V19a1 1 0 0 0 1 1h3v-3a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3h3a1 1 0 0 0 1-1v-8.5"
                                                    />
                                                  </svg>
                                                </span>
                                              )}

                                              <h4
                                                class={
                                                  item.id_status <
                                                    ordertracking?.trackings[0]
                                                      .id_status ||
                                                  item.id_status === 10
                                                    ? "mb-0.5 text-base font-semibold"
                                                    : item.id_status <= 9 &&
                                                      item.id_status >= 7
                                                    ? "mb-0.5 text-base font-semibold text-red-900 dark:text-white"
                                                    : "mb-0.5 text-base font-semibold text-gray-900 dark:text-white"
                                                }
                                              >
                                                Lúc{" "}
                                                {moment(item.time).format(
                                                  "hh:mm:ss DD/MM/YYYY"
                                                )}
                                              </h4>
                                              <p
                                                class={
                                                  item.id_status <
                                                    ordertracking?.trackings[0]
                                                      .id_status ||
                                                  item.id_status === 10
                                                    ? "text-sm font-normal"
                                                    : item.id_status <= 9 &&
                                                      item.id_status >= 7
                                                    ? "text-sm font-normal text-red-500 dark:text-gray-400"
                                                    : "text-sm font-normal text-gray-500 dark:text-gray-400"
                                                }
                                              >
                                                {item.name_status}
                                              </p>
                                            </li>
                                          )
                                        )}
                                      </ol>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </section>
                          )}
                        </div>
                      </Modal.Body>
                      <Modal.Footer></Modal.Footer>
                    </Modal>
                  }
                </div>
              ))}

            {discount && (
              <div className="pt-10">
                <p className="text-3xl font-bold">My Coupon</p>
                <p className="font-thin text-base text-slate-500">
                  Mã giảm giá của bạn
                </p>
                <div className="border border-slate-600 p-5 rounded mt-4 grid grid-cols-2 gap-y-5">
                  {userCoupon.coupons.length > 0 ? (
                    userCoupon.coupons.map((item) => {
                      if (Date.parse(item.expiration_date) > Date.now()) {
                        return (
                          <div className="w-[350px] h-[150px] bg-gradient-to-r from-purple-500 to-pink-500 rounded-md relative shadow-lg shadow-pink-400/50 text-center p-[4px]">
                            <div className="absolute ml-[300px] top-0 right-2 z-0">
                              <img
                                width="40"
                                height="40"
                                src="https://cdn-icons-png.flaticon.com/512/9528/9528844.png"
                                alt="discount"
                              />
                            </div>
                            <p className="text-sm text-white mt-1 z-20">
                              Mã giảm giá được áp dụng cho tất cả sản phẩm
                            </p>
                            <p className="text-[20px] mt-1 font-bold">
                              {" "}
                              {item.discount_value} Cho Giá Trị Từ{" "}
                              {formatPrice(item.value_apply)} Đến{" "}
                              {formatPrice(item.max_apply)}
                            </p>
                            <p className="font-semibold">
                              Mã: {item.coupon_code}{" "}
                              <span
                                className="border text-center bg-gray-300 leading-[8px] px-1 cursor-pointer rounded-sm"
                                onClick={() => {
                                  handleCopyToClipboard(item.coupon_code);
                                  dispatch(
                                    setShowToast({
                                      show: true,
                                      message: "Đã copy mã giảm giá",
                                      type: "success",
                                    })
                                  );
                                }}
                              >
                                copy
                              </span>
                            </p>
                            <p className="text-sm">
                              Hạn sử dụng:{" "}
                              {new Date(item.expiration_date).toLocaleString(
                                "vi-VN",
                                {
                                  day: "2-digit",
                                  month: "2-digit",
                                  year: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                  second: "2-digit",
                                }
                              )}
                            </p>
                          </div>
                        );
                      }
                    })
                  ) : (
                    <div>Không có mã giảm giá</div>
                  )}
                </div>
              </div>
            )}

            {address && (
              <div className="pt-10">
                <p className="text-3xl font-bold">My Address</p>
                <p className="font-thin text-base text-slate-500">
                  Địa chỉ này sẽ được làm địa chỉ mặc định để nhận hàng
                </p>
                <button
                  className="text-[#fd6d4f] flex items-center space-x-1"
                  onClick={() => {
                    setAddressForm(true);
                  }}
                >
                  <CiEdit className="fill-[#fd6e4f] " />
                  <span>Thêm</span>
                </button>
                <RadioAddress
                  listAddress={userAddress.list}
                  selectAddress={handleSelectAddress}
                  editAddress={setShowFormEditAddress}
                />
              </div>
            )}
            <FormAddAddress show={addressForm} onClose={setAddressForm} />
            <FormEditAddress
              show={openEditAddressForm}
              onClose={setOpenEditAddressForm}
              address={editAddress}
            />
            {infoAccount && (
              <div className="">
                <div className="flex justify-between items-center">
                  <div className="w-[48%]">
                    <div className="flex mb-1">
                      <label className="font-semibold " htmlFor="first-name">
                        First Name
                      </label>{" "}
                      <span className="inline text-[red]">*</span>
                    </div>
                    <div className="flex gap-x-1 h-[40px] items-center">
                      <input
                        type="text"
                        name=""
                        id="first-name"
                        className="outline-none border w-full my-2 px-2 py-2"
                        value={firstName}
                        onChange={(e) => {
                          setFirstName(e.target.value);
                        }}
                      />
                    </div>
                  </div>
                  <div className="w-[48%]">
                    <div className="flex mb-1">
                      <label className="font-semibold " htmlFor="last-name">
                        Last Name
                      </label>{" "}
                      <span className="inline text-[red]">*</span>
                    </div>
                    <div className="flex gap-x-7 h-[40px] items-center">
                      <input
                        type="text"
                        name=""
                        id="last-name"
                        className="outline-none border w-[100%] my-2 px-2 py-2"
                        value={lastName}
                        onChange={(e) => {
                          setLastName(e.target.value);
                        }}
                      />
                    </div>
                  </div>
                </div>
                <div className="w-full mt-5">
                  <div className="flex mb-1">
                    <label className="font-semibold " htmlFor="first-name">
                      Display Name
                    </label>{" "}
                    <span className="inline text-[red]">*</span>
                  </div>
                  <div className="flex gap-x-1 h-[40px] items-center">
                    <input
                      type="text"
                      name=""
                      id="first-name"
                      className="outline-none border w-full my-2 px-2 py-2"
                      value={fullName}
                      onChange={(e) => {
                        setFullName(e.target.value);
                      }}
                    />
                  </div>
                </div>
                <p className="text-base text-slate-500 font-thin mt-2">
                  Tên này sẽ hiển thị ở trang cá nhân và phần đánh giá sản phẩm
                </p>
                <div className="h-[1px] w-full bg-slate-600 mt-10"></div>
                <div>
                  <p className="text-2xl font-bold mt-3">Password Change</p>
                  <div className="w-full mt-8">
                    <div className="flex mb-1">
                      <label className="font-medium" htmlFor="current-pass">
                        Mật khẩu hiện tại
                      </label>{" "}
                    </div>
                    <div className="flex gap-x-1 h-[40px] items-center">
                      <input
                        type="password"
                        name=""
                        id="current-pass"
                        className="outline-none border w-full my-2 px-2 py-2"
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value);
                        }}
                      />
                    </div>
                  </div>
                  <div className="w-full mt-8">
                    <div className="flex mb-1">
                      <label className="font-medium" htmlFor="new-pass">
                        Mật khẩu mới
                      </label>{" "}
                    </div>
                    <div className="flex gap-x-1 h-[40px] items-center">
                      <input
                        type="password"
                        name=""
                        id="new-pass"
                        className="outline-none border w-full my-2 px-2 py-2"
                        value={rePass1}
                        onChange={(e) => {
                          setRePass1(e.target.value);
                        }}
                      />
                    </div>
                  </div>
                  <div className="w-full mt-8">
                    <div className="flex mb-1">
                      <label className="font-medium" htmlFor="repeat-pass">
                        Nhập lại mật khẩu mới
                      </label>{" "}
                    </div>
                    <div className="flex gap-x-1 h-[40px] items-center">
                      <input
                        type="password"
                        name=""
                        id="repeat-pass"
                        className="outline-none border w-full my-2 px-2 py-2"
                        value={rePass2}
                        onChange={(e) => {
                          setRePass2(e.target.value);
                        }}
                      />
                    </div>
                  </div>
                  <button
                    type="button"
                    className="h-full w-[150px] bg-orange-500 text-white p-2 font-bold hover:bg-slate-900 duration-200 my-10"
                    onClick={handleChangeInfo}
                  >
                    Lưu thay đổi
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});
const RadioAddress = React.memo(
  ({ listAddress, editAddress, selectAddress }) => {
    const handleClick = (event, id) => {
      event.stopPropagation();
      selectAddress(id);
    };
    const dispatch = useDispatch();
    const deleteAddress = (id) => {
      dispatch(fetchDeleteAddress(id));
    };
    return (
      <div className="container-address">
        {listAddress.length <= 0 ? (
          <div>Chưa có địa chỉ</div>
        ) : (
          listAddress[0].addressList.map((item) => {
            return (
              <div className="container-rdo-address" key={item.id}>
                <div
                  className={
                    item.default === "1"
                      ? "radio-address selected"
                      : "radio-address"
                  }
                  onClick={(event) => handleClick(event, item.id)}
                >
                  <div>
                    <div className="name">
                      <span className="font-bold">Tên người nhận: </span>
                      <span>{`${item.firstName} ${item.lastName}`}</span>
                    </div>
                    <div className="phoneNumber">
                      <span className="font-bold">Số điện thoại: </span>
                      <span>{item.phoneNumber}</span>
                    </div>
                    <div className="email">
                      <span className="font-bold">Email: </span>
                      <span>{item.email}</span>
                    </div>
                    <div className="address">
                      <span className="font-bold">Địa chỉ: </span>
                      <span>{`${item.detail}, ${item.ward}, ${item.district}, ${item.province}`}</span>
                    </div>
                  </div>
                  <input
                    className="text-[#fd6d4f]"
                    type="radio"
                    name="address"
                    id={"rdo" + item.id}
                    checked={item.default === "1"}
                    onClick={(event) => {
                      event.stopPropagation();
                      handleClick(event, item.id);
                    }}
                  />
                </div>

                <div className="rdo-address-btn">
                  <button
                    className="btn-edit text-[#fd6d4f]"
                    onClick={() => editAddress(true, item)}
                  >
                    Sửa
                  </button>
                  <button
                    className="btn-delete text-[#fd6d4f]"
                    onClick={() => deleteAddress(item.id)}
                  >
                    Xóa
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    );
  }
);
const FormAddAddress = React.memo(({ show, onClose }) => {
  const [showToast, setShowToast] = React.useState({
    show: false,
    type: null,
    message: "",
  });
  const dispatch = useDispatch();
  const [lastName, setLastName] = React.useState("");
  const [firstName, setFirstName] = React.useState("");
  const [phoneNumber, setPhoneNumber] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [Province, setProvince] = React.useState({
    code: null,
    name: null,
  });
  const [District, setDistrict] = React.useState({
    code: null,
    name: null,
  });
  const [Ward, setWard] = React.useState({
    code: null,
    name: null,
  });
  const [detailAddress, setdetailAddress] = React.useState("");
  const dataProvince = useSelector((state) => state.address.provinces);
  const dataDistrict = useSelector((state) => state.address.districts);
  const dataWards = useSelector((state) => state.address.wards);
  const addAddress = useSelector((state) => state.user.addAddress);
  React.useEffect(() => {
    if (showToast.show) {
      setTimeout(() => {
        setShowToast({
          show: false,
          type: null,
          message: "",
        });
      }, 3000);
    }
  }, [showToast]);
  React.useEffect(() => {
    if (addAddress.error === 1) {
      setShowToast({
        show: true,
        type: "error",
        message: addAddress.message,
      });
      dispatch(clearAddAddress());
      return;
    }
    clearState();
  }, [addAddress.error]);
  const clearState = () => {
    setLastName("");
    setFirstName("");
    setPhoneNumber("");
    setEmail("");
    setProvince({
      code: null,
      name: null,
    });
    setDistrict({
      code: null,
      name: null,
    });
    setWard({
      code: null,
      name: null,
    });
    setdetailAddress("");
  };
  React.useEffect(() => {
    if (Province.code) {
      setDistrict({
        code: null,
        name: null,
      });
    }
  }, [Province.code]);
  React.useEffect(() => {
    if (District.code) {
      setWard({
        code: null,
        name: null,
      });
    }
  }, [District.code]);
  const checkValid = () => {
    if (
      !lastName ||
      !firstName ||
      !phoneNumber ||
      !email ||
      !detailAddress ||
      !detailAddress ||
      !Province.code ||
      !District.code ||
      !Ward.code
    ) {
      return "Vui lòng điền đầy đủ thông tin";
    }
    if (!rgName.test(lastName)) {
      return "Tên không hợp lệ";
    }
    if (!rgName.test(firstName)) {
      return "Họ không hợp lệ";
    }
    if (!rgPhone.test(phoneNumber)) {
      return "Số điện thoại không hợp lệ";
    }
    if (!rgEmail.test(email)) {
      return "Email không hợp lệ";
    }
    if (!rgAddress.test(detailAddress)) {
      return "Địa chỉ không hợp lệ";
    }
    return null;
  };
  const handleAddAddress = () => {
    const valid = checkValid();
    if (valid) {
      setShowToast({
        show: true,
        type: "error",
        message: valid,
      });
      return;
    }
    dispatch(
      fetchAddAddress({
        phone_number: phoneNumber,
        email,
        firstName,
        lastName,
        province: Province.name,
        district: District.name,
        ward: Ward.name,
        detail: detailAddress,
      })
    );
  };
  return (
    <>
      <Modal
        show={show}
        onClose={() => {
          onClose(false);
          clearState();
        }}
      >
        {showToast.show && (
          <MyToast type={showToast.type} message={showToast.message} />
        )}
        <Modal.Header className="border-b border-gray-200 !p-6 dark:border-gray-700">
          <strong>Thêm địa chỉ nhận hàng</strong>
        </Modal.Header>
        <Modal.Body className="p-6 dark:bg-gray-800">
          <div className="p-4">
            <div className="flex gap-x-10 mt-5 justify-between">
              <div>
                <div className="flex gap-x-1">
                  <label htmlFor="name ">Tên </label>
                  <span className="inline text-[red]">*</span>
                </div>
                <input
                  type="text"
                  name=""
                  id="name"
                  placeholder="Nhập tên"
                  className="h-[30px] border-slate-200 focus:ring-0 w-[230px] "
                  onChange={(e) => {
                    setLastName(e.target.value);
                  }}
                  value={lastName}
                  required
                />
              </div>
              <div>
                <div className="flex gap-x-1">
                  <label htmlFor="">Họ</label>
                  <span className="inline text-[red]">*</span>
                </div>
                <input
                  type="text"
                  name=""
                  id="name"
                  placeholder="Nhập họ"
                  className="h-[30px] border-slate-200 focus:ring-0 w-[230px] "
                  onChange={(e) => {
                    setFirstName(e.target.value);
                  }}
                  value={firstName}
                  required
                />
              </div>
            </div>

            <div className="flex gap-x-10 mt-7 justify-between">
              <div>
                <div className="flex gap-x-1">
                  <label htmlFor="name">Số điện thoại</label>
                  <span className="inline text-[red]">*</span>
                </div>
                <input
                  type="text"
                  name=""
                  id="phoneNumber"
                  placeholder="Số điện thoại"
                  className="h-[30px] border-slate-200 focus:ring-0 w-[230px] "
                  onChange={(e) => {
                    setPhoneNumber(e.target.value);
                  }}
                  value={phoneNumber}
                  required
                />
              </div>
              <div>
                <div className="flex gap-x-1">
                  <label htmlFor="email ">Địa chỉ Email</label>
                  <span className="inline text-[red]">*</span>
                </div>
                <input
                  type="text"
                  name=""
                  id="email"
                  placeholder="Địa chỉ Email"
                  className="h-[30px] border-slate-200 focus:ring-0 w-[230px] "
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                  value={email}
                  required
                />
              </div>
            </div>
            <div className="mt-10">
              <div className="flex justify-between gap-x-10">
                <div>
                  <div className="flex gap-x-1">
                    <label htmlFor="city block">Chọn tỉnh thành</label>
                    <span className="inline text-[red]">*</span>
                  </div>
                  <select
                    id="city"
                    onChange={(e) => {
                      const Province = JSON.parse(e.target.value);
                      setProvince(Province);
                    }}
                    className="block h-[40px] border-slate-200 focus:ring-0 w-[230px] mt-1"
                  >
                    <option value="" defaultValue>
                      Chọn tỉnh thành
                    </option>
                    {dataProvince.map((item) => (
                      <option
                        key={item.code}
                        value={JSON.stringify({
                          code: item.code,
                          name: item.name,
                        })}
                      >
                        {item.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <div className="flex gap-x-1">
                    <label htmlFor="district">Chọn quận, huyện</label>
                    <span className="inline text-[red]">*</span>
                  </div>
                  <select
                    id="district"
                    onChange={(e) => {
                      const District = JSON.parse(e.target.value);
                      setDistrict(District);
                    }}
                    className="block h-[40px] border-slate-200 focus:ring-0 w-[230px] mt-1"
                  >
                    <option value="" defaultValue>
                      Chọn quận huyện
                    </option>
                    {Province.code &&
                      dataDistrict.map((item) => {
                        if (item.province_code === Province.code)
                          return (
                            <option
                              key={item.code}
                              value={JSON.stringify({
                                code: item.code,
                                name: item.name,
                              })}
                            >
                              {item.name}
                            </option>
                          );
                      })}
                  </select>
                </div>
              </div>

              <div className="flex justify-between gap-x-10 mt-5">
                <div>
                  <div className="flex gap-x-1">
                    <label htmlFor="ward">Chọn phường, xã</label>
                    <span className="inline text-[red]">*</span>
                  </div>

                  <select
                    id="ward"
                    className="block h-[40px] border-slate-200 focus:ring-0 w-[230px] mt-1"
                    onChange={(e) => {
                      const Ward = JSON.parse(e.target.value);
                      setWard(Ward);
                    }}
                  >
                    <option value="" defaultValue>
                      Chọn phường xã
                    </option>
                    {District.code &&
                      dataWards.map((item) => {
                        if (item.district_code === District.code)
                          return (
                            <option
                              key={item.code}
                              value={JSON.stringify({
                                code: item.code,
                                name: item.name,
                              })}
                            >
                              {item.name}
                            </option>
                          );
                      })}
                  </select>
                </div>
                <div>
                  <div className="flex gap-x-1">
                    <label htmlFor="address">Địa chỉ</label>
                    <span className="inline text-[red]">*</span>
                  </div>

                  <input
                    type="text"
                    name=""
                    id="address"
                    className="block h-[40px] border-slate-200 focus:ring-0 w-[230px] mt-1"
                    placeholder="địa chỉ chi tiết"
                    onChange={(e) => {
                      setdetailAddress(e.target.value);
                    }}
                    value={detailAddress}
                  />
                </div>
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer className="flex justify-end">
          <Button onClick={handleAddAddress}>Thêm</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
});
const FormEditAddress = React.memo(({ show, onClose, address }) => {
  const [showToast, setShowToast] = React.useState({
    show: false,
    type: null,
    message: "",
  });
  const dispatch = useDispatch();
  const [lastName, setLastName] = React.useState("");
  const [firstName, setFirstName] = React.useState("");
  const [phoneNumber, setPhoneNumber] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [Province, setProvince] = React.useState({
    code: null,
    name: null,
  });
  const [District, setDistrict] = React.useState({
    code: null,
    name: null,
  });
  const [Ward, setWard] = React.useState({
    code: null,
    name: null,
  });
  const [detailAddress, setdetailAddress] = React.useState("");
  const dataProvince = useSelector((state) => state.address.provinces);
  const dataDistrict = useSelector((state) => state.address.districts);
  const dataWards = useSelector((state) => state.address.wards);
  const editAddress = useSelector((state) => state.user.editAddress);
  const userAddress = useSelector((state) => state.user.address);
  const [isChange, setIsChange] = React.useState(false);
  React.useEffect(() => {
    if (
      userAddress.list.length > 0 &&
      dataDistrict.length > 0 &&
      dataProvince.length > 0 &&
      dataWards.length > 0 &&
      address
    ) {
      if (address) {
        setLastName(address.lastName);
        setFirstName(address.firstName);
        setPhoneNumber(address.phoneNumber);
        setEmail(address.email);
        const province = dataProvince.find((item) => {
          return item.name === address.province;
        });
        setProvince({
          code: province.code,
          name: province.name,
        });
        const district = dataDistrict.find((item) => {
          return item.name === address.district;
        });
        setDistrict({
          code: district.code,
          name: district.name,
        });
        const ward = dataWards.find((item) => {
          return item.name === address.ward;
        });
        setWard({
          code: ward.code,
          name: ward.name,
        });
        setdetailAddress(address.detail);
      }
    }
  }, [userAddress.list, address]);
  React.useEffect(() => {
    if (showToast.show) {
      setTimeout(() => {
        setShowToast({
          show: false,
          type: null,
          message: "",
        });
      }, 3000);
    }
  }, [showToast]);
  React.useEffect(() => {
    if (editAddress.error === 1) {
      setShowToast({
        show: true,
        type: "error",
        message: editAddress.message,
      });
      dispatch(clearEditAddress());
      return;
    }
  }, [editAddress.error]);
  React.useEffect(() => {
    if (Province.code && isChange) {
      setDistrict({
        code: null,
        name: null,
      });
    }
  }, [Province.code]);
  React.useEffect(() => {
    if (District.code && isChange) {
      setWard({
        code: null,
        name: null,
      });
    }
  }, [District.code]);
  React.useEffect(() => {
    setIsChange(false);
  }, [show]);
  const checkValid = () => {
    if (
      !lastName ||
      !firstName ||
      !phoneNumber ||
      !email ||
      !detailAddress ||
      !Province.code ||
      !District.code ||
      !Ward.code
    ) {
      return "Vui lòng điền đầy đủ thông tin";
    }
    if (!rgName.test(lastName)) {
      return "Tên không hợp lệ";
    }
    if (!rgName.test(firstName)) {
      return "Họ không hợp lệ";
    }
    if (!rgPhone.test(phoneNumber)) {
      return "Số điện thoại không hợp lệ";
    }
    if (!rgEmail.test(email)) {
      return "Email không hợp lệ";
    }
    if (!rgAddress.test(detailAddress)) {
      return "Địa chỉ không hợp lệ";
    }
    return null;
  };
  const handleEditAddress = () => {
    const valid = checkValid();
    if (valid) {
      setShowToast({
        show: true,
        type: "error",
        message: valid,
      });
      return;
    }
    dispatch(
      fetchEditAddress({
        id_address: address.id,
        phone_number: phoneNumber,
        email,
        firstName,
        lastName,
        province: Province.name,
        district: District.name,
        ward: Ward.name,
        detail: detailAddress,
      })
    );
  };
  return (
    <>
      <Modal show={show} onClose={() => onClose(false)}>
        {showToast.show && (
          <MyToast type={showToast.type} message={showToast.message} />
        )}
        <Modal.Header className="border-b border-gray-200 !p-6 dark:border-gray-700">
          <strong>Sửa địa chỉ nhận hàng</strong>
        </Modal.Header>
        <Modal.Body className="p-6 dark:bg-gray-800">
          <div className="p-4">
            <div className="flex gap-x-10 mt-5 justify-between">
              <div>
                <div className="flex gap-x-1">
                  <label htmlFor="name ">Tên </label>
                  <span className="inline text-[red]">*</span>
                </div>
                <input
                  type="text"
                  name=""
                  id="name"
                  placeholder="Nhập tên"
                  className="h-[30px] border-slate-200 focus:ring-0 w-[230px] "
                  onChange={(e) => {
                    setLastName(e.target.value);
                  }}
                  value={lastName}
                  required
                />
              </div>
              <div>
                <div className="flex gap-x-1">
                  <label htmlFor="">Họ</label>
                  <span className="inline text-[red]">*</span>
                </div>
                <input
                  type="text"
                  name=""
                  id="name"
                  placeholder="Nhập họ"
                  className="h-[30px] border-slate-200 focus:ring-0 w-[230px] "
                  onChange={(e) => {
                    setFirstName(e.target.value);
                  }}
                  value={firstName}
                  required
                />
              </div>
            </div>

            <div className="flex gap-x-10 mt-7 justify-between">
              <div>
                <div className="flex gap-x-1">
                  <label htmlFor="name">Số điện thoại</label>
                  <span className="inline text-[red]">*</span>
                </div>
                <input
                  type="text"
                  name=""
                  id="phoneNumber"
                  placeholder="Số điện thoại"
                  className="h-[30px] border-slate-200 focus:ring-0 w-[230px] "
                  onChange={(e) => {
                    setPhoneNumber(e.target.value);
                  }}
                  value={phoneNumber}
                  required
                />
              </div>
              <div>
                <div className="flex gap-x-1">
                  <label htmlFor="email ">Địa chỉ Email</label>
                  <span className="inline text-[red]">*</span>
                </div>
                <input
                  type="text"
                  name=""
                  id="email"
                  placeholder="Địa chỉ Email"
                  className="h-[30px] border-slate-200 focus:ring-0 w-[230px] "
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                  value={email}
                  required
                />
              </div>
            </div>
            <div className="mt-10">
              <div className="flex justify-between gap-x-10">
                <div>
                  <div className="flex gap-x-1">
                    <label htmlFor="city block">Chọn tỉnh thành</label>
                    <span className="inline text-[red]">*</span>
                  </div>
                  <select
                    id="city"
                    onChange={(e) => {
                      const Province = JSON.parse(e.target.value);
                      setProvince(Province);
                      setIsChange(true);
                    }}
                    className="block h-[40px] border-slate-200 focus:ring-0 w-[230px] mt-1"
                  >
                    <option
                      value={JSON.stringify({
                        code: null,
                        name: null,
                      })}
                      defaultValue
                    >
                      Chọn tỉnh thành
                    </option>
                    {address &&
                      dataProvince.map((item) => {
                        return (
                          <option
                            key={item.code}
                            value={JSON.stringify({
                              code: item.code,
                              name: item.name,
                            })}
                            selected={item.name === address.province}
                          >
                            {item.name}
                          </option>
                        );
                      })}
                  </select>
                </div>

                <div>
                  <div className="flex gap-x-1">
                    <label htmlFor="district">Chọn quận, huyện</label>
                    <span className="inline text-[red]">*</span>
                  </div>
                  <select
                    id="district"
                    onChange={(e) => {
                      const District = JSON.parse(e.target.value);
                      setDistrict(District);
                      setIsChange(true);
                    }}
                    className="block h-[40px] border-slate-200 focus:ring-0 w-[230px] mt-1"
                  >
                    <option
                      value={JSON.stringify({
                        code: null,
                        name: null,
                      })}
                      defaultValue
                    >
                      Chọn quận huyện
                    </option>
                    {address &&
                      Province.code &&
                      dataDistrict.map((item) => {
                        if (item.province_code === Province.code)
                          return (
                            <option
                              key={item.code}
                              value={JSON.stringify({
                                code: item.code,
                                name: item.name,
                              })}
                              selected={item.name === address.district}
                            >
                              {item.name}
                            </option>
                          );
                      })}
                  </select>
                </div>
              </div>

              <div className="flex justify-between gap-x-10 mt-5">
                <div>
                  <div className="flex gap-x-1">
                    <label htmlFor="ward">Chọn phường, xã</label>
                    <span className="inline text-[red]">*</span>
                  </div>

                  <select
                    id="ward"
                    className="block h-[40px] border-slate-200 focus:ring-0 w-[230px] mt-1"
                    onChange={(e) => {
                      const Ward = JSON.parse(e.target.value);
                      setWard(Ward);
                    }}
                  >
                    <option
                      value={JSON.stringify({
                        code: null,
                        name: null,
                      })}
                      defaultValue
                    >
                      Chọn phường xã
                    </option>
                    {address &&
                      District.code &&
                      dataWards.map((item) => {
                        if (item.district_code === District.code)
                          return (
                            <option
                              key={item.code}
                              value={JSON.stringify({
                                code: item.code,
                                name: item.name,
                              })}
                              selected={item.name === address.ward}
                            >
                              {item.name}
                            </option>
                          );
                      })}
                  </select>
                </div>
                <div>
                  <div className="flex gap-x-1">
                    <label htmlFor="address">Địa chỉ</label>
                    <span className="inline text-[red]">*</span>
                  </div>

                  <input
                    type="text"
                    name=""
                    id="address"
                    className="block h-[40px] border-slate-200 focus:ring-0 w-[230px] mt-1"
                    placeholder="địa chỉ chi tiết"
                    onChange={(e) => {
                      setdetailAddress(e.target.value);
                    }}
                    value={detailAddress}
                  />
                </div>
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer className="flex justify-end">
          <Button onClick={handleEditAddress}>Sửa</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
});
export default MyAccount;
