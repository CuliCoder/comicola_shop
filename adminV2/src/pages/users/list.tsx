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
import { HiHome, HiOutlineExclamationCircle } from "react-icons/hi";
import { FaUnlockAlt } from "react-icons/fa";
import { MdBlock } from "react-icons/md";
import NavbarSidebarLayout from "../../layouts/navbar-sidebar";
import axios from "../../config/axios";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import checkActionValid from "../../function/checkActionValid";
import { CiSearch } from "react-icons/ci";
import { useNavigate } from "react-router";
import React from "react";

interface User {
  id: number;
  roleId: number;
  address: string;
  fullName: string;
  phone_number: string;
  email: string;
  status: number;
}

const UserListPage: FC = function () {
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  useEffect(() => {
    const getAllUsers = async () => {
      const res = await axios.get("/api/v2/user");
      setAllUsers(res.data);
    };
    getAllUsers();
  }, []);
  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (search === "") {
        const res = await axios.get("/api/v2/user");
        setAllUsers(res.data);
        return;
      }
      const res = await axios.get(`/api/v2/user-search?search=${search}`);
      setAllUsers(res.data);
    } catch (error) {
      setAllUsers([]);
    }
  };
  return (
    <NavbarSidebarLayout isFooter={false}>
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
              <Breadcrumb.Item href="/users/list">Users</Breadcrumb.Item>
              <Breadcrumb.Item>List</Breadcrumb.Item>
            </Breadcrumb>
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl">
              All users
            </h1>
          </div>
          <div className="sm:flex">
            <div className="mb-3 hidden items-center dark:divide-gray-700 sm:mb-0 sm:flex sm:divide-x sm:divide-gray-100">
              <form className="lg:pr-3" onSubmit={handleSearch}>
                <Label htmlFor="users-search" className="sr-only">
                  Search
                </Label>
                <div className="relative mt-1 lg:w-64 xl:w-96">
                  <TextInput
                    id="users-search"
                    name="users-search"
                    placeholder="Search for users"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
              </form>
              <div className="mt-3 flex space-x-1 pl-0 sm:mt-0 sm:pl-2">
                <button type="submit" className="cursor-pointer p-2">
                  <CiSearch size="30" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden shadow">
              <MemoizedUserTable allUsers={allUsers} />
            </div>
          </div>
        </div>
      </div>
    </NavbarSidebarLayout>
  );
};

const AllUsersTable: FC<{ allUsers: User[] }> = function ({ allUsers }) {
  const role = useSelector((state: RootState) => state.role.currentAction.list);
  const navigate = useNavigate();

  interface SelectedUser {
    userId: number | null;
    status: number | null;
  }

  const [isOpen, setOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<SelectedUser>({
    userId: null,
    status: null,
  });

  const callModalChangeStatus = (
    userId: number,
    status: number,
    openModal: boolean
  ) => {
    setSelectedUser({ userId, status });
    setOpen(openModal);
  };

  const handleChangeStatus = async (
    userId: number | null,
    status: number | null
  ) => {
    try {
      await axios.put(`/api/v2/user/change-status`, {
        id: userId,
        status: status == 1 ? 0 : 1,
      });
      navigate(0);
    } catch (error) {
      console.log(error);
    }
  };

  const renderModalChangeStatus = () => (
    <Modal onClose={() => setOpen(false)} show={isOpen} size="md">
      <Modal.Header className="px-6 pt-6 pb-0">
        <span className="sr-only">Block user {selectedUser.userId}</span>
      </Modal.Header>
      <Modal.Body className="px-6 pt-0 pb-6">
        <div className="flex flex-col items-center gap-y-6 text-center">
          <HiOutlineExclamationCircle className="text-7xl text-red-500" />
          <p className="text-xl text-gray-500">
            Are you sure you want to{" "}
            {selectedUser.status == 1 ? "block" : "unlock"} user with ID:{" "}
            {selectedUser.userId}?
          </p>
          <div className="flex items-center gap-x-3">
            <Button
              color="failure"
              onClick={() => {
                handleChangeStatus(selectedUser.userId, selectedUser.status);
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
  );

  return (
    <>
      <Table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
        <Table.Head className="bg-gray-100 dark:bg-gray-700">
          <Table.HeadCell>ID</Table.HeadCell>
          <Table.HeadCell>Name</Table.HeadCell>
          <Table.HeadCell>Status</Table.HeadCell>
          <Table.HeadCell>Actions</Table.HeadCell>
        </Table.Head>
        <Table.Body className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
          {allUsers.map((user: User) => (
            <Table.Row className="hover:bg-gray-100 dark:hover:bg-gray-700">
              <Table.Cell className="whitespace-nowrap p-4 text-base font-normal text-gray-900 dark:text-white">
                {user.id}
              </Table.Cell>
              <Table.Cell className="mr-12 flex items-center space-x-6 whitespace-nowrap p-4 lg:mr-0">
                <img
                  className="h-10 w-10 rounded-full"
                  src="/images/users/neil-sims.png"
                  alt="Neil Sims avatar"
                />
                <div className="text-sm font-normal text-gray-500 dark:text-gray-400">
                  <div className="text-base font-semibold text-gray-900 dark:text-white max-w-[200px]">
                    {user.fullName}
                  </div>
                  <div className="text-sm font-normal text-gray-500 dark:text-gray-400">
                    {user.email}
                  </div>
                </div>
              </Table.Cell>
              <Table.Cell className="whitespace-nowrap p-4 text-base font-normal text-gray-900 dark:text-white">
                {user.status == 1 ? (
                  <div className="flex items-center">
                    <div className="mr-2 h-2.5 w-2.5 rounded-full bg-green-400"></div>{" "}
                    Active
                  </div>
                ) : (
                  <div className="flex items-center">
                    <div className="mr-2 h-2.5 w-2.5 rounded-full bg-red-500"></div>{" "}
                    Block
                  </div>
                )}
              </Table.Cell>
              <Table.Cell>
                <div className="flex items-center gap-x-3 whitespace-nowrap">
                  <Button.Group>
                    <Button
                      color="failure"
                      onClick={() => {
                        callModalChangeStatus(user.id, user.status, true);
                        console.log(user.id);
                      }}
                      disabled={
                        !checkActionValid(role, "users", "delete") &&
                        user.status == 0
                      }
                    >
                      <div className="flex items-center gap-x-2">
                        <MdBlock />
                        Block
                      </div>
                    </Button>
                    <Button
                      color="success"
                      onClick={() =>
                        callModalChangeStatus(user.id, user.status, true)
                      }
                      disabled={
                        !checkActionValid(role, "users", "delete") &&
                        user.status == 1
                      }
                    >
                      <div className="flex items-center gap-x-2">
                        <FaUnlockAlt />
                        Unlock
                      </div>
                    </Button>
                  </Button.Group>
                </div>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
      {renderModalChangeStatus()}
    </>
  );
};
const MemoizedUserTable = React.memo(AllUsersTable);
export default UserListPage;
