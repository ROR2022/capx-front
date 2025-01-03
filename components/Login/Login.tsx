"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLocalStorage, useMediaQuery } from "usehooks-ts";
import { useDispatch, useSelector } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/button";
import { Card, CardBody } from "@nextui-org/react";
import { Link } from "@nextui-org/react";
import Cookies from "js-cookie";
import { FaEyeSlash } from "react-icons/fa";
import { FaEye } from "react-icons/fa";
import { CircularProgress } from "@nextui-org/progress";

import { loginUser } from "@/api/apiUser";
import { RootState } from "@/redux/store";
import { DataUser, setUser } from "@/redux/userSlice";
import {
  LOCALSTORAGE_KEY,
  COOKIE_KEY,
  COOKIE_ADMIN,
  ROLE_ADMIN,
} from "@/dataEnv/dataEnv";
import { title } from "@/components/primitives";

type LoginValues = {
  email: string;
  password: string;
};

const initFormValues = {
  email: "",
  password: "",
};

const validationSchema = Yup.object({
  email: Yup.string()
    .email("Invalid email address")
    .required("Required")
    .matches(
      /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/,
      "Invalid email address"
    ),
  password: Yup.string()
    .required("Required")
    .min(8, "Password is too short - should be 8 chars minimum.")
    .max(20, "Password is too long - should be 20 chars maximum.")
    .matches(/(?=.*[0-9])/, "Password must contain a number.")
    .matches(/(?=.*[A-Z])/, "Password must contain an uppercase letter.")
    .matches(/(?=.*[a-z])/, "Password must contain a lowercase letter.")
    .matches(/(?=.*[!@#$%^&*])/, "Password must contain a special character."),
});

const Login = () => {
  const isMobile = useMediaQuery("(max-width: 640px)");
  const user: DataUser = useSelector((state: RootState) => state.user);
  const [showPassword, setShowPassword] = React.useState<boolean>(false);
  const [selectedLanguage, setSelectedLanguage] = React.useState<string>("en");
  const [errorLogin, setErrorLogin] = React.useState<string>("");
  const [loading, setLoading] = React.useState<boolean>(false);

  const [storedDataUser, setStoredDataUser] = useLocalStorage<DataUser>(
    LOCALSTORAGE_KEY,
    user
  );
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    if (storedDataUser && storedDataUser.access_token) {
      //dispatch(setUser(storedDataUser.dataUser));
      router.push("/");
    }
    if (storedDataUser && storedDataUser.language) {
      setSelectedLanguage(storedDataUser.language);
    }
  }, [storedDataUser]);

  const formik = useFormik({
    initialValues: initFormValues,
    validationSchema: validationSchema,
    onSubmit: (values) => {
      //eslint-disable-next-line
      //console.log("Form values:..", values);
      handleLoginUser(values);
    },
  });
  const { values, handleChange, handleBlur, handleSubmit, errors, touched } =
    formik;

  const handleLoginUser = async (values: LoginValues) => {
    setLoading(true);
    try {
      const response = await loginUser(values);

      setLoading(false);
      //eslint-disable-next-line
      //console.log("login response:..", response);
      const { data } = response;

      if (data && data.dataUser && data.dataUser.access_token) {
        //console.log("login data.dataUser", data.dataUser);
        const { roles } = data.dataUser;

        if (roles.includes(ROLE_ADMIN)) {
          Cookies.set(COOKIE_ADMIN, data.dataUser.access_token);
        }
        //console.log("set COOKIE_KEY", COOKIE_KEY);
        Cookies.set(COOKIE_KEY, data.dataUser.access_token);
        dispatch(setUser(data.dataUser));
        setStoredDataUser(data.dataUser);
      } else {
        //eslint-disable-next-line
        console.log("Error in loginUser", response);
        const { message } = response.data;

        if (message) {
          setErrorLogin(message);
          setTimeout(() => {
            setErrorLogin("");
          }, 3000);
        }
      }
    } catch (error) {
      //eslint-disable-next-line
      console.log("error:..", error);
      setLoading(false);
      setErrorLogin("Invalid Login - Please try again");
      setTimeout(() => {
        setErrorLogin("");
      }, 3000);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className={title()}>
        {selectedLanguage === "en" ? "Login" : "Iniciar"}
      </h1>
      <div className="my-3">
        <Link className="text-sm" color="secondary" href="/register">
          {selectedLanguage === "es"
            ? "No registrado? REGISTRATE AHORA"
            : "Not registered? REGISTER NOW"}
        </Link>
      </div>
      <Card className="mt-3" style={{ width: isMobile ? "100%" : "500px" }}>
        {/* <h2 className="text-3xl font-bold mb-4 text-center">Login</h2> */}
        <CardBody>
          <form className="flex flex-col gap-2" onSubmit={handleSubmit}>
            <Input
              name="email"
              placeholder="Email"
              type="email"
              value={values.email}
              onBlur={handleBlur}
              onChange={handleChange}
            />
            {errors.email && touched.email && (
              <div className="text-purple-600 text-sm opacity">
                {errors.email}
              </div>
            )}
            <div className="flex items-center gap-1">
              <Input
                name="password"
                placeholder="Password"
                type={showPassword ? "text" : "password"}
                value={values.password}
                onBlur={handleBlur}
                onChange={handleChange}
              />
              {showPassword ? (
                <FaEyeSlash
                  className="cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                />
              ) : (
                <FaEye
                  className="cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                />
              )}
            </div>
            {errors.password && touched.password && (
              <div className="text-purple-600 text-sm opacity">
                {errors.password}
              </div>
            )}
            <Button color="primary" type="submit">
              {loading ? (
                <CircularProgress aria-label="Loading..." />
              ) : selectedLanguage === "es" ? (
                "Iniciar sesión"
              ) : (
                "Login"
              )}
            </Button>
            {errorLogin && (
              <div className="text-rose-700 text-sm opacity">{errorLogin}</div>
            )}
          </form>
        </CardBody>
      </Card>
      <div className="my-3 hidden">
        <Link className="text-sm" color="warning" href="/forgot">
          {selectedLanguage === "es"
            ? "¿Olvidaste tu contraseña? Click aquí"
            : "Forgot Password? Click here"}
        </Link>
      </div>
    </div>
  );
};

export default Login;
