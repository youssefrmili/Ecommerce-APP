import React, { useEffect, useState } from "react";
import { Box, VStack, Text, Divider, Heading } from "@chakra-ui/react";
import OrderService from "../../api/orderService";

const OrderTotal = () => {
  const calculateTotal = () => {
    return order.itemsSubTotal + order.shipping + order.tax;
  };

  const [order, setOrder] = useState({
    items: 1,
    itemsSubTotal: 799.99,
    shipping: 0.0,
    tax: 79.999,
  });

  useEffect(() => {
    getOrderSummary();
  }, []);

  const getOrderSummary = async () => {
    console.log("[Getting order detail]");
    const response = OrderService.getOrderSummaryForActiveCart();

    response
      .then((res) => {
        console.log(res.data);

        if (res.status === 200) {
          setOrder(res.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <Box
      p={4}
      border="1px"
      borderColor="gray.100"
      borderRadius="md"
      w="300px"
      height={"fit-content"}
    >
      {order && (
        <VStack spacing={2} align="stretch">
          <Heading size="lg">Order Summary</Heading>
          <Divider />

          <Text fontSize="md">
            Subtotal: <strong>${order.itemsSubTotal.toFixed(2)}</strong>
          </Text>
          <Text fontSize="md">
            Shipping: <strong>${order.shipping.toFixed(2)}</strong>
          </Text>
          <Text fontSize="md">
            GST: <strong>${order.tax}</strong>
          </Text>
          {/* <Text fontSize="md">
            HST: <strong>${hst.toFixed(2)}</strong>
          </Text> */}
          <Divider />

          <Text fontWeight="bold" fontSize="lg" color="green.500">
            Total: ${calculateTotal().toFixed(2)}
          </Text>
        </VStack>
      )}
    </Box>
  );
};

export default OrderTotal;
