import React, { useState, useEffect } from "react";
import {
  Box,
  Text,
  Heading,
  Stack,
  Radio,
  RadioGroup,
  HStack,
  Button,
  useDisclosure,
} from "@chakra-ui/react";
import AddressModal from "./addressModal";
import AddressService from "../api/addressService";
import { Form, Formik } from "formik";
import { useHistory } from "react-router-dom";

const Address = () => {
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState();
  const [loading, setLoading] = useState(true);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const history = useHistory();

  useEffect(() => {
    // Simulate fetching data

    // Replace this with your actual data fetching logic
    const getAddress = async () => {
      console.log("[Fetching cart items]");
      const response = AddressService.getAllAdresses();

      response
        .then((res) => {
          console.log(res.data);

          if (res.status === 200) {
            setAddresses(res.data);

            const da = res.data.find((item) => item.defaultAddress === true);
            setSelectedAddress(da.id);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    };

    getAddress();
    setLoading(false);
  }, []);

  const handleAddressChange = (newAddressId) => {
    setSelectedAddress(newAddressId);
    updateDefaultAddress(newAddressId);
  };

  const updateDefaultAddress = (addressId) => {
    // API call to update the default address
    console.log(`Updating default address to ${addressId}`);
    // Replace this with your actual API call
    // Example: axios.post('/api/update-default-address', { addressId });
  };

  // Add a function for handling the submission of a new address
  const handleAddAddress = (event) => {
    event.preventDefault();
    // Logic to add the new address
    console.log("New address added");
    onClose(); // Close the modal after adding the address
  };

  if (loading) {
    return <Text>Loading addresses...</Text>;
  }

  return (
    <Box p={4} border="1px" borderColor="gray.500" borderRadius="md">
      <Formik
        initialValues={{}}
        onSubmit={(values, { setSubmitting }) => {
          setTimeout(() => {
            // alert(JSON.stringify(values, null, 2));
            //   console.log("final output ::: ", values);
            // addProductToCart();
            setSubmitting(false);
          }, 400);
        }}
      >
        {(formikProps) => {
          const { values, setFieldValue } = formikProps;
          return (
            <Form>
              <Heading size="md">Your Addresses</Heading>
              {addresses.length > 0 && selectedAddress && (
                <RadioGroup
                  onChange={handleAddressChange}
                  value={selectedAddress.toString()}
                  mt={2}
                  key={selectedAddress.id}
                >
                  <Stack direction="column">
                    {addresses.map((address) => (
                      <Box key={address.id} p={3}>
                        <Radio value={String(address.id)}>
                          <HStack spacing={2}>
                            <Text fontWeight="bold">{address.name}:</Text>
                            <Text>{`${address.streetAddress},  ${address.city}, ${address.state}, ${address.postalCode}`}</Text>
                          </HStack>
                        </Radio>
                      </Box>
                    ))}
                  </Stack>
                </RadioGroup>
              )}

              <Button mt={4} onClick={onOpen}>
                Add Address
              </Button>
              {/* Modal for Adding New Address */}
              <AddressModal
                isOpen={isOpen}
                onClose={onClose}
                onSubmit={handleAddAddress}
              />
            </Form>
          );
        }}
      </Formik>
    </Box>
  );
};

export default Address;
