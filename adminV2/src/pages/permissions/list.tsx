/* eslint-disable jsx-a11y/anchor-is-valid */
import {
  Breadcrumb,
  Checkbox,
  Label,
  Table,
  TextInput,
  Button,
  Modal,
} from "flowbite-react";
import type { FC } from "react";
import { useState, useEffect } from "react";
import { HiHome } from "react-icons/hi";
import { IoSearchSharp } from "react-icons/io5";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import NavbarSidebarLayout from "../../layouts/navbar-sidebar";

import axios from "../../config/axios";

import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../store";
import { fetchAllPermission, fetchPermission } from "../../Slice/role";
import CheckPermission from "../../function/checkPermission";
import { showToast } from "../../Slice/toast";
import ToastComponent from "../../components/toast";
import { reloadSide } from "../../function/reloadSide";

const PermissionPage: FC = function () {
  const [openModal, setOpenModal] = useState(false);
  const [changePermissions, setChangePermissions] = useState<any[]>([]);
  const dispatch = useDispatch<AppDispatch>();

  const handleSaveChange = async () => {
    const result = await axios.put("/api/v2/role-change", {
      change: JSON.stringify(changePermissions),
      entity: "permissions",
      action: "update",
    });
    if (result) {
      dispatch(
        showToast({ message: "Save change successfully", type: "success" })
      );
      reloadSide();
    }
  };

  const handleUpdateChangePermissions = (updatedPermissions: any[]) => {
    setChangePermissions(updatedPermissions);
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
              <Breadcrumb.Item href="/orders/list">Permissions</Breadcrumb.Item>
            </Breadcrumb>
          </div>
          <div className="sm:flex md:justify-between">
            <div className="mb-3 hidden items-center dark:divide-gray-700 sm:mb-0 sm:flex sm:divide-x sm:divide-gray-100">
              <h1 className="font-bold">Phân quyền linh động</h1>
            </div>
            <div>
              <Button color="success" onClick={handleSaveChange}>
                Save Change
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden shadow">
              <AllEmployeesTable
                onUpdateChangePermission={handleUpdateChangePermissions}
              />
            </div>
          </div>
        </div>
        <Modal
          show={openModal}
          size="md"
          onClose={() => setOpenModal(false)}
          popup
        >
          <Modal.Header />
          <Modal.Body>
            <div className="text-center">
              <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
              <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                Are you sure you want to delete this product?
              </h3>
              <div className="flex justify-center gap-4">
                <Button color="failure" onClick={() => setOpenModal(false)}>
                  {"Yes, I'm sure"}
                </Button>
                <Button color="gray" onClick={() => setOpenModal(false)}>
                  No, cancel
                </Button>
              </div>
            </div>
          </Modal.Body>
        </Modal>
      </div>
    </NavbarSidebarLayout>
  );
};

interface AllEmployeesTableProps {
  onUpdateChangePermission: (updatedPermissions: any[]) => void;
}

const AllEmployeesTable: FC<AllEmployeesTableProps> = function ({
  onUpdateChangePermission,
}) {
  type PermissionItem = {
    permission_id: number;
    action: string;
  };

  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    dispatch(fetchAllPermission());
    dispatch(fetchPermission());
  }, [dispatch]);

  const allPermission = useSelector(
    (state: any) => state.role.allPermission.list
  );

  const permission = useSelector((state: any) => state.role.role.list);

  const [changedPermissions, setChangedPermissions] = useState<any[]>([]);

  useEffect(() => {
    onUpdateChangePermission(changedPermissions);
  }, [changedPermissions, onUpdateChangePermission]);

  const handleCheckboxChange = (
    employeeId: number,
    permission_id: number,
    checked: boolean
  ) => {
    const updatedPermissions = [...permission];
    const employeeIndex = updatedPermissions.findIndex(
      (emp) => emp.role_id === employeeId
    );

    if (employeeIndex !== -1) {
      const permissionIndex = updatedPermissions[
        employeeIndex
      ]?.listAction.findIndex(
        (perm: any) => perm.permission_id === permission_id
      );

      if (permissionIndex === -1) {
        if (checked === true) {
          changedPermissions.push({
            employeeId,
            permission_id,
            checked,
          });
        } else {
          const updatedChangedPermissions = changedPermissions.filter(
            (change) =>
              !(
                change.employeeId === employeeId &&
                change.permission_id === permission_id
              )
          );
          setChangedPermissions(updatedChangedPermissions);
        }
      } else {
        if (checked === false) {
          changedPermissions.push({
            employeeId,
            permission_id,
            checked,
          });
        } else {
          const updatedChangedPermissions = changedPermissions.filter(
            (change) =>
              !(
                change.employeeId === employeeId &&
                change.permission_id === permission_id
              )
          );
          setChangedPermissions(updatedChangedPermissions);
        }
      }
    } else {
      if (checked === true) {
        changedPermissions.push({
          employeeId,
          permission_id,
          checked,
        });
      } else {
        const updatedChangedPermissions = changedPermissions.filter(
          (change) =>
            !(
              change.employeeId === employeeId &&
              change.permission_id === permission_id
            )
        );
        setChangedPermissions(updatedChangedPermissions);
      }
    }
  };

  return (
    <Table
      striped
      className="min-w-full divide-y divide-gray-200 dark:divide-gray-600"
    >
      <Table.Head className="bg-gray-50 dark:bg-gray-700">
        <Table.HeadCell className="w-[250px]">
          <div>Role</div>
        </Table.HeadCell>
        <Table.HeadCell className="text-center">Permission</Table.HeadCell>
      </Table.Head>

      <Table.Body className="bg-white dark:bg-gray-800">
        {allPermission &&
          allPermission.map((item: any) => (
            <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800 mb-3">
              <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                {item.role_name}
              </Table.Cell>
              <Table.Cell className="font-bold">
                {item.list &&
                  item.list.map((line: any) => (
                    <div className="flex justify-between mb-1">
                      <div className="w-18">
                        <p>{line.entity}</p>
                      </div>
                      <div className="flex space-x-[150px]">
                        {line.listAction.map((action: PermissionItem) => (
                          <div key={action.permission_id}>
                            <span>{action.action}</span>
                            <Checkbox
                              defaultChecked={CheckPermission(
                                permission,
                                item.role_id,
                                action.permission_id
                              )}
                              onChange={(e) => {
                                handleCheckboxChange(
                                  item.role_id,
                                  action.permission_id,
                                  e.target.checked
                                );
                              }}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
              </Table.Cell>
            </Table.Row>
          ))}
      </Table.Body>
    </Table>
  );
};

export default PermissionPage;
