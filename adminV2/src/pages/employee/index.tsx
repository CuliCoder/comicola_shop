/* eslint-disable jsx-a11y/anchor-is-valid */
import {
  Breadcrumb,
  Button,
  Label,
  Modal,
  Table,
  TextInput,
} from "flowbite-react";
import type { FC } from "react";
import { useState, useEffect } from "react";
import { HiHome, HiOutlineExclamationCircle, HiPlus } from "react-icons/hi";
import NavbarSidebarLayout from "../../layouts/navbar-sidebar";
import axios from "../../config/axios";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import checkActionValid from "../../function/checkActionValid";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { CiSearch } from "react-icons/ci";
import ToastComponent from "../../components/toast";
import { useDispatch } from "react-redux";
import { showToast } from "../../Slice/toast";
import { useNavigate } from "react-router";
import React from "react";

interface Employee {
  id: number;
  role_id: number;
  role_name: string;
  address: string;
  fullname: string;
  phone_number: string;
  email: string;
  status: number;
}

type Role = {
  id: number;
  name: string;
};

type VoidFunction = () => void;

const EmployeeListPage: FC = function () {
  const [allUsers, setAllUsers] = useState<Employee[]>([]);
  const [search, setSearch] = useState("");
  useEffect(() => {
    const getAllUsers = async () => {
      const res = await axios.get("/api/v2/employee");
      setAllUsers(res.data);
    };
    getAllUsers();
  }, []);
  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (search === "") {
        const res = await axios.get("/api/v2/employee");
        setAllUsers(res.data);
        return;
      }
      const res = await axios.get(`/api/v2/employee-search?search=${search}`);
      setAllUsers(res.data);
    } catch (error) {
      setAllUsers([]);
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
              <Breadcrumb.Item href="/users/list">Employees</Breadcrumb.Item>
              <Breadcrumb.Item>List</Breadcrumb.Item>
            </Breadcrumb>
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl">
              All employees
            </h1>
          </div>
          <div className="sm:flex">
            <div className="mb-3 hidden items-center dark:divide-gray-700 sm:mb-0 sm:flex sm:divide-x sm:divide-gray-100">
              <form className="lg:pr-3" onSubmit={handleSearch}>
                <Label htmlFor="users-search" className="sr-only">
                  Search
                </Label>
                <div className="relative mt-1 lg:w-64 xl:w-96">
                  <TextInput
                    id="users-search"
                    name="users-search"
                    placeholder="Search for employees"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
                <div className="mt-3 flex space-x-1 pl-0 sm:mt-0 sm:pl-2">
                  <button className="cursor-pointer p-2" type="submit">
                    <CiSearch size="30" />
                  </button>
                </div>
              </form>
            </div>
            <div className="ml-auto flex items-center space-x-2 sm:space-x-3">
              <AddEmployeeModal />
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden shadow">
              <MemoizedUsersTable allUsers={allUsers} />
            </div>
          </div>
        </div>
      </div>
    </NavbarSidebarLayout>
  );
};

