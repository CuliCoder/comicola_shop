import React from "react";
import { Link } from "react-router-dom";
import { FaCartPlus } from "react-icons/fa";

const ProductList = React.memo(({ products }) => {
  return (
    <div className="flex gap-x-5 bg-white py-10">
      {products.map((product) => (
        <Link
          to={`/product/${product.id}`}
          key={product.id}
          className="w-1/4 h-[360px] product-item relative duration-1000 hover:cursor-pointer hover:shadow-md p-3"
        >
          <div className="h-[250px] object-cover">
            <img src={product.thumbnail} alt="" className="scale-90" />
          </div>
          <div className="name duration-100">
            <p className="mt-[40px] font-normal w-full mb-5">{product.title}</p>
            <span className="font-medium my-4">{product.price}₫</span>
          </div>
          <button
            type="button"
            className={`h-[40px] w-11/12 m-auto bg-orange-500 text-white p-2 font-medium
                        hover:bg-slate-900 duration-200 items-center justify-center absolute top-[80%] left-3
                        `}
          >
            <FaCartPlus className="w-5 h-10 px-1" />
            THÊM VÀO GIỎ HÀNG
          </button>
        </Link>
      ))}
    </div>
  );
});
export default ProductList;
