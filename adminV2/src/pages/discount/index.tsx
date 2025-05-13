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
import { FaDropbox } from "react-icons/fa";
import ToastComponent from "../../components/toast";
import { convertDate } from "../../function/convertDate";
import { formatPrice } from "../../function/formatPrice";
import { reloadSide } from "../../function/reloadSide";

type Values = {
  coupon_code: string;
  discount_value: number;
  value_apply: number;
  max_apply: number;
  expiration_date: string;
};
const DiscountPage: FC = function () {
  const [discounts, setDiscounts] = useState([]);
  useEffect(() => {
    const fetch = async () => {
      try {
        const result = await axios.get("/api/v2/discount");
        if (result) {
          setDiscounts(result.data.data);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetch();
  }, []);
  const [openModal, setOpenModal] = useState(false);
  const [searchValue, setSearchValue] = useState<string>("");
  const role = useSelector((state: RootState) => state.role.currentAction.list);
  const dispatch = useDispatch();
  const initialValues: Values = {
    coupon_code: "",
    discount_value: 0,
    value_apply: 10000,
    max_apply: 200000,
    expiration_date: "",
  };

  const handleSearch = async () => {
    if (searchValue === "") {
      const result = await axios.get("/api/v2/discount");
      if (result) {
        setDiscounts(result.data.data);
      }
      dispatch(
        showToast({ type: "error", message: "Vui lòng thêm giá trị tìm kiếm" })
      );
    } else {
      axios
        .get(`/api/v2/discount-search?search=${searchValue}`)
        .then((res) => {
          if (res.data.code) {
            setDiscounts(res.data.data);
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

  const validateSchema = Yup.object({
    coupon_code: Yup.string()
      .max(20, "Mã giảm giá không được quá 20 ký tự")
      .required("Phải điền mã giảm giá"),
    discount_value: Yup.number()
      .min(1, "Giá trị không được nhỏ hơn 1")
      .max(100, "100% là giá trị tối đa")
      .required("Phải điền chiết khấu nhận được"),

    value_apply: Yup.number()
      .min(10000, "Giá trị áp dụng phải lớn hơn hoặc bằng 10000")
      .required("Phải điền giá trị áp dụng cho mã giảm giá")
      .test(
        "is-less-than-max-apply",
        "Giá trị áp dụng phải nhỏ hơn giá trị tối đa",
        function (value) {
          return value < this.parent.max_apply;
        }
      ),
    max_apply: Yup.number()
      .min(50000, "Giá trị áp dụng tối đa phải nhỏ hơn hoặc bằng 50000")
      .required("Phải điền giá trị áp dụng tối thiểu"),
    expiration_date: Yup.date().required("Phải chọn ngày hết hạn"),
  });

  return (
    <div>
      <NavbarSidebarLayout isFooter={false}>
        <ToastComponent />
        <div className="block items-center justify-between border-b border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800 sm:flex">
          <div className="mb-1 w-full">
            <div className="mb-4">
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl">
                Discount Management
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
                          placeholder="Search for discount"
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
                      disabled={checkActionValid(role, "coupons", "create")}
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
                <AllCouponTable discounts={discounts} />
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
        <Modal.Header>Add Coupon</Modal.Header>
        <Modal.Body className="w-[900px]">
          <Formik
            initialValues={initialValues}
            validationSchema={validateSchema}
            onSubmit={(values, actions) => {
              axios
                .post("/api/v2/discount", values)
                .then((res) => {
                  if (res.data.code) {
                    dispatch(
                      showToast({ type: "success", message: res.data.message })
                    );
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
              <div className="mb-5">
                <div className="flex items-center">
                  <label htmlFor="coupon_code">Discount Code: </label>
                  <Field
                    id="coupon_code"
                    name="coupon_code"
                    placeholder="Code"
                    className="ml-3"
                  />
                </div>

                <ErrorMessage
                  name="coupon_code"
                  component="div"
                  className="error text-sm text-red-500 "
                />
              </div>
              <div className="mb-1r mb-5">
                <div className="flex items-center">
                  <label htmlFor="discount_value">Discount (%):</label>
                  <Field
                    id="discount_value"
                    name="discount_value"
                    placeholder="discount"
                    className="ml-3"
                  />
                </div>

                <ErrorMessage
                  name="discount_value"
                  component="div"
                  className="error text-sm text-red-500 "
                />
              </div>
              <div className="mb-1r mb-5">
                <div className="flex items-center">
                  <label htmlFor="value_apply">Value Apply:</label>
                  <Field
                    id="value_apply"
                    name="value_apply"
                    placeholder="Value Apply"
                    className="ml-3"
                  />
                </div>

                <ErrorMessage
                  name="value_apply"
                  component="div"
                  className="error text-sm text-red-500 "
                />
              </div>
              <div className="mb-1r mb-5">
                <div className="flex items-center">
                  <label htmlFor="max_apply">Max Value Apply:</label>
                  <Field
                    id="max_apply"
                    name="max_apply"
                    placeholder="Max Value Apply"
                    className="ml-3"
                  />
                </div>

                <ErrorMessage
                  name="max_apply"
                  component="div"
                  className="error text-sm text-red-500 "
                />
              </div>
              <div className="mb-1r mb-5">
                <div className="flex items-center">
                  <label htmlFor="expiration_date">Expiration Date:</label>
                  <Field
                    id="expiration_date"
                    name="expiration_date"
                    type="date"
                    className="ml-3"
                    min={new Date().toISOString().split("T")[0]}
                  />
                </div>

                <ErrorMessage
                  name="expiration_date"
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

type Discount = {
  id: number;
  coupon_code: string;
  discount_value: number;
  expiration_date: string;
  value_apply: string;
  dropTime: string;
};

type AllCouponTableProps = {
  discounts: Discount[];
};

const AllCouponTable: FC<AllCouponTableProps> = function ({ discounts }) {
  const role = useSelector((state: RootState) => state.role.currentAction.list);
  const [selectDelete, setSelectDelete] = useState<number | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const dispatch = useDispatch();

  return (
    <>
      <div className="overflow-x-auto">
        <ToastComponent />
        <Table hoverable>
          <Table.Head>
            <Table.HeadCell>Code</Table.HeadCell>
            <Table.HeadCell>Discount Value</Table.HeadCell>
            <Table.HeadCell>Value Apply</Table.HeadCell>
            <Table.HeadCell>Expiry Date</Table.HeadCell>
            <Table.HeadCell>Drop</Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {discounts.map((discount: Discount) => (
              <Table.Row
                className="bg-white dark:border-gray-700 dark:bg-gray-800"
                key={discount.id}
              >
                <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                  {discount.coupon_code}
                </Table.Cell>
                <Table.Cell>{discount.discount_value}</Table.Cell>
                <Table.Cell>
                  {formatPrice(parseFloat(discount.value_apply))}
                </Table.Cell>
                <Table.Cell>{convertDate(discount.expiration_date)}</Table.Cell>
                <Table.Cell>{<DropBox coupon={discount} />}</Table.Cell>
                <Table.Cell>
                  <Button.Group>
                    <EditModal coupon={discount} />
                    <Button
                      color="gray"
                      disabled={checkActionValid(role, "coupons", "delete")}
                      onClick={() => {
                        setSelectDelete(discount.id);
                        setOpenModal(true);
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
      </div>
      <Modal
        show={openModal}
        position="center"
        onClose={() => {
          setSelectDelete(null);
          setOpenModal(false);
        }}
      >
        <Modal.Header>Delete Coupon</Modal.Header>
        <Modal.Body className="w-[900px]">
          <ToastComponent />
          <p className="text-lg "> Do you want to delete this?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button
            onClick={() => {
              axios
                .put(`/api/v2/discount/delete`, {
                  discount_id: selectDelete,
                })
                .then((res) => {
                  if (res.data.code) {
                    dispatch(
                      showToast({ type: "success", message: res.data.message })
                    );
                  } else {
                    dispatch(
                      showToast({ type: "error", message: res.data.message })
                    );
                  }
                })
                .catch((err) => {
                  dispatch(
                    showToast({
                      type: "error",
                      message: "Something went wrong",
                    })
                  );
                })
                .finally(() => {
                  setOpenModal(false);
                  reloadSide();
                });
            }}
          >
            Confirm
          </Button>
          <Button
            color="gray"
            onClick={() => {
              setSelectDelete(null);
              setOpenModal(false);
            }}
          >
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

const DropBox: FC<{ coupon: Discount }> = function (props): JSX.Element {
  const [openModal, setOpenModal] = useState(false);
  const dispatch = useDispatch();
  const [optionSelected, setOptionSelected] = useState(0);
  const [users, setUsers] = useState([]);

  const fetch = async (min: number, max: number) => {
    try {
      axios.post("api/v2/discount-max-min", { min, max }).then((res) => {
        setUsers(res.data.data);
        dispatch(showToast({ type: "success", message: res.data.message }));
        return;
      });
    } catch (error) {
      dispatch(showToast({ type: "error", message: error }));
    }
  };

  const fetchAll = async () => {
    try {
      axios.get("api/v2/user").then((res) => {
        setUsers(res.data);
        return;
      });
    } catch (error) {
      dispatch(showToast({ type: "error", message: error }));
    }
  };

  useEffect(() => {
    switch (optionSelected) {
      case 1:
        const min = 1000000;
        const max = 3000000;
        fetch(min, max);
        break;
      case 2:
        const min2 = 3000000;
        const max2 = 5000000;
        fetch(min2, max2);
        break;
      case 3:
        const min3 = 5000000;
        const max3 = 10000000;
        fetch(min3, max3);
        break;
      case 4:
        const min4 = 10000000;
        const max4 = 15000000;
        fetch(min4, max4);
        break;
      case 5:
        const min5 = 15000000;
        const max5 = 100000000;
        fetch(min5, max5);
        break;
      default:
        fetchAll();
        break;
    }
  }, [optionSelected]);

  type User = {
    id: number;
    email: string;
    amount: number;
  };

  const handleDropDiscount = async () => {
    if (users.length > 0) {
      const listUser = users.map((user: User) => user.id);
      axios
        .post("/api/v2/drop-discount", {
          id_user: listUser,
          id_discount: props.coupon.id,
        })
        .then((res) => {
          if (res.data.code) {
            dispatch(showToast({ type: "success", message: res.data.message }));
          } else {
            dispatch(showToast({ type: "error", message: res.data.message }));
          }
        })
        .catch((err) => {
          console.log(err);
          dispatch(
            showToast({ type: "error", message: "Something went wrong" })
          );
        })
        .finally(() => {
          setOpenModal(false);
          reloadSide();
        });
    }
  };

  return (
    <div>
      <Button
        color="gray"
        onClick={() => setOpenModal(true)}
        disabled={props.coupon.dropTime !== null}
        title={props.coupon.dropTime !== null ? "Over time" : ""}
      >
        <FaDropbox className="mr-3 h-4 w-4" />
        Give Discount
      </Button>
      <Modal show={openModal} onClose={() => setOpenModal(false)}>
        <Modal.Header>Drop Discount Modal</Modal.Header>
        <Modal.Body>
          <div className="space-y-6">
            <div>
              <p>Thông tin mã giảm giá</p>
              <div className="flex justify-between items-center ">
                <span>{props.coupon.id}</span>
                <span>{props.coupon.coupon_code}</span>
                <span>{props.coupon.discount_value}</span>
                <span>{formatPrice(parseFloat(props.coupon.value_apply))}</span>
                <span>{convertDate(props.coupon.expiration_date)}</span>
              </div>
            </div>
            <div className="flex space-x-4 items-center">
              <p>Chọn user sẽ nhận được mã:</p>
              <select
                name=""
                id=""
                onChange={(e) => {
                  setOptionSelected(parseInt(e.target.value));
                }}
              >
                <option value="0">Chọn người dùng</option>
                <option value="1">Tiêu từ 1 triệu - 3 triệu</option>
                <option value="2">Tiêu từ 3 triệu - 5 triệu</option>
                <option value="3">Tiêu từ 5 triệu - 10 triệu</option>
                <option value="4">Tiêu từ 10 triệu - 15 triệu</option>
                <option value="5">Trên 15 triệu</option>
                <option value="6">Cho tất cả</option>
              </select>
            </div>
            {optionSelected !== 0 &&
              optionSelected !== 6 &&
              users.length > 0 && (
                <Table>
                  <Table.Head>
                    <Table.HeadCell>ID User</Table.HeadCell>
                    <Table.HeadCell>Email</Table.HeadCell>
                    <Table.HeadCell>Amount</Table.HeadCell>
                  </Table.Head>
                  <Table.Body>
                    {users.map((user: User) => (
                      <Table.Row>
                        <Table.Cell>{user.id}</Table.Cell>

                        <Table.Cell>{user.email}</Table.Cell>
                        <Table.Cell>{formatPrice(user.amount)}</Table.Cell>
                      </Table.Row>
                    ))}
                  </Table.Body>
                </Table>
              )}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleDropDiscount}>I accept</Button>
          <Button color="gray" onClick={() => setOpenModal(false)}>
            Decline
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

const EditModal: FC<{ coupon: Discount }> = function (props): JSX.Element {
  const [openModal, setOpenModal] = useState(false);
  const dispatch = useDispatch();
  const initialValues: Values = {
    coupon_code: "",
    discount_value: 0,
    value_apply: 10000,
    max_apply: 200000,
    expiration_date: "",
  };

  const validateSchema = Yup.object({
    coupon_code: Yup.string()
      .max(20, "Mã giảm giá không được quá 20 ký tự")
      .required("Phải điền mã giảm giá"),
    discount_value: Yup.number()
      .max(100, "100% là giá trị tối đa")
      .required("Phải điền chiết khấu nhận được"),
    value_apply: Yup.number()
      .min(10000, "Giá trị áp dụng phải lớn hơn hoặc bằng 10000")
      .required("Phải điền giá trị áp dụng cho mã giảm giá")
      .test(
        "is-less-than-max-apply",
        "Giá trị áp dụng phải nhỏ hơn giá trị tối đa",
        function (value) {
          return value < this.parent.max_apply;
        }
      ),
    max_apply: Yup.number()
      .min(50000, "Giá trị áp dụng tối đa phải nhỏ hơn hoặc bằng 50000")
      .required("Phải điền giá trị áp dụng tối thiểu"),
    expiration_date: Yup.date().required("Phải chọn ngày hết hạn"),
  });
  return (
    <>
      <Button onClick={() => setOpenModal(true)} color="gray">
        <RxUpdate className="mr-3 h-4 w-4" />
        Update
      </Button>
      <Modal
        show={openModal}
        position="center"
        onClose={() => setOpenModal(false)}
      >
        <Modal.Header>Edit Coupon</Modal.Header>
        <Modal.Body className="w-[900px]">
          <ToastComponent />
          <Formik
            initialValues={initialValues}
            validationSchema={validateSchema}
            onSubmit={(values, actions) => {
              if (values.coupon_code === "") {
                values.coupon_code = props.coupon.coupon_code;
              }
              if (values.discount_value === 0) {
                values.discount_value = props.coupon.discount_value;
              }
              if (values.value_apply >= values.max_apply) {
                dispatch(
                  showToast({
                    type: "error",
                    message: "Value apply must be less than max apply",
                  })
                );
                return;
              }

              axios
                .put("/api/v2/discount", {
                  ...values,
                  discount_id: props.coupon.id,
                })
                .then((res) => {
                  if (res.data.code) {
                    dispatch(
                      showToast({ type: "success", message: res.data.message })
                    );
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
              <div className="mb-5">
                <div className="flex items-center">
                  <label htmlFor="coupon_code">Discount Code: </label>
                  <Field
                    id="coupon_code"
                    name="coupon_code"
                    placeholder="Code"
                    className="ml-3"
                  />
                </div>

                <ErrorMessage
                  name="coupon_code"
                  component="div"
                  className="error text-sm text-red-500 "
                />
              </div>
              <div className="mb-1r mb-5">
                <div className="flex items-center">
                  <label htmlFor="discount_value">Discount (%):</label>
                  <Field
                    id="discount_value"
                    name="discount_value"
                    placeholder="discount"
                    className="ml-3"
                  />
                </div>

                <ErrorMessage
                  name="discount_value"
                  component="div"
                  className="error text-sm text-red-500 "
                />
              </div>
              <div className="mb-1r mb-5">
                <div className="flex items-center">
                  <label htmlFor="value_apply">Value Apply:</label>
                  <Field
                    id="value_apply"
                    name="value_apply"
                    placeholder="Value Apply"
                    className="ml-3"
                  />
                </div>

                <ErrorMessage
                  name="value_apply"
                  component="div"
                  className="error text-sm text-red-500 "
                />
              </div>
              <div className="mb-1r mb-5">
                <div className="flex items-center">
                  <label htmlFor="max_apply">Max Value Apply:</label>
                  <Field
                    id="max_apply"
                    name="max_apply"
                    placeholder="Max Value Apply"
                    className="ml-3"
                  />
                </div>

                <ErrorMessage
                  name="max_apply"
                  component="div"
                  className="error text-sm text-red-500 "
                />
              </div>
              <div className="mb-1r mb-5">
                <div className="flex items-center">
                  <label htmlFor="expiration_date">Expiration Date:</label>

                  <Field
                    id="expiration_date"
                    name="expiration_date"
                    type="date"
                    className="ml-3"
                    min={new Date().toISOString().split("T")[0]}
                  />
                </div>

                <ErrorMessage
                  name="expiration_date"
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
    </>
  );
};

export default DiscountPage;
