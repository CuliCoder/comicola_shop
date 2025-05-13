import React, { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { FaCartPlus } from "react-icons/fa";
import "./Checkout.css";
import { formatPrice } from "../../config/formatPrice.js";
import { setShowToast } from "../../Slice/MyToastSlice";
import { fetchAddOrder, clearAddOrder } from "../../Slice/userSlice";
import { rgAddress, rgName, rgPhone, rgEmail } from "../../utils/regex";
import Spinner from "../Spinner/Spinner.js";
import {
  fetchApplyDiscount,
  clearApplyDiscount,
  setCodeDiscount,
  clearDiscount,
} from "../../Slice/discountSlice";
import { clearCart } from "../../Slice/cartSlice.js";
import { fetchAllProducts } from "../../Slice/products";
import axios from "../../config/configAxios.js";
import { io } from "socket.io-client";
const Checkout = React.memo(() => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [note, setNote] = useState("");
  const [Province, setProvince] = useState({
    code: null,
    name: null,
  });
  const [District, setDistrict] = useState({
    code: null,
    name: null,
  });
  const [Ward, setWard] = useState({
    code: null,
    name: null,
  });
  const [detailAddress, setdetailAddress] = useState("");
  const [shipFee, setShipFee] = useState(0);
  const [currentPrice, setCurrentPrice] = useState(0);
  const [isLoad, setLoad] = useState(true);
  const [inputDiscount, setInputDiscount] = useState("");
  const userAddress = useSelector((state) => state.user.address);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const productInCart = useSelector((state) => state.cart.getCart.items);
  const discount = useSelector((state) => state.discount.discount);
  const dataProvince = useSelector((state) => state.address.provinces);
  const dataDistrict = useSelector((state) => state.address.districts);
  const dataWards = useSelector((state) => state.address.wards);
  const [isChange, setIsChange] = useState(false);
  const userAddOrder = useSelector((state) => state.user.addOrder);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io.connect(process.env.REACT_APP_API_URL);
    setSocket(newSocket);
    return () => {
      newSocket.close();
    };
  }, []);

  useEffect(() => {
    if (
      userAddress.list.length > 0 &&
      dataDistrict.length > 0 &&
      dataProvince.length > 0 &&
      dataWards.length > 0
    ) {
      userAddress.list[0].addressList.forEach((address) => {
        if (address.default === "1") {
          setFirstName(address.firstName);
          setLastName(address.lastName);
          setPhoneNumber(address.phoneNumber);
          setEmail(address.email);
          const province = dataProvince.find((item) => {
            return item.name === address.province;
          });
          setProvince({
            code: province.code,
            name: province.name,
          });
          const district = dataDistrict.find((item) => {
            return item.name === address.district;
          });
          setDistrict({
            code: district.code,
            name: district.name,
          });
          const ward = dataWards.find((item) => {
            return item.name === address.ward;
          });
          setWard({
            code: ward.code,
            name: ward.name,
          });
          setdetailAddress(address.detail);
          setLoad(false);
          return;
        }
      });
    }
    setLoad(false);
  }, [userAddress.list, dataDistrict, dataProvince, dataWards]);
  useEffect(() => {
    setShipFee(Province.code ? (Province.code === 79 ? 15000 : 35000) : null);
    if (Province.code && isChange) {
      setDistrict({
        code: null,
        name: null,
      });
    }
  }, [Province.code]);
  useEffect(() => {
    if (District.code && isChange) {
      setWard({
        code: null,
        name: null,
      });
    }
  }, [District.code]);
  const checkValid = () => {
    if (
      !lastName ||
      !firstName ||
      !phoneNumber ||
      !email ||
      !detailAddress ||
      !Province.code ||
      !District.code ||
      !Ward.code
    ) {
      return "Vui lòng điền đầy đủ thông tin";
    }
    if (!rgName.test(lastName)) {
      return "Tên không hợp lệ";
    }
    if (!rgName.test(firstName)) {
      return "Họ không hợp lệ";
    }
    if (!rgPhone.test(phoneNumber)) {
      return "Số điện thoại không hợp lệ";
    }
    if (!rgEmail.test(email)) {
      return "Email không hợp lệ";
    }
    if (!rgAddress.test(detailAddress)) {
      return "Địa chỉ không hợp lệ";
    }
    return null;
  };
  const handleAcceptOrder = () => {
    const check = checkValid();
    if (check) {
      dispatch(
        setShowToast({
          show: true,
          type: "error",
          message: check,
        })
      );
      return;
    }
    dispatch(
      fetchAddOrder({
        fullname: `${firstName} ${lastName}`,
        phoneNumber: phoneNumber,
        email: email,
        address: `${detailAddress}, ${Ward.name}, ${District.name}, ${Province.name}`,
        products: productInCart,
        note: note,
        id_coupon: discount.id,
      })
    );
  };
  const clearCartSystem = async () => {
    setLoad(true);
    await axios
      .delete("/api/cart/clearCart")
      .then((res) => {
        setLoad(false);
      })
      .catch((err) => {
        setLoad(false);
      });
  };
  useEffect(() => {
    if (userAddOrder.error !== null) {
      if (userAddOrder.error === 0) {
        socket.emit("newOrder");
        dispatch(clearDiscount());
        dispatch(fetchAllProducts());
        dispatch(clearCart());
        clearCartSystem();
        navigate("/");
      }
      dispatch(
        setShowToast({
          show: true,
          type: userAddOrder.error === 1 ? "error" : "success",
          message: userAddOrder.message,
        })
      );
      dispatch(clearAddOrder());
    }
  }, [userAddOrder.error]);
  useEffect(() => {
    let total = 0;
    productInCart.forEach((item) => {
      total += parseInt(item.price * item.quantity);
    });
    setCurrentPrice(total);
  }, [productInCart]);

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
  const carculatePrice = (price, discount, shipFee) => {
    if (!discount) return price + shipFee;
    return price - discountValue(price, discount) + shipFee;
  };
  const discountValue = (price, discount) => {
    const discountValue = discount.replace("%", "");
    return (price * discountValue) / 100;
  };
  const priceDiscount = useMemo(
    () => carculatePrice(currentPrice, discount.value, shipFee),
    [currentPrice, discount.value, shipFee]
  );
  return (
    <div>
      {isLoad && <Spinner />}
      <div className="breadcrumb bg-[#f4f9fc] h-[110px] py-5 ">
        <div className="flex items-center justify-center">
          <Link to="/" className="px-1">
            Trang Chủ
          </Link>{" "}
          /{" "}
          <Link to="#" className="font-medium px-1">
            {" "}
            Thanh toán
          </Link>
        </div>
        <div className="text-3xl font-bold text-center">Thanh toán</div>
      </div>
      <div className="w-[1170px] m-auto relative">
        <div className="checkout">
          <div></div>
          <div className="grid grid-cols-2 gap-x-[30px] mt-20">
            <div className="location border p-6  pt-[50px]">
              <p className="font-bold text-lg">THÔNG TIN GIAO HÀNG</p>
              <p className="text-base font-light text-slate-500 ">
                Vui lòng nhập thông tin của bạn vào bên dưới để tiếp tục thanh
                toán
              </p>
              <div className="flex gap-x-10 mt-5 justify-between">
                <div>
                  <div className="flex gap-x-1">
                    <label htmlFor="name ">Tên </label>
                    <span className="inline text-[red]">*</span>
                  </div>
                  <input
                    type="text"
                    name=""
                    id="name"
                    placeholder="Nhập tên"
                    className="h-[30px] border-slate-200 focus:ring-0 w-[230px] "
                    onChange={(e) => {
                      setLastName(e.target.value);
                    }}
                    value={lastName}
                    required
                  />
                </div>
                <div>
                  <div className="flex gap-x-1">
                    <label htmlFor="">Họ</label>
                    <span className="inline text-[red]">*</span>
                  </div>
                  <input
                    type="text"
                    name=""
                    id="name"
                    placeholder="Nhập họ"
                    className="h-[30px] border-slate-200 focus:ring-0 w-[230px] "
                    onChange={(e) => {
                      setFirstName(e.target.value);
                    }}
                    value={firstName}
                    required
                  />
                </div>
              </div>

              <div className="flex gap-x-10 mt-7 justify-between">
                <div>
                  <div className="flex gap-x-1">
                    <label htmlFor="name">Số điện thoại</label>
                    <span className="inline text-[red]">*</span>
                  </div>
                  <input
                    type="text"
                    name=""
                    id="phoneNumber"
                    placeholder="Số điện thoại"
                    className="h-[30px] border-slate-200 focus:ring-0 w-[230px] "
                    onChange={(e) => {
                      setPhoneNumber(e.target.value);
                    }}
                    value={phoneNumber}
                    required
                  />
                </div>
                <div>
                  <div className="flex gap-x-1">
                    <label htmlFor="email ">Địa chỉ Email</label>
                    <span className="inline text-[red]">*</span>
                  </div>
                  <input
                    type="text"
                    name=""
                    id="email"
                    placeholder="Địa chỉ Email"
                    className="h-[30px] border-slate-200 focus:ring-0 w-[230px] "
                    onChange={(e) => {
                      setEmail(e.target.value);
                    }}
                    value={email}
                    required
                  />
                </div>
              </div>
              <div className="mt-10">
                <div className="flex justify-between gap-x-10">
                  <div>
                    <div className="flex gap-x-1">
                      <label htmlFor="city block">Chọn tỉnh thành</label>
                      <span className="inline text-[red]">*</span>
                    </div>
                    <select
                      id="city"
                      onChange={(e) => {
                        const Province = JSON.parse(e.target.value);
                        setProvince(Province);
                        setIsChange(true);
                      }}
                      className="block h-[40px] border-slate-200 focus:ring-0 w-[230px] mt-1"
                    >
                      <option
                        value={JSON.stringify({
                          code: null,
                          name: null,
                        })}
                        defaultValue
                      >
                        Chọn tỉnh thành
                      </option>
                      {dataProvince.map((item) => {
                        return (
                          <option
                            key={item.code}
                            value={JSON.stringify({
                              code: item.code,
                              name: item.name,
                            })}
                            selected={item.code === Province.code}
                          >
                            {item.name}
                          </option>
                        );
                      })}
                    </select>
                  </div>

                  <div>
                    <div className="flex gap-x-1">
                      <label htmlFor="district">Chọn quận, huyện</label>
                      <span className="inline text-[red]">*</span>
                    </div>
                    <select
                      id="district"
                      onChange={(e) => {
                        const District = JSON.parse(e.target.value);
                        setDistrict(District);
                        setIsChange(true);
                      }}
                      className="block h-[40px] border-slate-200 focus:ring-0 w-[230px] mt-1"
                    >
                      <option
                        value={JSON.stringify({
                          code: null,
                          name: null,
                        })}
                        defaultValue
                      >
                        Chọn quận huyện
                      </option>
                      {dataDistrict.map((item) => {
                        if (item.province_code === Province.code)
                          return (
                            <option
                              key={item.code}
                              value={JSON.stringify({
                                code: item.code,
                                name: item.name,
                              })}
                              selected={item.code === District.code}
                            >
                              {item.name}
                            </option>
                          );
                      })}
                    </select>
                  </div>
                </div>

                <div className="flex justify-between gap-x-10 mt-5">
                  <div>
                    <div className="flex gap-x-1">
                      <label htmlFor="ward">Chọn phường, xã</label>
                      <span className="inline text-[red]">*</span>
                    </div>

                    <select
                      id="ward"
                      className="block h-[40px] border-slate-200 focus:ring-0 w-[230px] mt-1"
                      onChange={(e) => {
                        const Ward = JSON.parse(e.target.value);
                        setWard(Ward);
                      }}
                    >
                      <option
                        value={JSON.stringify({
                          code: null,
                          name: null,
                        })}
                        defaultValue
                      >
                        Chọn phường xã
                      </option>
                      {dataWards.map((item) => {
                        if (item.district_code === District.code)
                          return (
                            <option
                              key={item.code}
                              value={JSON.stringify({
                                code: item.code,
                                name: item.name,
                              })}
                              selected={item.code === Ward.code}
                            >
                              {item.name}
                            </option>
                          );
                      })}
                    </select>
                  </div>
                  <div>
                    <div className="flex gap-x-1">
                      <label htmlFor="address">Địa chỉ</label>
                      <span className="inline text-[red]">*</span>
                    </div>

                    <input
                      type="text"
                      name=""
                      id="address"
                      className="block h-[40px] border-slate-200 focus:ring-0 w-[230px] mt-1"
                      placeholder="địa chỉ chi tiết"
                      onChange={(e) => {
                        setdetailAddress(e.target.value);
                      }}
                      value={detailAddress}
                    />
                  </div>
                </div>
                <div className="note mt-20">
                  <h1 className="font-bold text-lg">THÔNG TIN KHÁC</h1>
                  <p className="font-semibold text-base text-slate-700 mb-[20]">
                    {" "}
                    Ghi chú đơn hàng (tuỳ chọn)
                  </p>
                  <textarea
                    name="note"
                    id="note"
                    rows="10"
                    placeholder="Ghi chú về đơn hàng, ví dụ: Làm ơn giao hàng ngoài giờ hành chính "
                    className="resize w-[520px] max-w-[520px] min-w-[420px] focus:ring-0"
                    onChange={(e) => {
                      setNote(e.target.value);
                    }}
                    value={note}
                  ></textarea>
                </div>
              </div>
            </div>
            <div className="method-payment border p-6 pt-[50px]">
              <p className="font-bold text-lg">XÁC NHẬN ĐƠN HÀNG</p>
              <p className="text-base font-light text-slate-500 ">
                Hãy xác nhận lần cuối trước khi đặt hàng, bạn có thể thay đổi{" "}
                <Link to="/cart" className="text-red-400">
                  ở đây
                </Link>
              </p>
              <div className="mt-5">
                {productInCart.map((product) => (
                  <div className="flex justify-between items-center mb-2 bg-[#fcfcfc] pr-2">
                    <div className="w-[96px] h-[123px]">
                      <img src={product.thumbnail} alt="" />
                    </div>
                    <Link
                      to={`/product/${product.id}`}
                      className="w-[218px] font-semibold"
                    >
                      <p>{product.name}</p>
                    </Link>
                    <div className="font-bold">
                      <span>{formatPrice(parseInt(product.price))}</span>
                    </div>
                    <div className="font-bold">
                      <span>x{product.quantity}</span>
                    </div>
                    <div className="total font-bold">
                      <p>{formatPrice(product.price * product.quantity)}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="coupons border-gray-700 border-solid border p-1 rounded-sm w-[430px]">
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

              <div className="mt-[20px] bg-[#ebebeb] p-5">
                <p className="font-bold text-xl">Giá trị đơn hàng</p>
                <div className="flex justify-between items-center">
                  <p className="font-base text-slate-500">Giá sản phẩm</p>
                  <span className="font-bold">{formatPrice(currentPrice)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <p className="font-base text-slate-500">Được giảm</p>
                  <span className="font-bold">
                    -{" "}
                    {formatPrice(
                      discount.value
                        ? discountValue(currentPrice, discount.value)
                        : 0
                    )}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <p className="font-base text-slate-500">Giao hàng</p>
                  <span className="font-bold">
                    GHTK đường bộ: {formatPrice(shipFee)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <p className="font-base text-slate-500">Tổng</p>
                  <span className="font-bold">
                    {formatPrice(priceDiscount)}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div>
            <button
              type="button"
              className={`h-[40px] w-[180px] m-auto bg-orange-500 text-white p-2 font-bold
                    hover:bg-slate-900 duration-200 items-center justify-center flex my-20
                    `}
              onClick={handleAcceptOrder}
            >
              <FaCartPlus className=" w-5 h-10 px-1" />
              ĐẶT HÀNG
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});
export default Checkout;
