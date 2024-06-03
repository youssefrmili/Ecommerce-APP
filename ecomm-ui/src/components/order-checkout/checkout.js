import React from "react";
import {
  Box,
  Button,
  Stack,
  Text,
  Heading,
  Flex,
  useToast,
} from "@chakra-ui/react";
import OrderTotal from "./orderTotal"; // Import the OrderTotal component
import Address from "../address";
import Cart from "./cart";
import { Form, Formik } from "formik";
import OrderService from "../../api/orderService";
import { useHistory } from "react-router-dom";

const Checkout = () => {
  const paymentMethod = "Stripe";

  const toast = useToast();
  const history = useHistory();

  const placeOrder = async () => {
    console.log("[Creating order]");
    const response = OrderService.placeOrder();

    response
      .then((res) => {
        console.log(res.data);

        if (res.status === 204 || res.status === 200 || res.status === 201) {
          window.open(res.data.link);
        }
      })
      .catch((error) => {
        toast({
          title: "Failed to remove item",
          description: error.message,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        console.log(error);
      });
  };

  return (
    <Flex direction={{ base: "column", md: "row" }} p={4} gap={6}>
      <Formik
        initialValues={{}}
        onSubmit={(values, { setSubmitting }) => {
          setTimeout(() => {
            // alert(JSON.stringify(values, null, 2));
            //   console.log("final output ::: ", values);
            placeOrder();
            setSubmitting(false);
          }, 400);
        }}
      >
        {(formikProps) => {
          const { values, setFieldValue } = formikProps;
          return (
            <Form>
              <Stack spacing={6} flex="1">
                {/* Address Section */}
                <Address />

                {/* Payment Method Section */}
                <Box
                  p={4}
                  border="1px"
                  borderColor="gray.500"
                  borderRadius="md"
                >
                  <Heading size="md">Payment Method</Heading>
                  <Text mt={2}>{paymentMethod}</Text>
                </Box>

                {/* Cart Items Section */}
                <Box
                  p={4}
                  border="1px"
                  borderColor="gray.500"
                  borderRadius="md"
                  height={"fit-content"}
                >
                  <Heading size="md">Cart Items</Heading>
                  <Cart />
                </Box>

                {/* Place Order Button */}
                <Button
                  colorScheme="blue"
                  size="lg"
                  isLoading={formikProps.isSubmitting}
                  type="submit"
                >
                  Place Order
                </Button>
              </Stack>
            </Form>
          );
        }}
      </Formik>
      <OrderTotal />
    </Flex>
  );
};

export default Checkout;
