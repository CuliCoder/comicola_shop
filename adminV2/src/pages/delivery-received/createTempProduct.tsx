import type { FC } from "react";
import { Button } from "flowbite-react";
import NavbarSidebarLayout from "../../layouts/navbar-sidebar";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Link } from "react-router-dom";
import axios from "../../config/axios";

interface Values {
  name: string;
  author: string;
}

const CreateTempProduct: FC = () => {
  const initialValues: Values = { name: "", author: "" };

  const validateSchema = Yup.object({
    name: Yup.string()
      .max(255, "Must be 255 characters or less")
      .required("Required"),
    author: Yup.string()
      .max(20, "Must be 20 characters or less")
      .required("Required"),
  });
  return (
    <NavbarSidebarLayout isFooter={false}>
      <div className="block items-center justify-between border-b border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800 sm:flex"></div>
      <div className="flex flex-col">
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden shadow p-10 bg-white h-full">
              <div className="space-y-6">
                <h3 className="text-xl font-medium text-gray-900 dark:text-white">
                  Create Temporary Product
                </h3>

                <div className="flex gap-5">
                  <Formik
                    initialValues={initialValues}
                    validationSchema={validateSchema}
                    onSubmit={(values, actions) => {
                      const result = axios.post("", values);
                      actions.setSubmitting(false);
                    }}
                  >
                    <Form>
                      <div className="mb-5 flex">
                        <label htmlFor="name">Name Product</label>
                        <Field
                          id="name"
                          name="name"
                          placeholder="Name"
                          className="ml-3"
                        />
                        <ErrorMessage
                          name="name"
                          component="div"
                          className="error text-sm text-red-500 "
                        />
                      </div>
                      <div className="mb-10 flex">
                        <label htmlFor="author">Author</label>
                        <Field
                          id="author"
                          name="author"
                          placeholder="Author"
                          className="ml-3"
                        />
                        <ErrorMessage
                          name="author"
                          component="div"
                          className="error text-sm text-red-500 "
                        />
                      </div>
                      <div className="w-full flex justify-between">
                        <Link to="/delivery-received">
                          <Button color="light">Hủy</Button>
                        </Link>
                        <div></div>
                        <Button type="submit">Gửi yêu cầu</Button>
                      </div>
                    </Form>
                  </Formik>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </NavbarSidebarLayout>
  );
};

export default CreateTempProduct;
