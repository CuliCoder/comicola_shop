/* eslint-disable jsx-a11y/anchor-is-valid */
import {
  Breadcrumb,
  Button,
  Label,
  Modal,
  Table,
  TextInput,
  FileInput,
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
import { Editor, EditorTextChangeEvent } from "primereact/editor";
import checkActionValid from "../../function/checkActionValid";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { FaUnlockAlt } from "react-icons/fa";
import { CiSearch } from "react-icons/ci";
import { useDispatch } from "react-redux";
import { showToast } from "../../Slice/toast";
import ToastComponent from "../../components/toast";
import { reloadSide } from "../../function/reloadSide";

interface Author {
  value: number;
  label: string;
  information: string;
  thumbnail: string;
  status: number;
}

const AuthorListPage: FC = function () {
  const [allAuthor, setAllAuthor] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const dispatch = useDispatch();
  useEffect(() => {
    const getAllAuthor = async () => {
      const res = await axios.get("/api/v2/author");
      setAllAuthor(res.data);
    };
    getAllAuthor();
  }, []);

  const handleSearch = async () => {
    if (searchValue === "") {
      const result = await axios.get("/api/v2/author");
      if (result) {
        setAllAuthor(result.data);
      }
      dispatch(
        showToast({ type: "error", message: "Vui lòng thêm giá trị tìm kiếm" })
      );
    } else {
      axios
        .get(`/api/v2/author-search?search=${searchValue}`)
        .then((res) => {
          if (res.data.code) {
            setAllAuthor(res.data.data);
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
              <Breadcrumb.Item href="/users/list">Authors</Breadcrumb.Item>
              <Breadcrumb.Item>List</Breadcrumb.Item>
            </Breadcrumb>
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl">
              All authors
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
                    placeholder="Search for authors"
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
              <AddAuthorModal />
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden shadow">
              <AllAuthorsTable authors={allAuthor} />
            </div>
          </div>
        </div>
      </div>
    </NavbarSidebarLayout>
  );
};

const AddAuthorModal: FC = function () {
  const [isOpen, setOpen] = useState(false);
  const [informationAuthor, setInformationAuthor] = useState<string>("");
  const [thumbnail, setThumbnail] = useState<File | undefined>(undefined);
  const [previewThumbnail, setPreviewThumbnail] = useState<string>("");
  const [name, setName] = useState<string>("");
  const role = useSelector((state: RootState) => state.role.currentAction.list);
  const dispatch = useDispatch();

  useEffect(() => {
    if (thumbnail) {
      const objectUrl = URL.createObjectURL(thumbnail);
      setPreviewThumbnail(objectUrl);

      return () => URL.revokeObjectURL(objectUrl);
    } else {
      setPreviewThumbnail("");
      return;
    }
  }, [thumbnail]);

  const handleAddAuthor = () => {
    if (!name || !informationAuthor || !thumbnail) {
      dispatch(showToast({ message: "Thiếu thông tin", type: "error" }));
      return;
    }
    const formData = new FormData();
    formData.append("name", name);
    formData.append("information", informationAuthor);
    formData.append("author", thumbnail as Blob);

    const sendRequest = async () => {
      await axios
        .post("/api/v2/author/add", formData)
        .then((res) => {
          if (res.data.success) {
            setOpen(false);
            dispatch(
              showToast({ message: "Thêm tác giả thành công", type: "success" })
            );
            reloadSide();
          }
        })
        .catch((err) => {
          dispatch(
            showToast({ message: "Thêm tác giả thất bại", type: "error" })
          );
        });
    };
    sendRequest();
  };

  const isDisabled =
    !name || name.includes("-") || !informationAuthor || !thumbnail;
  const disabledReason = !name
    ? "Thiếu tên tác giả"
    : name.includes("-")
    ? "Tên tác giả không được chứa dấu '-'"
    : !informationAuthor
    ? "Thiếu thông tin tác giả"
    : !thumbnail
    ? "Thiếu ảnh tác giả"
    : "";

  return (
    <>
      <Button
        color="primary"
        onClick={() => setOpen(true)}
        disabled={checkActionValid(role, "authors", "create")}
      >
        <div className="flex items-center gap-x-3">
          <HiPlus className="text-xl" />
          Add Author
        </div>
      </Button>
      <ToastComponent />
      <Modal onClose={() => setOpen(false)} show={isOpen}>
        <Modal.Header className="mt-[200px] border-b border-gray-200 !p-6 dark:border-gray-700">
          <strong>Add new author</strong>
        </Modal.Header>
        <Modal.Body>
          <div className="">
            <div>
              <Label htmlFor="name">Name Author</Label>
              <div className="mt-1">
                <TextInput
                  id="firstName"
                  name="firstName"
                  placeholder="..."
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="information">Information</Label>
              <div className="mt-1">
                <Editor
                  value={informationAuthor}
                  onTextChange={(e: EditorTextChangeEvent) => {
                    setInformationAuthor(e.htmlValue ?? "");
                  }}
                  style={{ height: "320px" }}
                />
              </div>
            </div>

            <div className="flex space-x-2">
              <div>
                <Label htmlFor="thumbnail">Thumbnail</Label>
                <div className="mt-1">
                  <Label
                    htmlFor="dropzone-file"
                    className="flex h-[150px] w-[300px] cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                  >
                    <div className="flex flex-col items-center justify-center pb-6 pt-5">
                      <svg
                        className="mb-4 h-8 w-8 text-gray-500 dark:text-gray-400"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 20 16"
                      >
                        <path
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                        />
                      </svg>
                      <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                        <span className="font-semibold">Click to upload</span>{" "}
                        or drag and drop
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        SVG, PNG, JPG or GIF (MAX. 800x400px)
                      </p>
                    </div>
                    <FileInput
                      id="dropzone-file"
                      className="hidden"
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        if (e.target.files && e.target.files.length > 0) {
                          setThumbnail(e.target.files[0]);
                        }
                      }}
                      accept="image/*"
                    />
                  </Label>
                </div>
              </div>
              <div className="w-full">
                {thumbnail && (
                  <img
                    src={previewThumbnail}
                    className="w-[150px] ml-10 mt-5 object-cover rounded-lg"
                  />
                )}
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            color="primary"
            onClick={handleAddAuthor}
            disabled={isDisabled}
            title={isDisabled ? disabledReason : ""}
          >
            Add Author
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

type AuthorListProps = {
  authors: Author[];
};

const AllAuthorsTable: FC<AuthorListProps> = function ({ authors }) {
  return (
    <Table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
      <Table.Head className="bg-gray-100 dark:bg-gray-700">
        <Table.HeadCell>Name</Table.HeadCell>
        {/* <Table.HeadCell>Information</Table.HeadCell> */}
        <Table.HeadCell>Status</Table.HeadCell>
        <Table.HeadCell>Actions</Table.HeadCell>
      </Table.Head>
      <Table.Body className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
        {authors.map((author: Author) => (
          <Table.Row className="hover:bg-gray-100 dark:hover:bg-gray-700">
            <Table.Cell className="mr-12 flex items-center space-x-6 whitespace-nowrap p-4 lg:mr-0">
              <img
                className="h-10 w-10 rounded-full"
                src={author.thumbnail}
                alt="Neil Sims avatar"
              />
              <div className="text-sm font-normal text-gray-500 dark:text-gray-400">
                <div className="text-base font-semibold text-gray-900 dark:text-white max-w-[200px]">
                  {author.label}
                </div>
              </div>
            </Table.Cell>
            {/* <Table.Cell className="whitespace-nowrap p-4 text-base font-normal text-gray-900 dark:text-white">
              {author.information}
            </Table.Cell> */}
            <Table.Cell className="whitespace-nowrap p-4 text-base font-normal text-gray-900 dark:text-white">
              {author.status == 1 ? (
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
                <EditAuthorModal author={author} />
                <DeleteAuthorModal author={author} />
              </div>
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );
};

const EditAuthorModal: FC<{ author: Author }> = function (props): JSX.Element {
  const [isOpen, setOpen] = useState(false);
  const role = useSelector((state: any) => state.role.currentAction.list);
  const [informationAuthor, setInformationAuthor] = useState<string>(
    props.author.information
  );
  const [thumbnail, setThumbnail] = useState<File | undefined>(undefined);
  const [previewThumbnail, setPreviewThumbnail] = useState<string>("");
  const [name, setName] = useState<string>(props.author.label);
  console.log(props.author);
  const handleUpdateAuthor = () => {
    const formData = new FormData();
    formData.append("id", props.author.value.toString());
    formData.append("name", name);
    formData.append("information", informationAuthor);
    formData.append("thumbnailURL", props.author.thumbnail);
    formData.append("author", thumbnail as Blob);

    const sendRequest = async () => {
      const res = await axios.put("/api/v2/author/update", formData);
      if (res.data.status == 200) {
        setOpen(false);
        reloadSide();
      }
      console.log(res.data);
    };
    sendRequest();
  };
  useEffect(() => {
    setInformationAuthor(props.author.information);
  }, []);
  return (
    <>
      <Button
        color="primary"
        onClick={() => setOpen(true)}
        disabled={checkActionValid(role, "authors", "update")}
      >
        <div className="flex items-center gap-x-2">
          <HiOutlinePencilAlt className="text-lg" />
          Edit
        </div>
      </Button>
      <Modal onClose={() => setOpen(false)} show={isOpen}>
        <Modal.Header className="border-b border-gray-200 !p-6 dark:border-gray-700 mt-[250px]">
          <strong>Edit Author</strong>
        </Modal.Header>
        <Modal.Body>
          <div className="max-h-screen overflow-y-auto">
            <div>
              <Label htmlFor="name">Name Author</Label>
              <div className="mt-1">
                <TextInput
                  id="firstName"
                  name="firstName"
                  placeholder="..."
                  defaultValue={props.author.label}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="information">Information</Label>
              <div className="mt-1">
                <Editor
                  value={props.author.information}
                  // defaultValue={props.author.information}
                  onTextChange={(e: EditorTextChangeEvent) => {
                    setInformationAuthor(e.htmlValue ?? "");
                  }}
                  style={{ height: "320px" }}
                />
              </div>
            </div>

            <div className="flex space-x-2">
              <div>
                <Label htmlFor="thumbnail">Thumbnail</Label>
                <div className="mt-1">
                  <Label
                    htmlFor="dropzone-file"
                    className="flex h-[150px] w-[300px] cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                  >
                    <div className="flex flex-col items-center justify-center pb-6 pt-5">
                      <svg
                        className="mb-4 h-8 w-8 text-gray-500 dark:text-gray-400"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 20 16"
                      >
                        <path
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                        />
                      </svg>
                      <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                        <span className="font-semibold">Click to upload</span>{" "}
                        or drag and drop
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        SVG, PNG, JPG or GIF (MAX. 800x400px)
                      </p>
                    </div>
                    <FileInput
                      id="dropzone-file"
                      className="hidden"
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        if (e.target.files && e.target.files.length > 0) {
                          setThumbnail(e.target.files[0]);
                        }
                      }}
                      accept="image/*"
                    />
                  </Label>
                </div>
              </div>
              <div className="w-full">
                {thumbnail && (
                  <img
                    src={previewThumbnail}
                    className="w-[150px] ml-10 mt-5 object-cover rounded-lg"
                  />
                )}
                <img
                  src={props.author.thumbnail}
                  className="w-[150px] ml-10 mt-5 object-cover rounded-lg"
                />
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button color="primary" onClick={() => handleUpdateAuthor()}>
            Save all
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

const DeleteAuthorModal: FC<{
  author: Author;
}> = function (props): JSX.Element {
  const [isOpen, setOpen] = useState(false);
  const dispatch = useDispatch();
  const role = useSelector((state: any) => state.role.currentAction.list);

  const handleDeleteAuthor = (author: Author) => {
    const sendRequest = async () => {
      const res = await axios.put("/api/v2/author/delete", {
        id: author.value,
        status: author.status,
      });
      if (res.data.code) {
        dispatch(showToast({ message: res.data.message, type: "success" }));
        reloadSide();
      } else {
        dispatch(showToast({ message: "Xóa tác giả thất bại", type: "error" }));
      }
    };
    sendRequest();
  };

  return (
    <>
      <Button
        color="failure"
        onClick={() => setOpen(true)}
        disabled={checkActionValid(role, "authors", "delete")}
      >
        <div className="flex items-center gap-x-2">
          {props.author.status == 1 ? (
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
            {props.author.status == 1 ? "Delete" : "Unlock"}
          </span>
        </Modal.Header>
        <Modal.Body className="px-6 pt-0 pb-6">
          <div className="flex flex-col items-center gap-y-6 text-center">
            {props.author.status == 1 ? (
              <HiOutlineExclamationCircle className="text-7xl text-red-500" />
            ) : (
              <HiOutlineExclamationCircle className="text-7xl text-green-500" />
            )}

            <p className="text-xl text-gray-500">
              Are you sure you want to{" "}
              {props.author.status == 1 ? "delete" : "unlock"} this user?
            </p>
            <div className="flex items-center gap-x-3">
              <Button
                color="failure"
                onClick={() => {
                  handleDeleteAuthor(props.author);
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

export default AuthorListPage;
