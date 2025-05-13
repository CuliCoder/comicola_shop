/* eslint-disable jsx-a11y/anchor-is-valid */
import { Button, Label, Table, Modal, TextInput, Select } from "flowbite-react";
import type { FC } from "react";
import { IoIosSearch } from "react-icons/io";
import NavbarSidebarLayout from "../../layouts/navbar-sidebar";

import { MdDeleteForever } from "react-icons/md";
import { IoAddCircle } from "react-icons/io5";
import { RxUpdate } from "react-icons/rx";
import { useEffect, useState } from "react";
import axios from "../../config/axios";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import checkActionValid from "../../function/checkActionValid";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../store";
import { showToast } from "../../Slice/toast";
import ToastComponent from "../../components/toast";
import { reloadSide } from "../../function/reloadSide";

type Values = {
  name: string;
  discount: number;
  infomation: string;
};
const CompanyDeliveryPage: FC = function () {
  const [openModal, setOpenModal] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const role = useSelector((state: RootState) => state.role.currentAction.list);
  const dispatch = useDispatch();
  const initialValues: Values = { name: "", discount: 0, infomation: "" };

  const validateSchema = Yup.object({
    name: Yup.string()
      .max(255, "Must be 255 characters or less")
      .required("Tên nhà cung cấp không thể bỏ trống"),
    discount: Yup.number().required("Phải điền chiết khấu nhận được"),
    infomation: Yup.string().required(
      "Thêm một tí thông tin gì đó cho nhà cung cấp này"
    ),
  });

  const [suppliers, setSuppliers] = useState([]);
  useEffect(() => {
    const fetch = async () => {
      try {
        const result = await axios.get("/api/v2/company");
        if (result) {
          setSuppliers(result.data);
        }
      } catch (error) {}
    };
    fetch();
  }, []);

  const handleSearch = async () => {
    if (searchValue === "") {
      const result = await axios.get("/api/v2/company");
      if (result) {
        setSuppliers(result.data);
      }
      dispatch(
        showToast({ type: "error", message: "Vui lòng thêm giá trị tìm kiếm" })
      );
    } else {
      axios
        .get(`/api/v2/company-search?search=${searchValue}`)
        .then((res) => {
          if (res.data.code) {
            setSuppliers(res.data.data);
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
    <div>
      <NavbarSidebarLayout isFooter={false}>
        <ToastComponent />
        <div className="block items-center justify-between border-b border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800 sm:flex">
          <div className="mb-1 w-full">
            <div className="mb-4">
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl">
                Suppier Management
              </h1>
            </div>
            <div className="sm:flex sm:justify-between">
              <div className="hidden mb-3 items-center dark:divide-gray-700 sm:mb-0 sm:flex sm:divide-x sm:divide-gray-100 justify-between">
                <div className="flex space-x-[560px]">
                  <div className="flex space-x-5">
                    <div className="lg:pr-3">
                      <Label htmlFor="users-search" className="sr-only">
                        Search
                      </Label>
                      <div className="relative mt-1 lg:w-64 xl:w-96">
                        <TextInput
                          id="users-search"
                          name="users-search"
                          placeholder="Search for delivery"
                          onChange={(e) => setSearchValue(e.target.value)}
                        />
                        <IoIosSearch
                          className="w-8 h-8 absolute top-1 right-2 hover:cursor-pointer"
                          onClick={handleSearch}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="">
                    <Button
                      color="gray"
                      onClick={() => {
                        setOpenModal(true);
                      }}
                      disabled={checkActionValid(role, "company", "create")}
                    >
                      <IoAddCircle className="mr-3 h-4 w-4" />
                      Add
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col">
          <div className="overflow-x-auto">
            <div className="inline-block min-w-full align-middle">
              <div className="overflow-hidden shadow">
                <AllDeliveryTable suppliers={suppliers} />
              </div>
            </div>
          </div>
        </div>
      </NavbarSidebarLayout>
      <Modal
        show={openModal}
        position="center"
        onClose={() => setOpenModal(false)}
      >
        <Modal.Header>Add Supplier</Modal.Header>
        <Modal.Body>
          <Formik
            initialValues={initialValues}
            validationSchema={validateSchema}
            onSubmit={(values, actions) => {
              axios
                .post("/api/v2/company", values)
                .then((res) => {
                  if (res.data.code) {
                    dispatch(
                      showToast({ type: "success", message: res.data.message })
                    );
                    reloadSide();
                  } else {
                    dispatch(
                      showToast({ type: "error", message: res.data.message })
                    );
                  }
                })
                .finally(() => {
                  actions.setSubmitting(false);
                  setOpenModal(false);
                });
            }}
          >
            <Form>
              <div className="mb-5 flex items-center">
                <label htmlFor="name">Name: </label>
                <Field
                  id="name"
                  name="name"
                  placeholder="Name"
                  className="ml-3"
                />
                <ErrorMessage
                  name="name"
                  component="div"
                  className="error text-sm text-red-500 "
                />
              </div>
              <div className="mb-10 flex items-center">
                <label htmlFor="discount">Discount (%):</label>
                <Field
                  id="discount"
                  name="discount"
                  placeholder="discount"
                  className="ml-3"
                />
                <ErrorMessage
                  name="discount"
                  component="div"
                  className="error text-sm text-red-500 "
                />
              </div>
              <div className="mb-10 flex ">
                <label htmlFor="infomation">Infomation</label>
                <Field
                  as="textarea"
                  id="infomation"
                  name="infomation"
                  placeholder="infomation"
                  className="ml-3 w-[300px]"
                />
                <ErrorMessage
                  name="infomation"
                  component="div"
                  className="error text-sm text-red-500 "
                />
              </div>
              <div className="flex">
                <Button type="submit">Submit</Button>
              </div>
            </Form>
          </Formik>
        </Modal.Body>
      </Modal>
    </div>
  );
};

type Suppier = {
  id: number;
  name: string;
  discount: number;
  description: string;
  status: string;
};

type AllDeliveryTableProps = {
  suppliers: Suppier[];
};

const AllDeliveryTable: FC<AllDeliveryTableProps> = function ({ suppliers }) {
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [selectCompany, setSelectCompany] = useState<Suppier | null>(null);
  const [nameCompanyUpdate, setNameCompanyUpdate] = useState<
    string | undefined
  >("");
  const [discountCompanyUpdate, setDiscountCompanyUpdate] = useState<
    number | null
  >(null);
  const [infoCompanyUpdate, setInfoCompanyUpdate] = useState<string>("");
  const [statusCompanyUpdate, setStatusCompanyUpdate] = useState<string>("");
  const role = useSelector((state: RootState) => state.role.currentAction.list);
  const dispatch = useDispatch();

  const isDisabled =
    nameCompanyUpdate === "" &&
    discountCompanyUpdate === null &&
    infoCompanyUpdate === "" &&
    statusCompanyUpdate === "";

  const handleSubmitUpdate = (e: any) => {
    e.preventDefault();
    try {
      const updatedName = nameCompanyUpdate || selectCompany?.name;
      const updatedDiscount = discountCompanyUpdate ?? selectCompany?.discount;
      const updatedInfo = infoCompanyUpdate || selectCompany?.description;
      const updatedStatus = statusCompanyUpdate || selectCompany?.status;

      if (
        updatedName &&
        updatedDiscount !== null &&
        updatedInfo &&
        updatedStatus
      ) {
        axios
          .put("/api/v2/company-update", {
            id: selectCompany?.id,
            name: updatedName,
            discount: updatedDiscount,
            infomation: updatedInfo,
            status: updatedStatus,
          })
          .then((res) => {
            if (res.data.code) {
              dispatch(
                showToast({ type: "success", message: res.data.message })
              );
              reloadSide();
            } else {
              dispatch(showToast({ type: "error", message: res.data.message }));
            }
          })
          .catch((err) => {
            console.log(err);
          })
          .finally(() => {
            setOpenEditModal(false);
            setSelectCompany(null);
            setDiscountCompanyUpdate(null);
            setNameCompanyUpdate("");
            setInfoCompanyUpdate("");
            setStatusCompanyUpdate("");
          });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteCompany = () => {
    axios
      .put(`/api/v2/company-delete`, { id: selectCompany?.id })
      .then((res) => {
        if (res.data.code) {
          dispatch(showToast({ type: "success", message: res.data.message }));
          reloadSide();
        } else {
          dispatch(showToast({ type: "error", message: res.data.message }));
        }
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setOpenDeleteModal(false);
        setSelectCompany(null);
      });
  };
  return (
    <div className="overflow-x-auto relative">
      <Table hoverable>
        <Table.Head>
          <Table.HeadCell>Name Supplier</Table.HeadCell>
          <Table.HeadCell>Discount</Table.HeadCell>
          <Table.HeadCell>Infomation</Table.HeadCell>
          <Table.HeadCell>Status</Table.HeadCell>
          <Table.HeadCell>Action</Table.HeadCell>
        </Table.Head>
        <Table.Body className="divide-y">
          {suppliers.map((suppier: Suppier) => (
            <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
              <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                {suppier.name}
              </Table.Cell>
              <Table.Cell>{suppier.discount}</Table.Cell>
              <Table.Cell>{suppier.description}</Table.Cell>
              <Table.Cell>{suppier.status}</Table.Cell>
              <Table.Cell>
                <Button.Group>
                  <Button
                    color="gray"
                    disabled={checkActionValid(role, "company", "update")}
                    onClick={() => {
                      setOpenEditModal(true);
                      setSelectCompany(suppier);
                    }}
                  >
                    <RxUpdate className="mr-3 h-4 w-4" />
                    Update
                  </Button>
                  <Button
                    color="gray"
                    disabled={checkActionValid(role, "company", "delete")}
                    onClick={() => {
                      setSelectCompany(suppier);
                      setOpenDeleteModal(true);
                    }}
                  >
                    <MdDeleteForever className="mr-3 h-4 w-4" />
                    Remove
                  </Button>
                </Button.Group>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
      {openEditModal && (
        <Modal
          show={openEditModal}
          position="center"
          onClose={() => {
            setOpenEditModal(false);
            setSelectCompany(null);
            setDiscountCompanyUpdate(null);
            setNameCompanyUpdate("");
            setInfoCompanyUpdate("");
            setStatusCompanyUpdate("");
          }}
        >
          <Modal.Header>Edit Supplier</Modal.Header>
          <Modal.Body>
            <form onSubmit={handleSubmitUpdate}>
              <div className="p-5 ">
                <div className="flex">
                  <label htmlFor="name">Name: </label>
                  <input
                    id="name"
                    name="name"
                    placeholder="Name"
                    className="ml-3"
                    defaultValue={selectCompany?.name}
                    onChange={(e) => {
                      setNameCompanyUpdate(e.target.value);
                    }}
                  />
                </div>
                <div className="flex">
                  <label htmlFor="name">Discount(%): </label>

                  <input
                    id="name"
                    name="name"
                    placeholder="Name"
                    className="ml-3 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    type="number"
                    step="0.01"
                    defaultValue={selectCompany?.discount}
                    onChange={(e) => {
                      setDiscountCompanyUpdate(Number(e.target.value));
                    }}
                  />
                </div>
                <div className="flex">
                  <label htmlFor="name">Infomation: </label>
                  <textarea
                    id="name"
                    placeholder="Name"
                    className="ml-3 h-32 w-[400px] max-w-[420px] max-h-44 min-h-[100px]"
                    defaultValue={selectCompany?.description}
                    onChange={(e) => {
                      setInfoCompanyUpdate(e.target.value);
                    }}
                  />
                </div>
                <div className="flex">
                  <label htmlFor="name">Status: </label>
                  <select
                    onChange={(e) => setStatusCompanyUpdate(e.target.value)}
                  >
                    <option
                      value="running"
                      selected={selectCompany?.status === "running"}
                    >
                      Running
                    </option>
                    <option
                      value="stopped"
                      selected={selectCompany?.status === "stopped"}
                    >
                      Stopped
                    </option>
                  </select>
                </div>
                <div className="flex justify-end">
                  <Button
                    type="submit"
                    className=""
                    disabled={isDisabled}
                    title={isDisabled ? "Không có giá trị gì thay đổi" : ""}
                  >
                    Update
                  </Button>
                </div>
              </div>
            </form>
          </Modal.Body>
        </Modal>
      )}

      {openDeleteModal && (
        <Modal
          show={openDeleteModal}
          position="center"
          onClose={() => {
            setOpenEditModal(false);
            setSelectCompany(null);
          }}
        >
          <Modal.Header>Delete Supplier</Modal.Header>
          <Modal.Body>
            <div className="p-5 ">
              <div className="flex justify-center">
                <p>Bạn có chắc chắn muốn xóa nhà cung cấp này không?</p>
              </div>
              <div className="flex justify-center mt-5">
                <Button color="failure" onClick={handleDeleteCompany}>
                  Delete
                </Button>
              </div>
            </div>
          </Modal.Body>
        </Modal>
      )}
    </div>
  );
};

export default CompanyDeliveryPage;
