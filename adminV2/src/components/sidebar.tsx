import { Sidebar, TextInput } from "flowbite-react";
import { Button, Modal } from "flowbite-react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import type { FC } from "react";
import { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  HiChartPie,
  HiLogin,
  HiSearch,
  HiShoppingBag,
  HiUsers,
} from "react-icons/hi";
import { AiFillMedicineBox } from "react-icons/ai";
import { FaUserLock } from "react-icons/fa";
import { RiCouponLine } from "react-icons/ri";
import { FaBuilding } from "react-icons/fa";
import { GrStorage } from "react-icons/gr";
import { TfiWrite } from "react-icons/tfi";
import { BiCategory } from "react-icons/bi";
import { GrUserManager } from "react-icons/gr";
import axios from "../config/axios";

import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../store";
import { fetchCurrentAction, fetchPermissionView } from "../Slice/role";

const ExampleSidebar: FC = function () {
  const [currentPage, setCurrentPage] = useState("");

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  useEffect(() => {
    dispatch(fetchPermissionView());
    dispatch(fetchCurrentAction());
  }, []);

  const permissionView = useSelector(
    (state: any) => state.role.actionView.list
  );

  useEffect(() => {
    const newPage = window.location.pathname;

    setCurrentPage(newPage);
  }, [setCurrentPage]);

  const [openModal, setOpenModal] = useState(false);

  const handleLogout = async () => {
    await axios.post("/api/v2/auth/logout");
    localStorage.clear();
    navigate("/authentication/sign-in");
  };

  const initialPermissionView = useRef(permissionView);

  useEffect(() => {
    if (!initialPermissionView.current?.dashboard) {
      const firstAvailablePage = Object.keys(
        initialPermissionView.current
      ).find((key) => initialPermissionView.current[key]);
      if (firstAvailablePage) {
        switch (firstAvailablePage) {
          case "products":
            window.location.href = "/e-commerce/products";
            break;
          case "users":
            window.location.href = "/users/list";
            break;
          case "orders":
            window.location.href = "/orders/list";
            break;
          case "employees":
            window.location.href = "/employee/list";
            break;
          case "authors":
            window.location.href = "/author/list";
            break;
          case "permissions":
            window.location.href = "/permissions/list";
            break;
          case "delivery":
            window.location.href = "/delivery-received";
            break;
          case "company":
            window.location.href = "/company-delivery";
            break;
          case "coupons":
            window.location.href = "/discount";
            break;
          case "category":
            window.location.href = "/category";
            break;
        }
      }
    }
  }, []);

  return (
    <Sidebar aria-label="Sidebar with multi-level dropdown example">
      <div className="flex h-full flex-col justify-between py-2 relative">
        <div>
          <form className="pb-3 md:hidden">
            <TextInput
              icon={HiSearch}
              type="search"
              placeholder="Search"
              required
              size={32}
            />
          </form>

          <Sidebar.Items>
            <Sidebar.ItemGroup>
              {permissionView?.dashboard && (
                <Link to={"/"}>
                  <Sidebar.Item
                    icon={HiChartPie}
                    className={
                      "/" === currentPage ? "bg-gray-100 dark:bg-gray-700" : ""
                    }
                  >
                    Dashboard
                  </Sidebar.Item>
                </Link>
              )}
              {permissionView?.products && (
                <Link to="/e-commerce/products">
                  <Sidebar.Item
                    icon={HiShoppingBag}
                    className={
                      "/e-commerce/products" === currentPage
                        ? "bg-gray-100 dark:bg-gray-700"
                        : ""
                    }
                  >
                    Products
                  </Sidebar.Item>
                </Link>
              )}
              {permissionView?.users && (
                <Link to="/users/list">
                  <Sidebar.Item
                    icon={HiUsers}
                    className={
                      "/users/list" === currentPage
                        ? "bg-gray-100 dark:bg-gray-700"
                        : ""
                    }
                  >
                    Users
                  </Sidebar.Item>
                </Link>
              )}
              {permissionView?.orders && (
                <Link to="/orders/list">
                  <Sidebar.Item
                    icon={AiFillMedicineBox}
                    className={
                      "/orders/list" === currentPage
                        ? "bg-gray-100 dark:bg-gray-700"
                        : ""
                    }
                  >
                    Orders
                  </Sidebar.Item>
                </Link>
              )}
              {permissionView?.employees && (
                <Link to="/employee/list">
                  <Sidebar.Item
                    icon={GrUserManager}
                    className={
                      "/employee/list" === currentPage
                        ? "bg-gray-100 dark:bg-gray-700"
                        : ""
                    }
                  >
                    Employee
                  </Sidebar.Item>
                </Link>
              )}
              {permissionView?.authors && (
                <Link to="/author/list">
                  <Sidebar.Item
                    icon={TfiWrite}
                    className={
                      "/author/list" === currentPage
                        ? "bg-gray-100 dark:bg-gray-700"
                        : ""
                    }
                  >
                    Author
                  </Sidebar.Item>
                </Link>
              )}
              {permissionView?.permissions && (
                <Link to="/permissions/list">
                  <Sidebar.Item
                    icon={FaUserLock}
                    className={
                      "/permissions/list" === currentPage
                        ? "bg-gray-100 dark:bg-gray-700"
                        : ""
                    }
                  >
                    Permissions
                  </Sidebar.Item>
                </Link>
              )}
              {permissionView?.delivery && (
                <Link to="/delivery-received">
                  <Sidebar.Item
                    className={
                      "/delivery-received" === currentPage
                        ? "bg-gray-100 dark:bg-gray-700"
                        : ""
                    }
                    icon={GrStorage}
                  >
                    Delivery & Received
                  </Sidebar.Item>
                </Link>
              )}

              {permissionView?.company && (
                <Link to="/company-delivery">
                  <Sidebar.Item
                    className={
                      "/company-delivery" === currentPage
                        ? "bg-gray-100 dark:bg-gray-700"
                        : ""
                    }
                    icon={FaBuilding}
                  >
                    Company
                  </Sidebar.Item>
                </Link>
              )}
              {permissionView?.coupons && (
                <Link to="/discount">
                  <Sidebar.Item
                    className={
                      "/discount" === currentPage
                        ? "bg-gray-100 dark:bg-gray-700"
                        : ""
                    }
                    icon={RiCouponLine}
                  >
                    Discount
                  </Sidebar.Item>
                </Link>
              )}

              {permissionView?.category && (
                <Link to="/category">
                  <Sidebar.Item
                    className={
                      "/category" === currentPage
                        ? "bg-gray-100 dark:bg-gray-700"
                        : ""
                    }
                    icon={BiCategory}
                  >
                    Category
                  </Sidebar.Item>
                </Link>
              )}

              {localStorage.getItem("token") ? null : (
                <Link to="/authentication/sign-in">
                  <Sidebar.Item icon={HiLogin}>Sign in</Sidebar.Item>
                </Link>
              )}

              {localStorage.getItem("token") ? (
                <Sidebar.Item icon={HiLogin} onClick={() => setOpenModal(true)}>
                  Out
                </Sidebar.Item>
              ) : null}
            </Sidebar.ItemGroup>
          </Sidebar.Items>
        </div>

        <Modal
          show={openModal}
          size="md"
          onClose={() => setOpenModal(false)}
          popup
        >
          <Modal.Header />
          <Modal.Body>
            <div className="text-center">
              <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
              <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                Đăng xuất tài khoản này?
              </h3>
              <div className="flex justify-center gap-4">
                <Button
                  color="failure"
                  onClick={() => {
                    handleLogout();
                  }}
                >
                  {"Yes, I'm sure"}
                </Button>
                <Button color="gray" onClick={() => setOpenModal(false)}>
                  No, cancel
                </Button>
              </div>
            </div>
          </Modal.Body>
        </Modal>
      </div>
    </Sidebar>
  );
};

export default ExampleSidebar;
