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

const LoginUser = () => {
  const formikRef = useRef();
  const { appLogin } = useCustomAuth();
  const history = useHistory();

  useEffect(() => {
    // getAllCategories();
    // getAllBrands();
  }, []);

  const authenticate = (values) => {
    console.log(values);

    appLogin(values.name, values.password);

    // history.push("/home");
  };

  return (
    <Formik
      innerRef={formikRef}
      initialValues={{
        name: "",
        password: "",
      }}
      validate={() => {}}
      onSubmit={(values, { setSubmitting }) => {
        setTimeout(() => {
          // alert(JSON.stringify(values, null, 2));
          console.log("final output ::: ", values);
          authenticate(values);
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
                  Sign In
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

                <Button
                  mt={4}
                  colorScheme="teal"
                  isLoading={formikProps.isSubmitting}
                  type="submit"
                >
                  Submit
                </Button>
              </Stack>
            </Flex>
          </Form>
        );
      }}
    </Formik>
  );
};

export default LoginUser;
