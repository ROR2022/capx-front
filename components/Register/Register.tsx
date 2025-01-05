"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useLocalStorage } from "usehooks-ts";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/button";
import { Card, CardBody, Image } from "@nextui-org/react";
import { Link } from "@nextui-org/react";
import { FaRegTrashAlt } from "react-icons/fa";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import { CircularProgress } from "@nextui-org/progress";
import { useDispatch } from "react-redux";
import { useMediaQuery } from "usehooks-ts";

import Cookies from "js-cookie";
import { registerUser } from "@/api/apiUser";
import {
  COOKIE_KEY,
  LOCALSTORAGE_KEY,
  ROLE_DEFAULT,
  USER_STATUS_DEFAULT,
} from "@/dataEnv/dataEnv";
import { DataUser, initialState, setUser } from "@/redux/userSlice";
import { title } from "@/components/primitives";

const initFormValues = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
  role: ROLE_DEFAULT,
};

const validationSchema = Yup.object({
  name: Yup.string()
    .required("Required")
    .min(4, "Name is too short - should be 3 chars minimum.")
    .max(50, "Name is too long - should be 50 chars maximum."),
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
  confirmPassword: Yup.string().oneOf(
    [Yup.ref("password")],
    "Passwords must match"
  ),
});

const Register = () => {
  const isMobile = useMediaQuery("(max-width: 640px)");
  const router = useRouter();
  const dispatch = useDispatch();
  //const user: DataUser = useSelector((state: RootState) => state.user);
  const [imageUser, setImageUser] = useState<File | null>(null);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [selectedLanguage, setSelectedLanguage] = React.useState<string>("en");
  const [storedDataUser, setStoredDataUser] = useLocalStorage<DataUser>(
    LOCALSTORAGE_KEY,
    initialState,
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);

  useEffect(() => {
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
      handleRegisterUser(values);
    },
  });
  const { values, handleChange, handleBlur, handleSubmit, errors, touched } =
    formik;
  const handleChangeImageUser = (e: any) => {
    //eslint-disable-next-line
    //console.log("e.target.files[0]", e.target.files[0]);
    setImageUser(e.target.files[0]);
  };
  const handleClearImageUser = () => {
    setImageUser(null);
  };
  const handleRegisterUser = async (values: any) => {
    try {
      let formData = null;

      setLoading(true);

      if (imageUser) {
        formData = new FormData();
        formData.append("file", imageUser);
        formData.append("status", USER_STATUS_DEFAULT);
        formData.append("roles[]", ROLE_DEFAULT);
        for (let key in values) {
          formData.append(key, values[key]);
        }
      } else {
        values = { ...values, roles: [ROLE_DEFAULT] };
        formData = values;
      }
      const resRegisterUser = await registerUser(formData);

      setLoading(false);
      //eslint-disable-next-line
      console.log("resRegisterUser: ", resRegisterUser);
      const { data, error } = resRegisterUser;

      if (data && !error) {
        //eslint-disable-next-line
        //console.log("User registered successfully: ", data);

        Cookies.set(COOKIE_KEY, data.access_token);
        dispatch(setUser(data));
        setStoredDataUser(data);
        router.push("/");
      } else {
        //eslint-disable-next-line
        console.error("Error registering user: ", data);
      }
    } catch (error) {
      //eslint-disable-next-line
      console.error("Error registering user: ", error);

      setLoading(false);
    }
  };

  const handleSelect = (e: any) => {
    //const { name, value } = e.target;
    //eslint-disable-next-line
    //console.log("Select:", e);
    const { currentKey } = e;

    console.log("currentKey:", currentKey);
  };

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className={title()}>
        {selectedLanguage === "en" ? "Register" : "Registro"}
      </h1>
      <div className="my-3">
        <Link className="text-sm" color="secondary" href="/login">
          {selectedLanguage === "en"
            ? "Already registered? LOGIN NOW"
            : "¿Ya registrado? INICIA SESIÓN AHORA"}
        </Link>
      </div>
      <Card className="mt-3" style={{ width: isMobile ? "100%" : "500px" }}>
        {/* <h2 className="text-3xl font-bold mb-4 text-center">Login</h2> */}
        <CardBody>
          <form className="flex flex-col gap-2" onSubmit={handleSubmit}>
            <Input
              name="name"
              placeholder={selectedLanguage === "en" ? "Name" : "Nombre"}
              value={values.name}
              onBlur={handleBlur}
              onChange={handleChange}
            />
            {errors.name && touched.name && (
              <div className="text-purple-600 text-sm opacity">
                {errors.name}
              </div>
            )}
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

            <div className="flex gap-2 items-center">
              <Input
                name="password"
                placeholder={
                  selectedLanguage === "en" ? "Password" : "Contraseña"
                }
                type={showPassword ? "text" : "password"}
                value={values.password}
                onBlur={handleBlur}
                onChange={handleChange}
              />

              {showPassword ? (
                <FaEyeSlash
                  className="cursor-pointer"
                  onClick={() => setShowPassword((prev) => !prev)}
                />
              ) : (
                <FaEye
                  className="cursor-pointer"
                  onClick={() => setShowPassword((prev) => !prev)}
                />
              )}
            </div>
            {!touched.password && (
              <p className="text-xs text-slate-700 px-3">
                {selectedLanguage === "en"
                  ? "Must contain at least 8 characters, one uppercase, one lowercase, one number and one special character"
                  : "Debe contener al menos 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial"}
              </p>
            )}
            {errors.password && touched.password && (
              <div className="text-purple-600 text-sm opacity">
                {errors.password}
              </div>
            )}
            <div className="flex gap-2 items-center">
              <Input
                name="confirmPassword"
                placeholder={
                  selectedLanguage === "en"
                    ? "Confirm Password"
                    : "Confirmar Contraseña"
                }
                type={showConfirmPassword ? "text" : "password"}
                value={values.confirmPassword}
                onBlur={handleBlur}
                onChange={handleChange}
              />
              {showConfirmPassword ? (
                <FaEyeSlash
                  className="cursor-pointer"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                />
              ) : (
                <FaEye
                  className="cursor-pointer"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                />
              )}
            </div>
            {errors.confirmPassword && touched.confirmPassword && (
              <div className="text-purple-600 text-sm opacity">
                {errors.confirmPassword}
              </div>
            )}
            <label
              className="py-2 relative cursor-pointer rounded-md bg-slate-300 font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-white hover:bg-slate-400"
              htmlFor="file-upload"
            >
              <div className="ps-3">
                {selectedLanguage === "en"
                  ? "Select Profile Image"
                  : "Seleccionar imagen de perfil"}
              </div>
              <input
                className="sr-only"
                id="file-upload"
                name="file-upload"
                type="file"
                value={""}
                onChange={handleChangeImageUser}
              />
            </label>
            <div className="text-sm text-gray-500">
              {imageUser ? (
                <div className="flex items-center justify-center my-2 gap-2">
                  <Image
                    alt="user image"
                    className="rounded-full"
                    height={100}
                    src={URL.createObjectURL(imageUser)}
                    width={100}
                  />
                  <FaRegTrashAlt
                    className="text-danger cursor-pointer"
                    onClick={handleClearImageUser}
                  />
                </div>
              ) : (
                <span className="text-xs ps-2">
                  {selectedLanguage === "en"
                    ? "No image selected"
                    : "Sin imagen seleccionada"}
                </span>
              )}
            </div>
            <Button color="primary" type="submit">
              {loading ? (
                <div className="text-white">
                  <CircularProgress aria-label="Loading..." />
                </div>
              ) : selectedLanguage === "es" ? (
                "Registrarse"
              ) : (
                "Register"
              )}
            </Button>
          </form>
        </CardBody>
      </Card>
    </div>
  );
};

export default Register;