const AddEmployeeModal: FC = function () {
  const role = useSelector((state: RootState) => state.role.currentAction.list);
  const Schema = Yup.object().shape({
    fullname: Yup.string()
      .trim()
      .min(2, "Quá ngắn!")
      .max(70, "Quá dài!")
      .required("Không được bỏ trống"),
    email: Yup.string()
      .trim()
      .matches(
        /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
        "Email không đúng định dạng"
      )
      .email("Email không hợp lệ")
      .required("Email không được bỏ trống"),
    password: Yup.string()
      .min(6, "Độ dài mật khẩu tối thiểu là 6 kí tự")
      .required("Password không được bỏ trống"),
    phone_number: Yup.string()
      .min(10, "Độ dài của số điện thoại tối thiểu 10 số")
      .max(11, "Độ dài của số điện thoại tối đa 11 số")
      .matches(/(84|0[3|5|7|8|9])+([0-9]{8})\b/g, "Số điện thoại không hợp lệ")
      .required("Số điện thoại không được bỏ trống"),
    address: Yup.string().required("Địa chỉ không được bỏ trống"),
  });
  const [isOpen, setOpen] = useState(false);
  const [roles, setRoles] = useState([]);
  const [roleValue, setRoleValue] = useState("0");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const fetch = async () => {
      const res = await axios.get("/api/v2/role");
      if (res) {
        setRoles(res.data);
      } else {
        console.log("co loi khi dung useEffect get role");
      }
    };
    fetch();
  }, []);

  const isDisabled: boolean = roleValue == "0" ? true : false;

  return (
    <>
      <Button
        color="primary"
        onClick={() => setOpen(true)}
        disabled={checkActionValid(role, "employees", "create")}
      >
        <div className="flex items-center gap-x-3">
          <HiPlus className="text-xl" />
          Add Employee
        </div>
      </Button>
      <Modal onClose={() => setOpen(false)} show={isOpen}>
        <Modal.Header className="border-b border-gray-200 !p-6 dark:border-gray-700">
          <strong>Add new employee</strong>
        </Modal.Header>
        <Modal.Body>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <Formik
              initialValues={{
                fullname: "",
                email: "",
                password: "",
                phone_number: "",
                address: "",
              }}
              validationSchema={Schema}
              onSubmit={(values) => {
                if (roleValue == "0") {
                  console.log("ban chua chon role");
                  return;
                }
                axios
                  .post("/api/v2/auth/register", {
                    value: { ...values, role: roleValue },
                  })
                  .then((res) => {
                    if (res.data.code) {
                      dispatch(
                        showToast({
                          type: "success",
                          message: res.data.message,
                        })
                      );
                      navigate(0);
                    } else {
                      dispatch(
                        showToast({ type: "error", message: res.data.message })
                      );
                    }
                  })
                  .catch((error) => {
                    console.error(error);
                  })
                  .finally(() => {
                    setOpen(false);
                  });
              }}
            >
              {({ errors, touched }) => (
                <Form>
                  <div className="flex space-x-5 mb-5">
                    <div>
                      <Label htmlFor="fullname">Full Name</Label>
                      <Field
                        name="fullname"
                        placeholder="..."
                        className="pr-2"
                        type="text"
                      />
                      {errors.fullname && touched.fullname ? (
                        <div className="text-red-400 text-sm">
                          {errors.fullname}
                        </div>
                      ) : null}
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Field name="email" type="text" />
                      {errors.email && touched.email ? (
                        <div className="text-red-400 text-sm">
                          {errors.email}
                        </div>
                      ) : null}
                    </div>
                  </div>

                  <div className="flex space-x-5 mb-5">
                    <div>
                      <Label htmlFor="phone_number">Phone</Label>
                      <Field name="phone_number" type="text" />
                      {errors.phone_number && touched.phone_number ? (
                        <div className="text-red-400 text-sm">
                          {errors.phone_number}
                        </div>
                      ) : null}
                    </div>
                    <div>
                      <Label htmlFor="address">Address</Label>
                      <Field name="address" type="text" />
                      {errors.address && touched.address ? (
                        <div className="text-red-400 text-sm">
                          {errors.address}
                        </div>
                      ) : null}
                    </div>
                  </div>

                  <div className="flex space-x-5 mb-5">
                    <div className="">
                      <Label htmlFor="role">Role</Label>
                      <div className="mt-1">
                        <select
                          name="role"
                          id="role"
                          className="w-[240px]"
                          onChange={(e) => {
                            setRoleValue(e.target.value);
                          }}
                        >
                          <option value="0" selected>
                            Select role
                          </option>
                          {roles.map((role: Role) => (
                            <option value={role.id}>{role.name}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="password">Password</Label>
                      <Field name="password" type="text" />
                      {errors.password && touched.password ? (
                        <div className="text-red-400 text-sm">
                          {errors.password}
                        </div>
                      ) : (
                        <div></div>
                      )}
                    </div>
                  </div>
                  <Button
                    type="submit"
                    color="primary"
                    disabled={isDisabled}
                    title={isDisabled ? " Role chưa được chọn" : ""}
                  >
                    Add employee
                  </Button>
                </Form>
              )}
            </Formik>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

const AllUsersTable: FC<{ allUsers: Employee[] }> = function ({ allUsers }) {
  const role = useSelector((state: RootState) => state.role.currentAction.list);
  const [employeeSelected, setEmployeeSelected] = useState<Employee | null>(
    null
  );
  const [isOpenEditModal, setIsOpenEditModal] = useState(false);
  const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false);

  const openEditModal = (employee: Employee) => {
    setEmployeeSelected(employee);
    setIsOpenEditModal(true);
  };

  const openDeleteModal = (employee: Employee) => {
    setEmployeeSelected(employee);
    setIsOpenDeleteModal(true);
  };

  const closeEditModal = () => {
    setEmployeeSelected(null);
    setIsOpenEditModal(false);
  };

  const closeDeleteModal = () => {
    setEmployeeSelected(null);
    setIsOpenDeleteModal(false);
  };
  return (
    <div>
      <Table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
        <Table.Head className="bg-gray-100 dark:bg-gray-700">
          <Table.HeadCell>Name</Table.HeadCell>
          <Table.HeadCell>Role</Table.HeadCell>
          <Table.HeadCell>Phone</Table.HeadCell>
          <Table.HeadCell>Status</Table.HeadCell>
          <Table.HeadCell>Actions</Table.HeadCell>
        </Table.Head>
        <Table.Body className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
          {allUsers.map((employee: Employee) => (
            <Table.Row className="hover:bg-gray-100 dark:hover:bg-gray-700">
              <Table.Cell className="mr-12 flex items-center space-x-6 whitespace-nowrap p-4 lg:mr-0">
                <img
                  className="h-10 w-10 rounded-full"
                  src="/images/users/neil-sims.png"
                  alt="Neil Sims avatar"
                />

                <div className="text-sm font-normal text-gray-500 dark:text-gray-400">
                  <div className="text-base font-semibold text-gray-900 dark:text-white max-w-[200px]">
                    {employee.fullname}
                  </div>
                  <div className="text-sm font-normal text-gray-500 dark:text-gray-400">
                    {employee.email}
                  </div>
                </div>
              </Table.Cell>
              <Table.Cell className="whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white">
                {employee.role_name}
              </Table.Cell>
              <Table.Cell className="whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white">
                {employee.phone_number}
              </Table.Cell>
              <Table.Cell className="whitespace-nowrap p-4 text-base font-normal text-gray-900 dark:text-white">
                {employee.status == 1 ? (
                  <div className="flex items-center">
                    <div className="mr-2 h-2.5 w-2.5 rounded-full bg-green-400"></div>{" "}
                    Active
                  </div>
                ) : (
                  <div className="flex items-center">
                    <div className="mr-2 h-2.5 w-2.5 rounded-full bg-red-500"></div>{" "}
                    Offline
                  </div>
                )}
              </Table.Cell>
              <Table.Cell>
                <div className="flex items-center gap-x-3 whitespace-nowrap">
                  <Button
                    onClick={() => {
                      openEditModal(employee);
                    }}
                    disabled={checkActionValid(role, "employees", "update")}
                  >
                    Edit
                  </Button>
                  <Button
                    color="failure"
                    onClick={() => openDeleteModal(employee)}
                    disabled={checkActionValid(role, "employees", "delete")}
                  >
                    Delete
                  </Button>
                </div>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>

      {isOpenEditModal && (
        <EditUserModal employee={employeeSelected} onClose={closeEditModal} />
      )}
      {isOpenDeleteModal && (
        <DeleteUserModal
          employee={employeeSelected}
          onClose={closeDeleteModal}
        />
      )}
    </div>
  );
};
const MemoizedUsersTable = React.memo(AllUsersTable);
const EditUserModal: FC<{ employee: Employee | null; onClose: VoidFunction }> =
  function (props): JSX.Element {
    const [isOpen, setOpen] = useState(true);
    const [roles, setRoles] = useState([]);
    const [roleValue, setRoleValue] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const Schema = Yup.object().shape({
      fullname: Yup.string()
        .trim()
        .min(2, "Quá ngắn!")
        .max(70, "Quá dài!")
        .required("Không được bỏ trống"),
      password: Yup.string()
        .min(6, "Độ dài mật khẩu tối thiểu là 6 kí tự")
        .required("Password không được bỏ trống"),
      phone_number: Yup.string()
        .min(10, "Độ dài của số điện thoại tối thiểu 10 số")
        .max(11, "Độ dài của số điện thoại tối đa 11 số")
        .matches(
          /(84|0[3|5|7|8|9])+([0-9]{8})\b/g,
          "Số điện thoại không hợp lệ"
        )
        .required("Số điện thoại không được bỏ trống"),
      address: Yup.string().required("Địa chỉ không được bỏ trống"),
    });

    useEffect(() => {
      const fetch = async () => {
        const res = await axios.get("/api/v2/role");
        if (res) {
          setRoles(res.data);
        } else {
          console.log("co loi khi dung useEffect get role");
        }
      };
      fetch();
    }, []);

    const initialValues = {
      fullname: props.employee?.fullname,
      email: props.employee?.email,
      password: "",
      phone_number: props.employee?.phone_number,
      address: props.employee?.address,
    };
    let isDisabled: boolean = false;
    const disabledReason: string = "Password không được bỏ trống";

    return (
      <>
        <Modal onClose={props.onClose} show={isOpen}>
          <Modal.Header className="border-b border-gray-200 !p-6 dark:border-gray-700">
            <strong>Edit employee</strong>
          </Modal.Header>
          <Modal.Body>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <Formik
                enableReinitiallize
                initialValues={initialValues}
                validationSchema={Schema}
                onSubmit={(values) => {
                  axios
                    .post("/api/v2/edit-employee", {
                      value: {
                        ...values,
                        role: roleValue,
                        id: props.employee?.id,
                      },
                    })
                    .then((res) => {
                      if (res.data.code) {
                        dispatch(
                          showToast({
                            type: "success",
                            message: res.data.message,
                          })
                        );
                        navigate(0);
                      } else {
                        dispatch(
                          showToast({
                            type: "error",
                            message: res.data.message,
                          })
                        );
                      }
                    })
                    .catch((error) => {
                      console.error(error);
                    })
                    .finally(() => {
                      setOpen(false);
                    });
                }}
              >
                {({ errors, touched }) => (
                  <Form>
                    <div className="flex space-x-5 mb-5">
                      <div>
                        <Label htmlFor="fullname">Full Name</Label>
                        <Field
                          name="fullname"
                          placeholder=""
                          className="pr-2"
                          type="text"
                        />
                        {errors.fullname && touched.fullname ? (
                          <div className="text-red-400 text-sm">
                            {errors.fullname}
                          </div>
                        ) : null}
                      </div>
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Field
                          name="email"
                          type="text"
                          value={initialValues.email}
                          disabled
                        />
                        {errors.email && touched.email ? (
                          <div className="text-red-400 text-sm">
                            {errors.email}
                          </div>
                        ) : null}
                      </div>
                    </div>

                    <div className="flex space-x-5 mb-5">
                      <div>
                        <Label htmlFor="phone_number">Phone</Label>
                        <Field
                          name="phone_number"
                          type="number"
                          class="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        />
                        {errors.phone_number && touched.phone_number ? (
                          <div className="text-red-400 text-sm">
                            {errors.phone_number}
                          </div>
                        ) : null}
                      </div>
                      <div>
                        <Label htmlFor="address">Address</Label>
                        <Field name="address" type="text" />
                        {errors.address && touched.address ? (
                          <div className="text-red-400 text-sm">
                            {errors.address}
                          </div>
                        ) : null}
                      </div>
                    </div>

                    <div className="flex space-x-3 mb-5">
                      <div>
                        <Label htmlFor="role">Role</Label>
                        <div className="mt-1">
                          <select
                            name="role"
                            id="role"
                            className="w-[230px]"
                            onChange={(e) => {
                              setRoleValue(e.target.value);
                            }}
                          >
                            {roles.map((role: Role) => (
                              <option
                                value={role.id}
                                selected={
                                  role.id == props.employee?.role_id
                                    ? true
                                    : false
                                }
                              >
                                {role.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="password">Password</Label>
                        <Field name="password" type="text" />
                        {errors.password && touched.password ? (
                          <div className="text-red-400 text-sm">
                            {errors.password}
                          </div>
                        ) : (
                          <div></div>
                        )}
                      </div>
                    </div>
                    <Button
                      type="submit"
                      color="primary"
                      disabled={errors.password ? true : false}
                      title={isDisabled ? disabledReason : ""}
                    >
                      Finish
                    </Button>
                  </Form>
                )}
              </Formik>
            </div>
          </Modal.Body>
        </Modal>
      </>
    );
  };

const DeleteUserModal: FC<{
  employee: Employee | null;
  onClose: VoidFunction;
}> = function (props): JSX.Element {
  const [isOpen, setOpen] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleDeleteUser = (userId: number) => {
    const sendRequest = async () => {
      const res = await axios.put(`/api/v2/employee?id=${userId}`);
      if (res.data.code) {
        dispatch(
          showToast({
            type: "success",
            message: res.data.message,
          })
        );
        navigate(0);
      } else {
        dispatch(
          showToast({
            type: "error",
            message: res.data.message,
          })
        );
      }
      setOpen(false);
    };
    sendRequest();
  };

  return (
    <>
      <Modal onClose={props.onClose} show={isOpen} size="md">
        <Modal.Header className="px-6 pt-6 pb-0">
          <span className="sr-only">Delete employee</span>
        </Modal.Header>
        <Modal.Body className="px-6 pt-0 pb-6">
          <div className="flex flex-col items-center gap-y-6 text-center">
            <HiOutlineExclamationCircle className="text-7xl text-red-500" />
            <p className="text-xl text-gray-500">
              Are you sure you want to delete this employee?
            </p>
            <div className="flex items-center gap-x-3">
              <Button
                color="failure"
                onClick={() => {
                  if (props.employee) {
                    handleDeleteUser(props.employee.id);
                    setOpen(false);
                  }
                }}
              >
                Yes, I'm sure
              </Button>
              <Button color="gray" onClick={() => setOpen(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default EmployeeListPage;
