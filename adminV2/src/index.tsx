import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import store from "./store";
import "./index.css";
import theme from "./flowbite-theme";
import { Flowbite } from "flowbite-react";
import { Routes, Route } from "react-router";
import { BrowserRouter } from "react-router-dom";
import DashboardPage from "./pages/index";
import SignInPage from "./pages/authentication/sign-in";
import EcommerceProductsPage from "./pages/e-commerce/products";
import UserListPage from "./pages/users/list";
import OrderListPage from "./pages/orders/list";
import PermissionPage from "./pages/permissions/list";
import DeliveryReceivedPage from "./pages/delivery-received";
import CreateTempProduct from "./pages/delivery-received/createTempProduct";
import CompanyDeliveryPage from "./pages/company-delivery";
import EmployeeListPage from "./pages/employee";
import AuthorListPage from "./pages/author";
import DiscountPage from "./pages/discount";
import CategoryPage from "./pages/category";
import ToastComponent from "./components/toast";
import { ContextProvider } from "./context/contextAPI.jsx";
const container = document.getElementById("root");

if (!container) {
  throw new Error("React root element doesn't exist!");
}

const root = createRoot(container);

root.render(
  <StrictMode>
    <Provider store={store}>
      <ContextProvider>
        <Flowbite theme={{ theme }}>
          <ToastComponent />
          <BrowserRouter>
            <Routes>
              <Route path="/authentication/sign-in" element={<SignInPage />} />
              <Route path="/" element={<DashboardPage />} index />
              <Route
                path="/e-commerce/products"
                element={<EcommerceProductsPage />}
              />
              <Route path="/users/list" element={<UserListPage />} />
              <Route path="/orders/list" element={<OrderListPage />} />
              <Route path="/employee/list" element={<EmployeeListPage />} />
              <Route path="/author/list" element={<AuthorListPage />} />
              <Route path="/permissions/list" element={<PermissionPage />} />
              <Route
                path="/delivery-received"
                element={<DeliveryReceivedPage />}
              />
              <Route
                path="/delivery-received/create-temporary-product"
                element={<CreateTempProduct />}
              />
              <Route
                path="/company-delivery"
                element={<CompanyDeliveryPage />}
              />
              <Route path="/discount" element={<DiscountPage />} />
              <Route path="/category" element={<CategoryPage />} />
            </Routes>
          </BrowserRouter>
        </Flowbite>
      </ContextProvider>
    </Provider>
  </StrictMode>
);
