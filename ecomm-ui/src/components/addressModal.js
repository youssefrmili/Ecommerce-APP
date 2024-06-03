import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  background,
  color,
  useToast,
} from "@chakra-ui/react";
import AddressService from "../api/addressService";

const AddressModal = ({ isOpen, onClose, onSubmit }) => {
  const toast = useToast();
  const handleSubmit = (event) => {
    event.preventDefault();
    // Extract form data and pass it to onSubmit
    const formData = new FormData(event.currentTarget);
    const addressData = {
      name: formData.get("name"),
      streetAddress: formData.get("street"),
      city: formData.get("city"),
      state: formData.get("stateProvince"),
      postalCode: formData.get("zipPostalCode"),
      country: formData.get("country"),
      defaultAddress: formData.get("defaultAddress"),
    };
    addAddress(addressData);
    onClose();
  };

  const addAddress = (address) => {
    const response = AddressService.createAddress(address);

    response
      .then((res) => {
        console.log(res.data);

        if (res.status === 204 || res.status === 201 || res.status === 202) {
          toast({
            title: "Address created Successfully",
            description: "Address created for the cart",
            status: "success",
            duration: 3000,
            isClosable: true,
          });
        }
      })
      .catch((error) => {
        toast({
          title: "Failed to add address",
          description: error.message,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        console.log(error);
      });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Add New Address</ModalHeader>
        <ModalCloseButton />
        <form onSubmit={handleSubmit}>
          <ModalBody>
            <FormControl isRequired>
              <FormLabel>Name</FormLabel>
              <Input name="name" placeholder="Home, Office, etc." />
            </FormControl>
            <FormControl mt={4} isRequired>
              <FormLabel>Street</FormLabel>
              <Input name="street" placeholder="1234 Main St" />
            </FormControl>
            <FormControl mt={4} isRequired>
              <FormLabel>City</FormLabel>
              <Input name="city" />
            </FormControl>
            <FormControl mt={4} isRequired>
              <FormLabel>State / Province</FormLabel>
              <Input name="stateProvince" />
            </FormControl>
            <FormControl mt={4} isRequired>
              <FormLabel>ZIP / Postal Code</FormLabel>
              <Input name="zipPostalCode" />
            </FormControl>
            <FormControl mt={4} isRequired>
              <FormLabel>Country</FormLabel>
              <Select name="country" placeholder="Select country">
                <option value="CA">Canada</option>
                <option value="US">US</option>
              </Select>
            </FormControl>
            <FormControl mt={4} isRequired>
              <FormLabel>Default</FormLabel>
              <Select name="defaultAddress" placeholder="Select Type">
                <option value={true}>True</option>
                <option value={false}>False</option>
              </Select>
            </FormControl>
          </ModalBody>
          <ModalFooter backgroundColor={"gray"}>
            <Button colorScheme="blue" mr={3} type="submit">
              Save
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};

export default AddressModal;
