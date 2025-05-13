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
import { useState, useEffect, ChangeEvent, memo } from "react";
import { FaPlus } from "react-icons/fa";
import {
  HiHome,
  HiOutlineExclamationCircle,
  HiPencilAlt,
  HiTrash,
  HiUpload,
} from "react-icons/hi";
import NavbarSidebarLayout from "../../layouts/navbar-sidebar";
import axios from "../../config/axios";
import { FaAngleDown } from "react-icons/fa";
import { Editor, EditorTextChangeEvent } from "primereact/editor";
import Select, { MultiValue } from "react-select";
import { useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import checkActionValid from "../../function/checkActionValid";
import { showToast } from "../../Slice/toast";
import { useDispatch } from "react-redux";
import ToastComponent from "../../components/toast";
import { fetchAuthors, fetchCategory } from "../../Slice/category_author";
import { CiCircleRemove } from "react-icons/ci";
import { CiSearch } from "react-icons/ci";
import { reloadSide } from "../../function/reloadSide";

interface Product {
  id: number;
  author_id: string;
  title: string;
  price: number;
  description: string;
  introduce: string;
  category: Category[];
  thumbnail?: string;
  gallery?: string[];
  status: number;
  quantity: number;
}

type Author = {
  id: number;
  value: number;
  label: string;
};

type Category = {
  id: number;
  label: string;
  value: number;
};
const EcommerceProductsPage: FC = function () {
  const dispatch = useDispatch<AppDispatch>();
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [text, setText] = useState("");
  useEffect(() => {
    dispatch(fetchAuthors());
    dispatch(fetchCategory());
  }, []);
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get(
          "/api/v2/product?entity=products&action=view"
        );
        setAllProducts(response.data);
      } catch (error) {
        console.log(error);
      }
    }
    fetchData();
  }, []);
  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (text == "") {
        const response = await axios.get(
          "/api/v2/product?entity=products&action=view"
        );
        setAllProducts(response.data);
        return;
      }
      const response = await axios.get(`/api/v2/product-search?text=${text}`);
      setAllProducts(response.data);
    } catch (error) {
      console.log(error);
      setAllProducts([]);
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
              <Breadcrumb.Item href="/e-commerce/products">
                E-commerce
              </Breadcrumb.Item>
              <Breadcrumb.Item>Products</Breadcrumb.Item>
            </Breadcrumb>
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl">
              All products
            </h1>
          </div>
          <div className="block items-center sm:flex">
            <form className="flex mb-4 sm:mb-0 sm:pr-3" onSubmit={handleSearch}>
              <Label htmlFor="products-search" className="sr-only">
                Search
              </Label>
              <div className="relative mt-1 lg:w-64 xl:w-96">
                <TextInput
                  id="products-search"
                  name="products-search"
                  placeholder="Search for products"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                />
              </div>
              <button type="submit" className="cursor-pointer p-2">
                <CiSearch size="30" />
              </button>
            </form>
            <div className="flex w-full items-center sm:justify-end">
              <AddProductModal />
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden shadow">
              <MemoizedProductsTable allProducts={allProducts} />
            </div>
          </div>
        </div>
      </div>
    </NavbarSidebarLayout>
  );
};
const AddProductModal: FC = function () {
  const [isOpen, setOpen] = useState(false);
  const [nameProduct, setNameProduct] = useState("");
  const [cateProduct, setCateProduct] = useState<MultiValue<Category>>([]);
  const [authorProduct, setAuthorProduct] = useState("");
  const [introduce, setIntroduce] = useState<string>("");
  const [desctiptionProduct, setDescriptionProduct] = useState<string>("");

  const [fileList, setFileList] = useState<FileList | null>(null);
  const [previewList, setPreviewList] = useState<string[]>([]);
  const role = useSelector((state: RootState) => state.role.currentAction.list);
  const authors = useSelector(
    (state: RootState) => state.category_author.authors
  );
  const categorys = useSelector(
    (state: RootState) => state.category_author.category
  );
  const dispatch = useDispatch();

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFileList(e.target.files);
  };
  const handleUploadClick = async () => {
    if (!fileList) {
      alert("Chưa chọn ảnh cho sản phẩm");
      return;
    }
    if (fileList.length > 5) {
      alert("Chỉ được tải lên 5 ảnh là tối đa");
      return;
    }
    let formData = new FormData();
    formData.append("name", nameProduct);
    formData.append(
      "category",
      JSON.stringify(cateProduct.map((item) => item.value))
    );
    formData.append("author", authorProduct);
    formData.append("introduce", introduce);
    formData.append("description", desctiptionProduct);
    formData.append("entity", "products");
    formData.append("action", "create");
    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      if (file) formData.append("product", file);
    }

    await axios
      .post("/api/v2/product/add-product", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        if (res.data.code == 1) {
          dispatch(showToast({ type: "success", message: res.data.message }));
          setOpen(false);
          reloadSide();
        }
      });
  };

  const handleChange = (option: MultiValue<Category>) => {
    setCateProduct(option);
  };

  const files = fileList ? [...fileList] : [];
  useEffect(() => {
    let preview = [];
    let URLList: string[] = [];

    if (files.length > 0) {
      URLList = files.map((file) => {
        preview.push(URL.createObjectURL(file));
        return URL.createObjectURL(file);
      });
      setPreviewList(URLList);
    }
  }, [files]);

  const isDisabled =
    nameProduct == "" ||
    cateProduct.length <= 0 ||
    authorProduct == "" ||
    desctiptionProduct == "" ||
    introduce == "" ||
    fileList == null;
  const disabledReason = !nameProduct
    ? "Thiếu tên sản phẩm"
    : cateProduct.length <= 0
    ? "Thiếu danh mục"
    : !authorProduct
    ? "Thiếu tác giả"
    : desctiptionProduct == ""
    ? "Thiếu mô tả sản phẩm"
    : introduce == ""
    ? "Thiếu giới thiệu sản phẩm"
    : fileList == null
    ? "Thiếu ảnh sản phẩm"
    : "";

  return (
    <div>
      <Button
        color="primary"
        onClick={() => {
          setOpen(!isOpen);
        }}
        disabled={checkActionValid(role, "products", "create")}
      >
        <FaPlus className="mr-3 text-sm" />
        Add product
      </Button>
      <Modal onClose={() => setOpen(false)} show={isOpen}>
        <Modal.Header className=" border-b border-gray-200 !p-6 dark:border-gray-700 mt-[1200px]">
          <strong>Add product</strong>
        </Modal.Header>
        <Modal.Body>
          <form>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <div>
                <Label htmlFor="productName">Product name</Label>
                <TextInput
                  id="productName"
                  name="productName"
                  placeholder='Truyện gì đó ...."'
                  className="mt-1"
                  onChange={(e) => {
                    setNameProduct(e.target.value);
                  }}
                  value={nameProduct}
                />
              </div>
              <div>
                <Label htmlFor="brand">Author</Label>
                <select
                  className="border-slate-400 rounded"
                  name="category"
                  id=""
                  onChange={(e) => {
                    setAuthorProduct(e.target.value);
                  }}
                >
                  <option value="0" selected>
                    Chọn tác giả
                  </option>
                  {authors.map((author: Author) => (
                    <option value={author.value}>{author.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <Select
                  isMulti
                  name="category"
                  options={categorys}
                  className="basic-multi-select w-[500px]"
                  classNamePrefix="select"
                  onChange={handleChange}
                />
              </div>

              <div className="lg:col-span-2">
                <Label htmlFor="producTable.Celletails">
                  Product Introduce
                </Label>

                <div>
                  <div>
                    <img
                      src="/images/indicator_introduce.png"
                      alt="Introduce"
                      className="object-cover"
                    />
                  </div>
                  <Editor
                    onTextChange={(e: EditorTextChangeEvent) => {
                      setIntroduce(e.htmlValue ?? "");
                    }}
                    style={{ height: "320px" }}
                    value={introduce}
                  />
                </div>
              </div>

              <div className="lg:col-span-2">
                <Label htmlFor="producTable.Celletails">Product details</Label>
                <Editor
                  value={desctiptionProduct}
                  onTextChange={(e: EditorTextChangeEvent) => {
                    setDescriptionProduct(e.htmlValue ?? "");
                  }}
                  style={{ height: "320px" }}
                />
              </div>
              <div className="lg:col-span-2">
                <div className="flex w-full items-center justify-center">
                  <label className="flex h-32 w-full cursor-pointer flex-col rounded border-2 border-dashed border-gray-300 hover:bg-gray-50 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-700">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <HiUpload className="text-4xl text-gray-300" />
                      <p className="py-1 text-sm text-gray-600 dark:text-gray-500">
                        Thêm ảnh làm thumbnail cho sản phẩm
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        PNG, JPG, GIF up to 10MB
                      </p>
                    </div>
                    <input
                      type="file"
                      onChange={handleFileChange}
                      className="hidden"
                      multiple
                      accept="image/*"
                    />
                  </label>
                  <div className="mt-4 flex flex-wrap justify-center"></div>
                </div>
                {previewList && (
                  <div className="grid ml-[-10px] mt-4 grid-cols-3 ">
                    {previewList?.map((file) => (
                      <img src={file} className="w-[200px] object-cover" />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            color="primary"
            onClick={handleUploadClick}
            disabled={isDisabled}
            title={isDisabled ? disabledReason : ""}
          >
            Add
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

const EditProductModal: FC<{ product: Product }> = function (props) {
  const [isOpen, setOpen] = useState(false);
  const [nameProduct, setNameProduct] = useState("");
  const [thumbnail, setThumbnail] = useState<String>("");
  const [cateProduct, setCateProduct] = useState<MultiValue<Category>>([]);
  const [introduce, setIntroduce] = useState("");
  const [desctiptionProduct, setDescriptionProduct] = useState("");
  const [imagesDelete, setImagesDelete] = useState<String[]>([]);
  const [imagesNew, setImagesNew] = useState<FileList | null>(null);
  const [fileList, setFileList] = useState<FileList | null>(null);
  const [previewList, setPreviewList] = useState<string[]>([]);

  const role = useSelector((state: RootState) => state.role.currentAction.list);
  const authors = useSelector(
    (state: RootState) => state.category_author.authors
  );
  const categorys = useSelector(
    (state: RootState) => state.category_author.category
  );

  useEffect(() => {
    setPreviewList(props.product.gallery ?? []);
    setNameProduct(props.product.title);
    setCateProduct(props.product.category);
    setIntroduce(props.product.introduce);
    setDescriptionProduct(props.product.description);
  }, []);
  const dispatch = useDispatch();

  const handleChange = (option: MultiValue<Category>) => setCateProduct(option);
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const newFiles = Array.from(e.target.files);
      const newPreviews = newFiles.map((file) => URL.createObjectURL(file));
      setPreviewList([...previewList, ...newPreviews]);
      setImagesNew(fileList);
    }
    setFileList(e.target.files);
  };

  const handleUpdateProduct = async () => {
    let formData = new FormData();

    const currentCategories = props.product.category.map((item) => item.id);
    const newCategories = cateProduct.map((item) =>
      item.id != undefined ? item.id : item.value
    );

    const categoriesToAdd = newCategories.filter(
      (id) => !currentCategories.includes(id)
    );
    const categoriesToRemove = currentCategories.filter(
      (id) => !newCategories.includes(id)
    );
    formData.append("productId", props.product.id.toString());
    formData.append("name", nameProduct);

    formData.append("categoryAdd", JSON.stringify(categoriesToAdd));
    formData.append("categoryRemove", JSON.stringify(categoriesToRemove));

    formData.append("description", desctiptionProduct);
    formData.append("introduce", introduce);
    formData.append("imagesDelete", JSON.stringify(imagesDelete));
    formData.append("entity", "products");
    formData.append("action", "update");
    if (fileList != null) {
      for (let i = 0; i < fileList.length; i++) {
        const file = fileList[i];
        if (file) formData.append("product", file);
      }
    }

    await axios
      .put("/api/v2/product/update-product", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        if (res.data.code == 1) {
          dispatch(showToast({ type: "success", message: res.data.message }));
          setOpen(false);
          // reloadSide();
        }
      })
      .finally(() => {
        setOpen(false);
      });
  };

  return (
    <>
      <Button
        color="primary"
        onClick={() => {
          setOpen(!isOpen);
        }}
        disabled={checkActionValid(role, "products", "update")}
      >
        <HiPencilAlt className="mr-2 text-lg" />
        Edit
      </Button>
      <Modal onClose={() => setOpen(false)} show={isOpen}>
        <Modal.Header className="border-b border-gray-200 !p-6 dark:border-gray-700 mt-[250px]">
          <strong>Edit product</strong>
        </Modal.Header>
        <Modal.Body>
          <form className="max-h-screen overflow-y-auto">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <div>
                <Label htmlFor="productName">Product name</Label>
                <TextInput
                  id="productName"
                  name="productName"
                  placeholder=""
                  className="mt-1"
                  defaultValue={props.product.title}
                  onChange={(e) => {
                    setNameProduct(e.target.value);
                  }}
                />
              </div>
              <div>
                <Label htmlFor="brand">Author</Label>
                <select
                  className="border-slate-400 rounded"
                  name="category"
                  id=""
                  disabled={parseInt(props.product.author_id) ? true : false}
                >
                  <option value="0" selected>
                    Chọn tác giả
                  </option>
                  {authors.map((author: Author) => (
                    <option
                      value={author.value}
                      selected={
                        parseInt(props.product.author_id) == author.value
                      }
                    >
                      {author.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <Select
                  isMulti
                  name="category"
                  options={categorys}
                  className="basic-multi-select w-[500px]"
                  classNamePrefix="select"
                  onChange={handleChange}
                  defaultValue={props.product.category}
                />
              </div>
              <div className="lg:col-span-2">
                <Label htmlFor="producTable.Celletails">
                  Product Introduce
                </Label>

                <div>
                  <div>
                    <img
                      src="/images/indicator_introduce.png"
                      alt="Introduce"
                      className="object-cover"
                    />
                  </div>
                  <Editor
                    onTextChange={(e: EditorTextChangeEvent) => {
                      setIntroduce(e.htmlValue ?? "");
                    }}
                    style={{ height: "320px" }}
                    value={props.product.introduce}
                  />
                </div>
              </div>

              <div className="lg:col-span-2">
                <Label htmlFor="producTable.Celletails">Product details</Label>

                <Editor
                  onTextChange={(e: EditorTextChangeEvent) => {
                    setDescriptionProduct(e.htmlValue ?? "");
                  }}
                  style={{ height: "320px" }}
                  value={props.product.description}
                />
              </div>
              <div className="lg:col-span-2">
                <div className="flex w-full items-center justify-center">
                  <label className="flex h-32 w-full cursor-pointer flex-col rounded border-2 border-dashed border-gray-300 hover:bg-gray-50 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-700">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <HiUpload className="text-4xl text-gray-300" />
                      <p className="py-1 text-sm text-gray-600 dark:text-gray-500">
                        Thêm ảnh làm thumbnail cho sản phẩm
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        PNG, JPG, GIF up to 10MB
                      </p>
                    </div>
                    <input
                      type="file"
                      onChange={handleFileChange}
                      className="hidden"
                      multiple
                      accept="image/*"
                    />
                  </label>
                </div>
                {
                  <div className="grid flex-wrap justify-center grid-cols-3 space-x-1 space-y-1">
                    {previewList?.map((item) => (
                      <div className="relative">
                        <img src={item} className="w-[200px] object-cover" />
                        <span
                          className="w-5 h-5 absolute right-0 top-0"
                          onClick={() => {
                            setImagesDelete([...imagesDelete, item]);
                            setPreviewList(
                              previewList.filter((i) => i !== item)
                            );
                          }}
                        >
                          <CiCircleRemove />
                        </span>
                      </div>
                    ))}
                  </div>
                }
              </div>
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer className="flex justify-between">
          <Button color="primary" onClick={handleUpdateProduct}>
            Save all
          </Button>
          <Button color="gray" onClick={() => setOpen(!isOpen)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

const DeleteProductModal: FC<{ id: number }> = function (props) {
  const [isOpen, setOpen] = useState(false);
  const role = useSelector((state: RootState) => state.role.currentAction.list);
  const dispatch = useDispatch();
  const handleDeleteProduct = async (productId: number) => {
    const res = await axios.put("/api/v2/product", {
      productId: productId,
      entity: "products",
      action: "delete",
    });
    if (res.data) {
      dispatch(
        showToast({ type: "success", message: "Xóa sản phẩm thành công" })
      );
      reloadSide();
    }
  };
  return (
    <>
      <Button
        color="failure"
        onClick={() => setOpen(!isOpen)}
        disabled={checkActionValid(role, "products", "delete")}
      >
        <HiTrash className="mr-2 text-lg" />
        Delete
      </Button>
      <Modal onClose={() => setOpen(false)} show={isOpen} size="md">
        <Modal.Header className="px-3 pt-3 pb-0">
          <span className="sr-only">Delete product</span>
        </Modal.Header>
        <Modal.Body className="px-6 pb-6 pt-0">
          <div className="flex flex-col items-center gap-y-6 text-center">
            <HiOutlineExclamationCircle className="text-7xl text-red-600" />
            <p className="text-lg text-gray-500 dark:text-gray-300">
              Are you sure you want to delete this product?
            </p>
            <div className="flex items-center gap-x-3">
              <Button
                color="failure"
                onClick={() => {
                  handleDeleteProduct(props.id);
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

const ProductsTable: FC<{ allProducts: Product[] }> = function ({
  allProducts,
}) {
  const [clickTitle, setClickTitle] = useState(false);
  const [currentArray, setCurrentArray] = useState<Product[]>([]);
  useEffect(() => {
    const fetch = async () => {
      if (clickTitle) {
        var byName = allProducts.slice(0);
        byName.sort(function (a: Product, b: Product) {
          var x = a.title.toLowerCase();
          var y = b.title.toLowerCase();
          return x < y ? -1 : x > y ? 1 : 0;
        });
        setCurrentArray(byName);
        return;
      }
      setCurrentArray(allProducts);
    };
    fetch();
  }, [clickTitle]);
  useEffect(() => {
    setCurrentArray(allProducts);
  }, [allProducts]);
  const formatPrice: (currentPrice: number) => string = (
    currenPrice: number
  ) => {
    const formatter = new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    });
    return formatter.format(currenPrice);
  };

  return (
    <Table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600 relative">
      <Table.Head className="bg-gray-100 dark:bg-gray-700">
        <Table.HeadCell
          className="flex items-center gap-2"
          onClick={() => {
            setClickTitle(!clickTitle);
          }}
        >
          Product Name
          {clickTitle && (
            <div>
              <FaAngleDown />
            </div>
          )}
        </Table.HeadCell>
        <Table.HeadCell>Thumbnail</Table.HeadCell>
        <Table.HeadCell>ID</Table.HeadCell>
        <Table.HeadCell>Price</Table.HeadCell>
        <Table.HeadCell>Status</Table.HeadCell>
        <Table.HeadCell>Actions</Table.HeadCell>
      </Table.Head>
      <Table.Body className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
        {currentArray.map((product: Product) => (
          <Table.Row
            key={product.id}
            className="hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <Table.Cell className="whitespace-nowrap p-4 text-sm font-normal text-gray-500 dark:text-gray-400">
              <div className="text-base font-semibold text-gray-900 dark:text-white"></div>
              <div className="text-sm font-normal text-gray-500 dark:text-gray-400">
                {product.title}
              </div>
            </Table.Cell>
            <Table.Cell className="whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white w-14">
              <img src={product.thumbnail} alt="" />
            </Table.Cell>
            <Table.Cell className="whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white">
              {product.id}
            </Table.Cell>
            <Table.Cell className="whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white">
              {formatPrice(product.price)}
            </Table.Cell>
            <Table.Cell className="whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white">
              {product.status === 1 &&
              product.quantity !== null &&
              product.quantity > 0
                ? "Còn hàng"
                : "Hết hàng"}
            </Table.Cell>
            <Table.Cell className="space-x-2 whitespace-nowrap p-4">
              <div className="flex items-center gap-x-3 ">
                <EditProductModal product={product} />
                <DeleteProductModal id={product.id} />
              </div>
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );
};
const MemoizedProductsTable = memo(ProductsTable);
export default EcommerceProductsPage;
