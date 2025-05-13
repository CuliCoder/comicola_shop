import type { FC } from "react";
import { DarkThemeToggle, Navbar } from "flowbite-react";
import Chat from "./Chat";
import { useState } from "react";

const ExampleNavbar: FC = function () {
  return (
    <Navbar fluid>
      <div className="w-full p-3 lg:px-5 lg:pl-3 top-0">
        <div className="flex items-center justify-between relative">
          <div className="flex items-center">
            <Navbar.Brand href="/">
              <img
                alt=""
                src="/images/Comi_shop_logo.png"
                className="mr-3 h-6 sm:h-8"
              />
            </Navbar.Brand>
          </div>
          <div className="flex items-center gap-3">
            <DarkThemeToggle />
          </div>
        </div>
      </div>
    </Navbar>
  );
};

export default ExampleNavbar;
