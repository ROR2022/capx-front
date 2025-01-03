"use client";
import {
  Navbar as NextUINavbar,
  NavbarContent,
  NavbarMenu,
  NavbarMenuToggle,
  NavbarBrand,
  NavbarItem,
  NavbarMenuItem,
} from "@nextui-org/navbar";
import { Link } from "@nextui-org/link";
import { link as linkStyles } from "@nextui-org/theme";
import NextLink from "next/link";
import clsx from "clsx";
import Image from "next/image";
import { useEffect } from "react";
import { useLocalStorage } from "usehooks-ts";
import { useDispatch, useSelector } from "react-redux";

import { siteConfig } from "@/config/site";
import { ThemeSwitch } from "@/components/theme-switch";
import { GithubIcon, LinkedinIcon, HackerRankIcon } from "@/components/icons";
import { DataUser, initialState, RootState, setUser } from "@/redux/userSlice";
import {
  LOCALSTORAGE_KEY,
  MAIN_APP_LOGO,
  MAIN_APP_NAME,
} from "@/dataEnv/dataEnv";

export const Navbar = () => {
  const user: DataUser = useSelector((state: RootState) => state.user);
  const [storedDataUser] = useLocalStorage<DataUser>(
    LOCALSTORAGE_KEY,
    initialState,
  );
  const dispatch = useDispatch();

  useEffect(() => {
    //console.log("dataUser: ", user);
  }, [user]);

  useEffect(() => {
    //console.log("storedDataUser: ", storedDataUser);
    if (storedDataUser.email && !user.email) {
      dispatch(setUser(storedDataUser));
    }
  }, [storedDataUser]);

  return (
    <NextUINavbar maxWidth="xl" position="sticky">
      <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
        <NavbarBrand as="li" className="gap-3 max-w-fit">
          <NextLink className="flex justify-start items-center gap-1" href="/">
            <Image
              alt="Main App Logo"
              height={30}
              src={user.imageUrl ? user.imageUrl : MAIN_APP_LOGO}
              width={30}
            />
            <p className="font-bold text-inherit">
              {user.name ? user.name : MAIN_APP_NAME}
            </p>
          </NextLink>
        </NavbarBrand>
        {user.email ? (
          <ul className="hidden lg:flex gap-4 justify-start ml-2">
            {siteConfig.navItems.map((item) => (
              <NavbarItem key={item.href}>
                <NextLink
                  className={clsx(
                    linkStyles({ color: "foreground" }),
                    "data-[active=true]:text-primary data-[active=true]:font-medium",
                  )}
                  color="foreground"
                  href={item.href}
                >
                  {item.label}
                </NextLink>
              </NavbarItem>
            ))}
          </ul>
        ) : (
          <NavbarItem
            key="login-page"
            className="hidden lg:flex gap-4 justify-start ml-2"
          >
            <NextLink
              className={clsx(
                linkStyles({ color: "foreground" }),
                "data-[active=true]:text-primary data-[active=true]:font-medium"
              )}
              color="foreground"
              href="/login"
            >
              Login
            </NextLink>
          </NavbarItem>
        )}
      </NavbarContent>

      <NavbarContent
        className="hidden sm:flex basis-1/5 sm:basis-full"
        justify="end"
      >
        <NavbarItem className="hidden sm:flex gap-2">
          <Link
            isExternal
            aria-label="Twitter"
            href={siteConfig.links.linkedin}
          >
            <LinkedinIcon className="text-default-500" />
          </Link>
          <Link
            isExternal
            aria-label="Discord"
            href={siteConfig.links.hackerRank}
          >
            <HackerRankIcon className="text-default-500" />
          </Link>
          <Link isExternal aria-label="Github" href={siteConfig.links.github}>
            <GithubIcon className="text-default-500" />
          </Link>
          <ThemeSwitch />
        </NavbarItem>
        <NavbarMenuToggle className="flex lg:hidden" />
      </NavbarContent>

      <NavbarContent className="sm:hidden basis-1 pl-4" justify="end">
        <Link isExternal aria-label="Github" href={siteConfig.links.github}>
          <GithubIcon className="text-default-500" />
        </Link>
        <ThemeSwitch />
        <NavbarMenuToggle />
      </NavbarContent>

      <NavbarMenu>
        <div className="mx-4 mt-2 flex flex-col gap-2">
          {user.email ? (
            siteConfig.navMenuItems.map((item, index) => (
              <NavbarMenuItem key={`${item}-${index}`}>
                <Link href={item.href} size="lg">
                  {item.label}
                </Link>
              </NavbarMenuItem>
            ))
          ) : (
            <NavbarMenuItem key={`login-page`}>
              <Link href="/login" size="lg">
                Login
              </Link>
            </NavbarMenuItem>
          )}
        </div>
      </NavbarMenu>
    </NextUINavbar>
  );
};
