import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { FaTimes } from "react-icons/fa";
import { IoIosArrowBack } from "react-icons/io";
import { IoIosArrowForward } from "react-icons/io";
import { CiShoppingCart } from "react-icons/ci";
import { FaLock } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import {
  increaseQuantity,
  unincreaseQuantity,
  deleteProduct,
  changeQuantity,
  removeFromCart,
} from "../../Slice/cartSlice";
import { formatPrice } from "../../config/formatPrice";
import { setShowToast } from "../../Slice/MyToastSlice";
import {
  fetchApplyDiscount,
  clearApplyDiscount,
  setCodeDiscount,
  clearDiscount,
} from "../../Slice/discountSlice";
export default function Cart() {
  const itemsOfCart = useSelector((state) => state.cart.getCart.items);
  const [currentPrice, setCurrentPrice] = useState(0);

  const [inputDiscount, setInputDiscount] = useState("");

  const [status_login, setStatus_login] = useState(false);
  const status = useSelector((state) => state.status);
  const products = useSelector((state) => state.products.products_page);
  const discount = useSelector((state) => state.discount.discount);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const increaseItem = (item) => {
    const product = products.byUpdatedAt.find(
      (product) => product.id === item.id
    );
    if (product.quantity < item.quantity + 1) {
      return;
    }
    dispatch(increaseQuantity(item));
    {
      status.error === 0 && dispatch(changeQuantity({ item, offset: 1 }));
    }
  };

  const decreaseItem = (item) => {
    if (item.quantity === 1) {
      return;
    }
    dispatch(unincreaseQuantity(item));
    {
      status.error === 0 && dispatch(changeQuantity({ item, offset: -1 }));
    }
  };
  useEffect(() => {
    let total = 0;
    itemsOfCart.forEach((item) => {
      total += parseInt(item.price * item.quantity);
    });
    setCurrentPrice(total);
  }, [itemsOfCart]);
  useEffect(() => {
    setStatus_login(status.error === 0);
  }, [status.error]);
  const handlePayment = () => {
    const hasProduct = itemsOfCart.length > 0;
    const isLogin = status_login;
    if (!hasProduct || !isLogin) {
      dispatch(
        setShowToast({
          show: true,
          type: "error",
          message: !isLogin
            ? "Bạn cần đăng nhập để thanh toán"
            : "Giỏ hàng của bạn đang trống",
        })
      );
      navigate(!isLogin ? "/login" : "/products");
      return;
    }
    navigate("/checkout");
  };

  const checkDiscountValid = () => {
    if (inputDiscount == "") {
      dispatch(
        setShowToast({
          show: true,
          type: "warning",
          message: "Vui lòng nhập mã giảm giá",
        })
      );
      dispatch(clearDiscount());
      return;
    }
    dispatch(
      fetchApplyDiscount({
        coupon: inputDiscount,
        value_apply: currentPrice,
      })
    );
  };
  useEffect(() => {
    if (discount.error !== null) {
      dispatch(
        setShowToast({
          show: true,
          type: discount.error === 1 ? "error" : "success",
          message: discount.message,
        })
      );
      discount.error === 0
        ? dispatch(setCodeDiscount(inputDiscount))
        : dispatch(clearDiscount());
      dispatch(clearApplyDiscount());
    }
  }, [discount.error]);
  useEffect(() => {
    setInputDiscount(discount.code);
  }, [discount.code]);
  const carculatePrice = (price, discount) => {
    if (!discount) return price;
    return price - discountValue(price, discount);
  };
  const discountValue = (price, discount) => {
    const discountValue = discount.replace("%", "");
    return (price * discountValue) / 100;
  };
  const priceDiscount = useMemo(
    () => carculatePrice(currentPrice, discount.value),
    [currentPrice, discount.value]
  );
  return (
    <div>
      <div className="cart relative">
        <div className="breadcrumb bg-[#f4f9fc] h-20 flex items-center justify-center">
          <a href="/" className="px-1">
            Trang Chủ
          </a>{" "}
          / <p className="font-medium px-1"> Giỏ hàng</p>
        </div>
        {/* Cart Content */}
        <div className="cart-content py-10">
          <div className="heading font-extrabold text-2xl pb-10 w-[1170px] m-auto">
            <p>Giỏ hàng</p>
          </div>
          <div className="cart-box w-[1170px] m-auto">
            {/* Print List */}
            {itemsOfCart.map((item) => (
              <div
                className="item h-[154px] bg-[#fcfcfc] flex items-center justify-between my-2"
                key={item.id}
              >
                <div className="product-img w-[120px] object-cover">
                  <img src={item.thumbnail} alt="Anh san pham" />
                </div>
                <div className="product-name w-[280px] font-light">
                  <a href="/#">{item.name}</a>
                </div>
                <div className="product-price">{formatPrice(item.price)}</div>
                <div className="product-quantity border-slate-300 flex border justify-center items-center py-1 px-1">
                  <div
                    className="decrease p-1"
                    onClick={() => decreaseItem(item)}
                  >
                    <IoIosArrowBack />
                  </div>
                  <div className="quantity px-3">{item.quantity}</div>
                  <div
                    className="increase p-1"
                    onClick={() => {
                      increaseItem(item);
                    }}
                  >
                    <IoIosArrowForward />
                  </div>
                </div>
                <div className="product-total">
                  Giá sản phẩm: {formatPrice(item.total_price)}
                </div>
                <div
                  className="product-cancel border p-1 mr-5"
                  onClick={() => {
                    dispatch(deleteProduct(item));
                    dispatch(
                      setShowToast({
                        show: true,
                        type: "success",
                        message: "Xóa sản phẩm thành công",
                      })
                    );
                    {
                      status.error === 0 && dispatch(removeFromCart(item.id));
                    }
                  }}
                >
                  <FaTimes />
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between w-[1170px] m-auto py-10 border-b-2">
            <div className="coupons border-gray-700 border-solid border p-1 rounded-sm">
              <input
                type="text"
                value={inputDiscount}
                placeholder="Nhập mã giảm giá"
                onChange={(e) => setInputDiscount(e.target.value)}
                className="border-none outline-none w-[300px] px-2"
              />
              <button
                type="button"
                className="h-full w-28 bg-orange-500 text-white p-2 font-bold hover:bg-slate-900 duration-200"
                onClick={checkDiscountValid}
              >
                Apply
              </button>
            </div>
            <Link
              to="/products"
              className=" border flex items-center p-3 px-4 font-semibold"
            >
              <CiShoppingCart />
              <p>TIẾP TỤC MUA SẮM</p>
            </Link>
          </div>
        </div>

        {/* After Cart */}
        <div className="w-[1170px] m-auto mb-[40px]">
          <div className="flex justify-between">
            <div></div>
            <div>
              <div className="bg-[#fcfcfc] w-[540px] py-[40px] px-[30px] text-left rounded">
                <p className="font-bold mb-7">Cộng giỏ hàng</p>
                <div className="flex justify-between items-center">
                  <p className="text-thin text-sm">Tạm tính</p>
                  <span className="inline-block font-bold">
                    {formatPrice(currentPrice)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-thin text-sm">Khuyến mãi</p>
                  <span className="inline-block font-bold">
                    -{" "}
                    {formatPrice(
                      discount.value
                        ? discountValue(currentPrice, discount.value)
                        : 0
                    )}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-thin text-sm">Giao hàng</p>
                  <span className="inline-block font-bold">
                    Phí vận chuyển sẽ báo sau.
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-thin text-sm">Tổng</p>
                  <span className="inline-block font-bold">
                    {formatPrice(priceDiscount)}
                  </span>
                </div>
                <div>
                  <button
                    type="button"
                    className="h-full w-[300px] bg-orange-500 text-white p-2 font-bold hover:bg-slate-900 duration-200 mt-5 flex items-center justify-center "
                    onClick={handlePayment}
                  >
                    <FaLock className="mr-2" /> TIẾN HÀNH THANH TOÁN
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
