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
import {
  HiHome,
  HiOutlineExclamationCircle,
  HiOutlinePencilAlt,
  HiPlus,
  HiTrash,
} from "react-icons/hi";
import NavbarSidebarLayout from "../../layouts/navbar-sidebar";
import axios from "../../config/axios";
import checkActionValid from "../../function/checkActionValid";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { FaUnlockAlt } from "react-icons/fa";
import { CiSearch } from "react-icons/ci";
import { useDispatch } from "react-redux";
import { showToast } from "../../Slice/toast";
import ToastComponent from "../../components/toast";
import { reloadSide } from "../../function/reloadSide";

interface Category {
  value: number;
  label: string;
  status: number;
}

const CategoryListPage: FC = function () {
  const [allCategory, setAllCategory] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const dispatch = useDispatch();

  useEffect(() => {
    const getAllCategory = async () => {
      const res = await axios.get("/api/v2/all-category");
      setAllCategory(res.data);
    };
    getAllCategory();
  }, []);

  const handleSearch = async () => {
    if (searchValue === "") {
      const result = await axios.get("/api/v2/all-category");
      if (result) {
        setAllCategory(result.data);
      }
      dispatch(
        showToast({ type: "error", message: "Vui lòng thêm giá trị tìm kiếm" })
      );
    } else {
      axios
        .get(`/api/v2/category-search?search=${searchValue}`)
        .then((res) => {
          if (res.data.code) {
            setAllCategory(res.data.data);
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
              <Breadcrumb.Item href="/users/list">Category</Breadcrumb.Item>
              <Breadcrumb.Item>List</Breadcrumb.Item>
            </Breadcrumb>
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl">
              All Category
            </h1>
          </div>
          <div className="sm:flex">
            <div className="mb-3 hidden items-center dark:divide-gray-700 sm:mb-0 sm:flex sm:divide-x sm:divide-gray-100">
              <div className="lg:pr-3">
                <Label htmlFor="users-search" className="sr-only">
                  Search
                </Label>
                <div className="relative mt-1 lg:w-64 xl:w-96">
                  <TextInput
                    id="users-search"
                    name="users-search"
                    placeholder="Search for users"
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
            <div className="ml-auto flex items-center space-x-2 sm:space-x-3">
              <AddCategoryModal />
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden shadow">
              <AllAuthorsTable categorys={allCategory} />
            </div>
          </div>
        </div>
      </div>
    </NavbarSidebarLayout>
  );
};

const AddCategoryModal: FC = function () {
  const [isOpen, setOpen] = useState(false);
  const [name, setName] = useState<string>("");
  const role = useSelector((state: RootState) => state.role.currentAction.list);
  const dispatch = useDispatch();

  const handleAddCategory = () => {
    if (!name) {
      dispatch(showToast({ message: "Thiếu thông tin", type: "error" }));
      return;
    }

    const sendRequest = async () => {
      await axios
        .post("/api/v2/category", { name })
        .then((res) => {
          if (res.data.code) {
            setOpen(false);
            dispatch(
              showToast({ message: "Thêm thành công", type: "success" })
            );
            reloadSide();
          }
        })
        .catch((err) => {
          dispatch(showToast({ message: "Thêm thất bại", type: "error" }));
        });
    };
    sendRequest();
  };

  return (
    <>
      <Button
        color="primary"
        onClick={() => setOpen(true)}
        disabled={checkActionValid(role, "category", "create")}
      >
        <div className="flex items-center gap-x-3">
          <HiPlus className="text-xl" />
          Add Category
        </div>
      </Button>
      <ToastComponent />
      <Modal onClose={() => setOpen(false)} show={isOpen}>
        <Modal.Header className="mt-[200px] border-b border-gray-200 !p-6 dark:border-gray-700">
          <strong>Add new Category</strong>
        </Modal.Header>
        <Modal.Body>
          <div className="">
            <div>
              <Label htmlFor="name">Name</Label>
              <div className="mt-1">
                <TextInput
                  id="name"
                  name="name"
                  placeholder="..."
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button color="primary" onClick={handleAddCategory}>
            Add Category
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
type AllAuthorsTableProps = {
  categorys: Category[];
};

const AllAuthorsTable: FC<AllAuthorsTableProps> = function ({ categorys }) {
  return (
    <Table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
      <Table.Head className="bg-gray-100 dark:bg-gray-700">
        <Table.HeadCell>ID</Table.HeadCell>
        <Table.HeadCell>Name</Table.HeadCell>
        <Table.HeadCell>Status</Table.HeadCell>
        <Table.HeadCell>Actions</Table.HeadCell>
      </Table.Head>
      <Table.Body className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
        {categorys.map((category: Category) => (
          <Table.Row className="hover:bg-gray-100 dark:hover:bg-gray-700">
            <Table.Cell className="mr-12 flex items-center space-x-6 whitespace-nowrap p-4 lg:mr-0">
              <div className="text-sm font-normal text-gray-500 dark:text-gray-400">
                <div className="text-base font-semibold text-gray-900 dark:text-white max-w-[200px]">
                  {category.value}
                </div>
              </div>
            </Table.Cell>
            <Table.Cell className="whitespace-nowrap p-4 text-base font-normal text-gray-900 dark:text-white">
              {category.label}
            </Table.Cell>
            <Table.Cell className="whitespace-nowrap p-4 text-base font-normal text-gray-900 dark:text-white">
              {category.status == 1 ? (
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
                <EditCategoryModal category={category} />
                <DeleteCategoryModal category={category} />
              </div>
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );
};

const EditCategoryModal: FC<{ category: Category }> = function (
  props
): JSX.Element {
  const [isOpen, setOpen] = useState(false);
  const role = useSelector((state: any) => state.role.currentAction.list);
  const [nameCategory, setNameCategory] = useState<string>("");
  const dispatch = useDispatch();

  const handleUpdateCategory = () => {
    const sendRequest = async () => {
      await axios
        .put("/api/v2/category/update", {
          id: props.category.value,
          name: nameCategory,
        })
        .then((res) => {
          if (res.data.code) {
            setOpen(false);
            dispatch(
              showToast({ message: "Cập nhật thành công", type: "success" })
            );
            reloadSide();
          }
        })
        .catch((err) => {
          dispatch(showToast({ message: "Cập nhật thất bại", type: "error" }));
        });
    };
    sendRequest();
  };

  return (
    <>
      <Button
        color="primary"
        onClick={() => setOpen(true)}
        disabled={checkActionValid(role, "category", "update")}
      >
        <div className="flex items-center gap-x-2">
          <HiOutlinePencilAlt className="text-lg" />
          Edit
        </div>
      </Button>
      <Modal onClose={() => setOpen(false)} show={isOpen}>
        <Modal.Header className="border-b border-gray-200 !p-6 dark:border-gray-700 mt-[200px]">
          <strong>Edit Category</strong>
        </Modal.Header>
        <Modal.Body>
          <div className="">
            <div>
              <Label htmlFor="name">Name</Label>
              <div className="mt-1">
                <TextInput
                  id="firstName"
                  name="firstName"
                  placeholder="..."
                  defaultValue={props.category.label}
                  onChange={(e) => setNameCategory(e.target.value)}
                />
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button color="primary" onClick={() => handleUpdateCategory()}>
            Save all
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

const DeleteCategoryModal: FC<{
  category: Category;
}> = function (props): JSX.Element {
  const [isOpen, setOpen] = useState(false);
  const dispatch = useDispatch();
  const role = useSelector((state: any) => state.role.currentAction.list);

  const handleDeleteAuthor = (category: Category) => {
    const sendRequest = async () => {
      const res = await axios.put("/api/v2/category/delete", {
        id: category.value,
        status: category.status,
      });
      if (res.data.code == 1) {
        dispatch(showToast({ message: res.data.message, type: "success" }));
        reloadSide();
      } else {
        dispatch(showToast({ message: "Xóa thất bại", type: "error" }));
      }
    };
    sendRequest();
  };

  return (
    <>
      <Button
        color="failure"
        onClick={() => setOpen(true)}
        disabled={checkActionValid(role, "category", "delete")}
      >
        <div className="flex items-center gap-x-2">
          {props.category.status == 1 ? (
            <div className="flex gap-x-2">
              <HiTrash className="text-lg" />
              Delete
            </div>
          ) : (
            <div className="flex gap-x-2">
              <FaUnlockAlt className="text-lg" /> Unlock
            </div>
          )}
        </div>
      </Button>
      <Modal onClose={() => setOpen(false)} show={isOpen} size="md">
        <Modal.Header className="px-6 pt-6 pb-0">
          <span className="sr-only">
            {props.category.status == 1 ? "Delete" : "Unlock"}
          </span>
        </Modal.Header>
        <Modal.Body className="px-6 pt-0 pb-6">
          <div className="flex flex-col items-center gap-y-6 text-center">
            {props.category.status == 1 ? (
              <HiOutlineExclamationCircle className="text-7xl text-red-500" />
            ) : (
              <HiOutlineExclamationCircle className="text-7xl text-green-500" />
            )}

            <p className="text-xl text-gray-500">
              Are you sure you want to{" "}
              {props.category.status == 1 ? "delete" : "unlock"} this category?
            </p>
            <div className="flex items-center gap-x-3">
              <Button
                color="failure"
                onClick={() => {
                  handleDeleteAuthor(props.category);
                  setOpen(false);
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

export default CategoryListPage;
