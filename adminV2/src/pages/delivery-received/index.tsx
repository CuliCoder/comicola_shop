/* eslint-disable jsx-a11y/anchor-is-valid */
import {
  Button,
  Label,
  TextInput,
  Modal,
  Select,
  Textarea,
} from "flowbite-react";
import type { FC } from "react";
import { useState, useEffect } from "react";
import { IoMdAddCircleOutline, IoIosSearch } from "react-icons/io";
import NavbarSidebarLayout from "../../layouts/navbar-sidebar";
import axios from "../../config/axios";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../store";
import { addProductsWait, removeProductsWait } from "../../Slice/products_wait";
import checkActionValid from "../../function/checkActionValid";
import ToastComponent from "../../components/toast";
import { showToast } from "../../Slice/toast";
import { convertDate } from "../../function/convertDate";
import { IoAddCircle } from "react-icons/io5";

import { formatPrice } from "../../function/formatPrice";

const DeliveryPage: FC = function () {
  const [openModal, setOpenModal] = useState(false);
  const [messageError, setMessageError] = useState("");
  const [idProduct, setIdProduct] = useState(0);
  const [costPrice, setCostPrice] = useState(0);
  const [quantity, setQuantity] = useState(0);
  const [products, setProducts] = useState([]);
  const [company, setCompany] = useState([]);
  const [note, setNote] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [received, setReceived] = useState<Received[]>([]);

  useEffect(() => {
    const fetch = async () => {
      const result = await axios.get("/api/v2/received-detail");
      setReceived(result.data.result);
    };
    fetch();
  }, []);

  const handleSearch = async () => {
    if (searchValue === "") {
      const result = await axios.get("/api/v2/received-detail");
      if (result) {
        setReceived(result.data.result);
      }
      dispatch(
        showToast({ type: "error", message: "Vui lòng thêm giá trị tìm kiếm" })
      );
    } else {
      axios
        .get(`/api/v2/received-search?search=${searchValue}`)
        .then((res) => {
          if (res.data.code) {
            setReceived(res.data.data);
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

  const [companySelected, setCompanySelected] = useState(0);

  const dispatch = useDispatch();

  const productsWait = useSelector(
    (state: RootState) => state.productsWait.productsWait
  );

  const role = useSelector((state: RootState) => state.role.currentAction.list);

  function onCloseModal() {
    setOpenModal(false);
  }

  useEffect(() => {
    const fetch = async () => {
      const allProducts = await axios.get("/api/v2/product");
      setProducts(allProducts.data);

      const company = await axios.get("/api/v2/company-running");
      setCompany(company.data);
    };

    fetch();
  }, []);

  const handleAddDelivery = () => {
    try {
      const data = {
        companyId: companySelected,
        note: note,
        products: productsWait,
      };
      axios
        .post("/api/v2/create-received", data)
        .then(() => {
          dispatch(
            showToast({ message: "Create delivery success", type: "success" })
          );
          setOpenModal(false);
        })
        .catch((error) => {
          dispatch(
            showToast({ message: "Create delivery fail", type: "error" })
          );
          console.log(error);
          setOpenModal(false);
        });
    } catch (error) {
      console.log(error);
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
                Delivery History
              </h1>
            </div>
            <div className="sm:flex sm:justify-between">
              <div className="hidden mb-3 items-center dark:divide-gray-700 sm:mb-0 sm:flex sm:divide-x sm:divide-gray-100">
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
              <Button
                gradientDuoTone="greenToBlue"
                onClick={() => setOpenModal(true)}
                disabled={checkActionValid(role, "goods", "create")}
              >
                {" "}
                <IoMdAddCircleOutline className="w-6 h-6" />
                New Delivery
              </Button>
            </div>
          </div>
        </div>
        <div className="flex flex-col">
          <div className="overflow-x-auto">
            <div className="inline-block min-w-full align-middle">
              <div className="overflow-hidden shadow">
                <AllDeliveryTable received={received} />
              </div>
            </div>
          </div>
        </div>
      </NavbarSidebarLayout>
      <Modal show={openModal} size="4xl" onClose={onCloseModal} popup>
        <Modal.Header />
        <Modal.Body>
          <div className="space-y-6">
            <h3 className="text-xl font-medium text-gray-900 dark:text-white">
              Delivery Product
            </h3>

            <div>
              <div className="mb-2 block">
                <Label htmlFor="Company" value="Company" />
              </div>

              <Select
                className="w-80"
                id="comp"
                onChange={(e) => {
                  setCompanySelected(parseInt(e.target.value));
                }}
                disabled={productsWait.length > 0 ? true : false}
              >
                <option value={0}>Select Company </option>
                {company.map((item: Company) => (
                  <option value={item.id}>{`${
                    item.name
                  } - Chiết khấu ${Math.floor(item.discount)}%`}</option>
                ))}
              </Select>
            </div>
            <div className="flex gap-5">
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="id" value="Product ID" />
                </div>
                <div className="max-w-md">
                  <Select
                    id="id"
                    required
                    onChange={(e) => {
                      setIdProduct(parseInt(e.target.value));
                    }}
                    disabled={companySelected == 0 ? true : false}
                  >
                    <option value={0}>Select Product ID </option>
                    {products.map((product: Product) => (
                      <option key={product.id} value={product.id}>
                        {`${product.id} | ${product.title}`}
                      </option>
                    ))}
                  </Select>
                </div>
              </div>
            </div>
            <div className="flex gap-5">
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="cost-price" value="Cost Price" />
                </div>
                <TextInput
                  id="cost-price"
                  type="number"
                  required
                  placeholder="Enter cost price"
                  onChange={(e) => setCostPrice(parseInt(e.target.value))}
                  className="w-80 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  disabled={idProduct == 0 ? true : false}
                />
              </div>

              <div>
                <div className="mb-2 block">
                  <Label htmlFor="quantity" value="Quantity" />
                </div>
                <TextInput
                  id="quantity"
                  type="number"
                  required
                  placeholder="quantity of product"
                  className="w-80"
                  onChange={(e) => setQuantity(parseInt(e.target.value))}
                  disabled={idProduct == 0 ? true : false}
                />
              </div>
            </div>
            {messageError != "" && (
              <p className="text-red-600 text-sm"> {messageError}</p>
            )}
            <div className="flex justify-center">
              <Button
                onClick={() => {
                  dispatch(
                    addProductsWait({
                      id: idProduct,
                      price: costPrice,
                      quantity: quantity,
                    })
                  );
                }}
                disabled={
                  idProduct == 0 ||
                  costPrice <= 0 ||
                  quantity <= 0 ||
                  isNaN(quantity) ||
                  isNaN(costPrice)
                }
                title={
                  idProduct == 0 || costPrice <= 0 || isNaN(costPrice)
                    ? "Số tiền phải lớn hơn 0"
                    : quantity <= 0 || isNaN(quantity)
                    ? "Số lượng phải lớn hơn 0"
                    : ""
                }
              >
                Add{" "}
              </Button>
            </div>
            <div className="bg-primary-300 border border-r-blue-50 p-3 rounded-sm">
              {productsWait.length > 0 &&
                productsWait.map((product) => {
                  return (
                    <div className="flex space-x-2">
                      <div className="flex justify-between w-[90%]">
                        <p>ID: {product.id}</p>
                        <p>Cost Price: {product.price}</p>
                        <p>Quantity: {product.quantity}</p>
                      </div>
                      <span
                        className="w-7 h-7 border-red-300 border text-center cursor-pointer"
                        onClick={() => dispatch(removeProductsWait(product.id))}
                      >
                        X
                      </span>
                    </div>
                  );
                })}
            </div>
            <div className="max-w-md">
              <p>Note</p>
              <Textarea
                id="comment"
                placeholder="Muốn note cái gì thì note. không muốn cũng phải note vào cho đẹp"
                required
                onChange={(e) => setNote(e.target.value)}
                rows={4}
              />
            </div>
            <div className="w-full flex justify-between">
              <div></div>
              <Button
                disabled={productsWait.length <= 0}
                onClick={handleAddDelivery}
              >
                Send Request
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

type Product = {
  id: number;
  title: string;
};

type Company = {
  id: number;
  name: string;
  discount: number;
  status: string;
  description: string;
};

type ReceivedItem = {
  id: number;
  title: string;
  price: number;
  quantity: number;
};

type Received = {
  idReceived: number;
  dateReceived: string;
  name_company: string;
  noteReceived: string;
  total_value: string;
  details: ReceivedItem[];
};

const AllDeliveryTable: FC<{ received: Received[] }> = function ({
  received,
}): JSX.Element {
  return (
    <div className="overflow-x-auto">
      <div className="grid grid-cols-5 bg-gray-300  p-5">
        <div>ID</div>
        <div>Time</div>
        <div>Company</div>
        <div>Total</div>
        <div>Description</div>
      </div>
      {received.length > 0 ? (
        received.map((item) => <Component received={item} />)
      ) : (
        <div>Không có dữ liệu</div>
      )}
    </div>
  );
};

const Component: FC<{ received: Received }> = ({ received }): JSX.Element => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };
  return (
    <div className=" bg-white">
      <div className="">
        <div
          className="grid grid-cols-5 bg-gray-300  p-5"
          onClick={toggleAccordion}
        >
          <div>{received.idReceived}</div>
          <div>{convertDate(received.dateReceived)}</div>
          <div>{received.name_company}</div>
          <div>{formatPrice(parseFloat(received.total_value))}</div>
          <div>{received.noteReceived}</div>
        </div>
        <div>
          {isOpen &&
            received.details.map((item) => {
              return (
                <div className="grid grid-cols-4 justify-evenly text-center">
                  <p>{item.id}</p>
                  <p className="text-left">{item.title}</p>
                  <p>{formatPrice(item.price)}</p>
                  <p>{item.quantity}</p>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default DeliveryPage;
