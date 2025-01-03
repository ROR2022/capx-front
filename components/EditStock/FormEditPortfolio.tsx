"use client";
import React, { useEffect, FC } from "react";
import { useMediaQuery } from "usehooks-ts";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Button, Card, CardBody, Input } from "@nextui-org/react";

const initFormValues = {
  name: "",
  ticker: "",
  symbol: "",
  quantity: 1,
  buyPrice: 0,
  currency: "",
};

const validationSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  ticker: Yup.string().required("Ticker is required"),
  symbol: Yup.string().required("Symbol is required"),
  quantity: Yup.number().required("Quantity is required"),
  buyPrice: Yup.number().required("Buy price is required"),
  currency: Yup.string().required("Currency is required"),
});

interface FormEditPortfolioProps {
  dataStock: any;
  handleEditPortfolio: (values: any) => void;
}

const FormEditPortfolio: FC<FormEditPortfolioProps> = ({
  dataStock,
  handleEditPortfolio,
}) => {
  const isMobile = useMediaQuery("(max-width: 640px)");
  const formik = useFormik({
    initialValues: initFormValues,
    enableReinitialize: true,
    validationSchema: validationSchema,
    onSubmit: (values) => {
      //console.log("values: ", values);
      handleEditStock({ ...values, id: dataStock.id });
    },
  });
  const { values, handleChange, handleBlur, handleSubmit, errors, touched } =
    formik;

  useEffect(() => {
    if (dataStock) {
      formik.setValues(dataStock);
    }
  }, []);

  const handleEditStock = (values: any) => {
    //console.log("handleEditStock values: ", values);
    handleEditPortfolio(values);
  };

  return (
    <div
      className={
        isMobile
          ? "flex flex-col justify-center items-center p-2"
          : "flex flex-col justify-center items-center p-4"
      }
    >
      <h2 className="text-center text-4xl my-4">Edit Stock</h2>
      <Card style={{ width: isMobile ? "100%" : "500px" }}>
        <CardBody>
          <form className="flex flex-col gap-2" onSubmit={handleSubmit}>
            <Input
              label="Name"
              name="name"
              placeholder="Name"
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
              label="Ticker"
              name="ticker"
              placeholder="Ticker"
              value={values.ticker}
              onBlur={handleBlur}
              onChange={handleChange}
            />
            {errors.ticker && touched.ticker && (
              <div className="text-purple-600 text-sm opacity">
                {errors.ticker}
              </div>
            )}
            <Input
              label="Symbol"
              name="symbol"
              placeholder="Symbol"
              value={values.symbol}
              onBlur={handleBlur}
              onChange={handleChange}
            />
            {errors.symbol && touched.symbol && (
              <div className="text-purple-600 text-sm opacity">
                {errors.symbol}
              </div>
            )}
            <Input
              label="Quantity"
              name="quantity"
              placeholder="Quantity"
              value={String(values.quantity)}
              onBlur={handleBlur}
              onChange={handleChange}
            />
            {errors.quantity && touched.quantity && (
              <div className="text-purple-600 text-sm opacity">
                {errors.quantity}
              </div>
            )}
            <Input
              label="Buy Price"
              name="buyPrice"
              placeholder="Buy Price"
              value={String(values.buyPrice)}
              onBlur={handleBlur}
              onChange={handleChange}
            />
            {errors.buyPrice && touched.buyPrice && (
              <div className="text-purple-600 text-sm opacity">
                {errors.buyPrice}
              </div>
            )}
            <Input
              label="Currency"
              name="currency"
              placeholder="Currency"
              value={values.currency}
              onBlur={handleBlur}
              onChange={handleChange}
            />
            {errors.currency && touched.currency && (
              <div className="text-purple-600 text-sm opacity">
                {errors.currency}
              </div>
            )}

            <Button className="w-full" color="success" type="submit">
              Edit Stock
            </Button>
          </form>
        </CardBody>
      </Card>
    </div>
  );
};

export default FormEditPortfolio;
