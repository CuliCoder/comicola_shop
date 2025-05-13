import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link } from "react-router-dom";
import { findAuthor } from "../../Slice/authorSlice";
import { Breadcrumb, Carousel } from "flowbite-react";
import "quill/dist/quill.snow.css";
import "./Author.css";
import ProductList from "../Products/ProductList";
const Author = React.memo(() => {
  const id_author = useParams().id;
  const dispatch = useDispatch();
  const [productlimit, setProductLimit] = useState([]);
  const { authors, author_current } = useSelector((state) => state.author);
  const { byUpdatedAt } = useSelector((state) => state.products.products_page);
  useEffect(() => {
    if (byUpdatedAt) {
      const products = byUpdatedAt.filter((product) => {
        return product.author_id == id_author;
      });
      setProductLimit(products);
    }
  }, [byUpdatedAt, id_author]);
  useEffect(() => {
    if (id_author == null) return;
    dispatch(findAuthor({ id: id_author }));
  }, [id_author, authors]);
  const countPage = useMemo(
    () => Math.ceil(productlimit.length / 4),
    [productlimit]
  );
  const pages = useMemo(
    () => Array.from({ length: countPage }, (_, i) => i + 1),
    [countPage]
  );
  const step = 4;

  return (
    <div className="relative">
      <div className="author pb-[120px]">
        <Breadcrumb
          aria-label="Solid background breadcrumb example"
          className="bg-[#f4f9fc] h-[80px] items-centerpx-5 py-3 dark:bg-gray-800"
        >
          <div className="w-[1170px] m-auto">
            <div className="flex justify-center items-center">
              <Breadcrumb.Item>
                <Link to="/">Trang Chủ</Link>
              </Breadcrumb.Item>
              <Breadcrumb.Item>
                <div className="text-gray-800">
                  {author_current && author_current.label}
                </div>{" "}
              </Breadcrumb.Item>
            </div>
            <div className="flex justify-center items-center text-3xl font-bold">
              {author_current && author_current.label}
            </div>
          </div>
        </Breadcrumb>
        <div className="desc w-[1170px] m-auto py-8 px-10 text-left">
          <div className="ql-editor">
            {author_current && (
              <div
                dangerouslySetInnerHTML={{ __html: author_current.information }}
              />
            )}
          </div>
        </div>
        <div className="text-left w-[1170px] mx-auto my-32">
          <h1 className="font-medium text-md">
            Mua sách và các sản phẩm của tác giả {author_current?.label}
          </h1>
          <div className="h-56 sm:h-64 xl:h-80 2xl:h-96 py-5">
            <Carousel className="h-100">
              {pages.map((page) => {
                const startIndex = (page - 1) * step;
                const endIndex = startIndex + step;
                const products = productlimit.slice(startIndex, endIndex);
                return <ProductList products={products} />;
              })}
            </Carousel>
          </div>
        </div>
      </div>
    </div>
  );
});
export default Author;
