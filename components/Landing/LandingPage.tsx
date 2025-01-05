"use client";
import { useRouter } from "next/navigation";
import { useMediaQuery, useLocalStorage } from "usehooks-ts";
import React, { useEffect } from "react";
import { Card, CardFooter, Image, Button } from "@nextui-org/react";
//import Image from "next/image";

import { title } from "../primitives";

import {
  LOCALSTORAGE_KEY,
  MAIN_APP_NAME,
  LOGO_LOGIN,
  LOGO_REGISTER,
  MAIN_APP_LOGO,
} from "@/dataEnv/dataEnv";
import { DataUser, initialState } from "@/redux/userSlice";
import ImageLogin from "@/public/logoLogin.png";
import ImageRegister from "@/public/logoRegister.jpg";


const LandingPage = () => {
  const router = useRouter();
  //const isMobile = ;
  const isMobile = useMediaQuery("(max-width: 640px)");
  const [storedDataUser] = useLocalStorage<DataUser>(
    LOCALSTORAGE_KEY,
    initialState,
  );

  useEffect(() => {
    if (storedDataUser.email) {
      router.push("/dashboard");
    }
  }, [storedDataUser]);

  return (
    <>
      <div className="flex items-center justify-center">
        <h2 className={title()}>{MAIN_APP_NAME}</h2>
      </div>
      <div
        className={
          isMobile
            ? "flex flex-col items-center justify-center gap-4 py-8 md:py-10"
            : "flex flex-row items-center justify-center gap-4 py-8 md:py-10"
        }
      >
        <Card isFooterBlurred className="border-none" radius="lg">
          <Image
            alt="Logo Login"
            className="object-cover"
            height={isMobile ? 200 : 350}
            src={LOGO_LOGIN}
            width={isMobile ? 200 : 350}
          />
          <CardFooter className="justify-between before:bg-white/10 border-white/20 border-1 overflow-hidden py-1 absolute before:rounded-xl rounded-large bottom-1 w-[calc(100%_-_8px)] shadow-small ml-1 z-10">
            <Button
              className="text-tiny text-white bg-black/20"
              color="default"
              radius="lg"
              size="sm"
              variant="flat"
              onPress={() => router.push("/login")}
            >
              Login Here
            </Button>
          </CardFooter>
        </Card>

        <Card isFooterBlurred className="border-none" radius="lg">
          <Image
            alt="Logo Register"
            className="object-cover"
            height={isMobile ? 200 : 350}
            src={LOGO_REGISTER}
            width={isMobile ? 200 : 350}
          />
          <CardFooter className="justify-between before:bg-white/10 border-white/20 border-1 overflow-hidden py-1 absolute before:rounded-xl rounded-large bottom-1 w-[calc(100%_-_8px)] shadow-small ml-1 z-10">
            <Button
              className="text-tiny text-white bg-black/20"
              color="default"
              radius="lg"
              size="sm"
              variant="flat"
              onPress={() => router.push("/register")}
            >
              Register Now
            </Button>
          </CardFooter>
        </Card>
      </div>
    </>
  );
};

export default LandingPage;
