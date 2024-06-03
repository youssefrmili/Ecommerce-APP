import {
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  Stack,
  useColorModeValue,
} from "@chakra-ui/react";
import { Form, Formik, Field } from "formik";
import { useEffect, useRef, useState } from "react";
// import CategoryService from "@/api/categoryService";
import { useToast } from "@chakra-ui/react";
import { useCustomAuth } from "./authContext";
import { useHistory } from "react-router-dom";

const Register = () => {
  const formikRef = useRef();
  const { appLogin, appRegister } = useCustomAuth();
  const history = useHistory();

  useEffect(() => {}, []);

  const register = (values) => {
    console.log(values);

    appRegister(
      values.name,
      values.password,
      values.firstName,
      values.lastName
    );
  };

  return (
    <Formik
      innerRef={formikRef}
      initialValues={{
        name: "",
        password: "",
        firstName: "",
        lastName: "",
      }}
      validate={() => {}}
      onSubmit={(values, { setSubmitting }) => {
        setTimeout(() => {
          // alert(JSON.stringify(values, null, 2));
          console.log("final output ::: ", values);
          register(values);
          setSubmitting(false);
        }, 400);
      }}
    >
      {(formikProps) => {
        const { values, setFieldValue } = formikProps;

        return (
          <Form>
            <Flex
              key={1}
              direction={{ base: "column", md: "row" }}
              gap="20px"
              minH={"60vh"}
              align={"center"}
              justify={"center"}
              // bg={useColorModeValue("gray.400", "gray.200")}
            >
              <Stack
                flex={1}
                spacing={4}
                w={"full"}
                maxW={"md"}
                // bg={useColorModeValue("gray.40", "gray.700")}
                rounded={"xl"}
                boxShadow={"lg"}
                p={6}
                my={12}
              >
                <Heading lineHeight={1.1} fontSize={{ base: "2xl", md: "3xl" }}>
                  Register
                </Heading>
                <Field name="name" validate={() => {}}>
                  {({ field, form }) => (
                    <FormControl
                      isRequired
                      isInvalid={form.errors.name && form.touched.name}
                    >
                      <FormLabel>Email</FormLabel>
                      <Input {...field} placeholder="name" />
                      <FormErrorMessage>{form.errors.name}</FormErrorMessage>
                    </FormControl>
                  )}
                </Field>

                <Field name="password" validate={() => {}}>
                  {({ field, form }) => (
                    <FormControl
                      isRequired
                      isInvalid={form.errors.password && form.touched.password}
                    >
                      <FormLabel>Password</FormLabel>
                      <Input
                        {...field}
                        placeholder="password"
                        type="password"
                      />
                      <FormErrorMessage>
                        {form.errors.password}
                      </FormErrorMessage>
                    </FormControl>
                  )}
                </Field>

                <Field name="firstName" validate={() => {}}>
                  {({ field, form }) => (
                    <FormControl
                      isRequired
                      isInvalid={
                        form.errors.firstName && form.touched.firstName
                      }
                    >
                      <FormLabel>First Name</FormLabel>
                      <Input {...field} placeholder="firstName" />
                      <FormErrorMessage>
                        {form.errors.firstName}
                      </FormErrorMessage>
                    </FormControl>
                  )}
                </Field>

                <Field name="lastName" validate={() => {}}>
                  {({ field, form }) => (
                    <FormControl
                      isRequired
                      isInvalid={form.errors.lastName && form.touched.lastName}
                    >
                      <FormLabel>Last Name</FormLabel>
                      <Input {...field} placeholder="lastName" />
                      <FormErrorMessage>
                        {form.errors.lastName}
                      </FormErrorMessage>
                    </FormControl>
                  )}
                </Field>

                <Button
                  mt={4}
                  colorScheme="teal"
                  isLoading={formikProps.isSubmitting}
                  type="submit"
                >
                  Register
                </Button>
              </Stack>
            </Flex>
          </Form>
        );
      }}
    </Formik>
  );
};

export default Register;
