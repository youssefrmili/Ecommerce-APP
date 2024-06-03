import {
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  Select,
  Stack,
  Textarea,
  useColorModeValue,
} from "@chakra-ui/react";
import { Form, Formik, Field, FieldArray } from "formik";
import { useEffect, useRef, useState } from "react";
// import CategoryService from "@/api/categoryService";
import Utils from "../../utils/jsutils";
import BrandService from "../../api/brandService";
import ProductService from "../../api/productService";
import CategoryService from "../../api/categoryService";
import { useToast } from "@chakra-ui/react";

const AddProduct = () => {
  const toast = useToast();
  const color = useColorModeValue("gray.60", "gray.700");
  const formikRef = useRef();
  const [selectCategories, setSelectCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [brands, setBrands] = useState([
    {
      id: 1,
      name: "google",
      categories: ["pixel"],
    },
  ]);
  const [categorySpecificFields, setCategorySpecificFields] = useState([]);
  const [categoryBaseFields, setCategoryBaseFields] = useState([]);
  const [noOfVariants, setNoOfVariants] = useState(0);
  const [categoryIntialFeatures, setCategoryIntialFeatures] = useState([]);

  useEffect(() => {
    getAllCategories();
    getAllBrands();
  }, []);

  useEffect(() => {
    if (selectedBrand) {
      getCategoryBasicFeatures(selectedBrand);
    }
  }, [selectedBrand]);

  useEffect(() => {
    if (selectedCategory) {
      // If fields are static
      getCategoryBasicFeatures(selectedCategory);
    }
  }, [selectedCategory]);

  const getBrandCategories = (brand) => {
    // console.log(
    //   "Brand categories::: ",
    //   brands.find((b) => b.name === brand).categories
    // );
    return brands.find((b) => b.name === brand).categories;
  };

  const getAllCategories = () => {
    const response = CategoryService.getAllCategories();

    // let categories = [];
    response
      .then((res) => {
        console.log(res.data);

        if (res.status === 200) {
          const flattenedOptions = flattenCategories(res.data);
          setSelectCategories(flattenedOptions);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getAllBrands = () => {
    const response = BrandService.getAllBrands();

    // let categories = [];
    response
      .then((res) => {
        console.log(res.data);

        if (res.status === 200) {
          setBrands(res.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const flattenCategories = (categories, prefix = "") => {
    let result = [];
    categories.forEach((category) => {
      const name = prefix ? `${prefix} > ${category.name}` : category.name;
      result.push({ value: category.id, label: name });
      if (category.categories) {
        result = result.concat(flattenCategories(category.categories, name));
      }
    });
    return result;
  };

  const getVariantFeatures = () => {
    console.log("Category ID => ", selectedCategory);
    const response = CategoryService.getVariantFeatures(selectedCategory);

    response
      .then((res) => {
        console.log(res.data);

        if (res.status === 200) {
          setCategorySpecificFields(res.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });

    // { Ram: 8, Storage: 256 }
  };

  const getCategoryBasicFeatures = (category) => {
    console.log("Category ID => ", category);
    const response = CategoryService.getFeatureNames(category);

    response
      .then((res) => {
        console.log(res.data);

        if (res.status === 200) {
          setCategoryBaseFields(res.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });

    // return [{ Ram: 8, Storage: 256 }]
  };

  const addProduct = (product) => {
    const response = ProductService.addProduct(product);

    response
      .then((res) => {
        console.log(res.data);

        if (res.status === 200 || res.status === 201) {
          toast({
            title: "Product created.",
            description: "We've created your product for you.",
            status: "success",
            duration: 3000,
            isClosable: true,
          });
        }
      })
      .catch((error) => {
        toast({
          title: "Product creation failed.",
          description: error.message,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        console.log(error);
      });
  };

  useEffect(() => {
    if (categoryBaseFields.length > 0) {
      const initialfeatures = categoryBaseFields.reduce((acc, field) => {
        acc[field.name] = ""; // Set the initial value for each field
        return acc;
      }, {});

      // setCategoryIntialFeatures(initialfeatures);
      if (formikRef.current) {
        formikRef.current.setFieldValue("features", initialfeatures);
      }
      // formikProps.setFieldValue("features", initialfeatures);
    }
  }, [categoryBaseFields]);

  return (
    <Formik
      innerRef={formikRef}
      initialValues={{
        name: "",
        desc: "",
        brand: {
          name: "",
          category: "",
        },
        category: 0,
        variants: [],
        features: categoryIntialFeatures,
      }}
      validate={(values) => {}}
      onSubmit={(values, { setSubmitting }) => {
        setTimeout(() => {
          // alert(JSON.stringify(values, null, 2));
          console.log("final output ::: ", values);
          addProduct(values);
          setSubmitting(false);
        }, 400);
      }}
    >
      {(formikProps) => {
        const { values, setFieldValue } = formikProps;

        // formikProps.setFieldValue("features", categoryIntialFeatures);

        // useEffect(() => {
        // if (categoryBaseFields.length > 0) {
        //   const initialfeatures = categoryBaseFields.reduce((acc, field) => {
        //     acc[field.name] = ""; // Set the initial value for each field
        //     return acc;
        //   }, {});
        //   formikProps.setFieldValue("features", initialfeatures);
        // }
        // }, [categoryBaseFields, formikProps.setFieldValue]);

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
                  Add a new Product
                </Heading>
                <Field name="name" validate={() => {}}>
                  {({ field, form }) => (
                    <FormControl
                      isRequired
                      isInvalid={form.errors.name && form.touched.name}
                    >
                      <FormLabel>Product Name</FormLabel>
                      <Input {...field} placeholder="name" />
                      <FormErrorMessage>{form.errors.name}</FormErrorMessage>
                    </FormControl>
                  )}
                </Field>
                <Field name="description" validate={() => {}}>
                  {({ field, form }) => (
                    <FormControl
                      isRequired
                      isInvalid={form.errors.name && form.touched.name}
                    >
                      <FormLabel>Description</FormLabel>
                      <Textarea
                        {...field}
                        placeholder="description of the product"
                      />
                      <FormErrorMessage>{form.errors.name}</FormErrorMessage>
                    </FormControl>
                  )}
                </Field>

                <Field name="category">
                  {({ field, form }) => (
                    <FormControl
                      isRequired
                      isInvalid={form.errors.category && form.touched.category}
                    >
                      <FormLabel>Category</FormLabel>
                      <Select
                        {...field}
                        placeholder="Select category"
                        onChange={(e) => {
                          form.setFieldValue(
                            "category",
                            parseInt(e.target.value)
                          ); // Update Formik state
                          setSelectedCategory(e.target.value);
                          console.log("category ::: ", e.target.value);
                        }}
                        typeof="number"
                      >
                        {selectCategories.length > 0 &&
                          selectCategories.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                      </Select>
                      <FormErrorMessage>
                        {form.errors.category}
                      </FormErrorMessage>
                    </FormControl>
                  )}
                </Field>

                <Field name="brand.name">
                  {({ field, form }) => (
                    <FormControl
                      isRequired
                      isInvalid={form.errors.brand && form.touched.brand}
                    >
                      <FormLabel>Brand Name</FormLabel>
                      <Select
                        {...field}
                        placeholder="Select Brand"
                        onChange={(e) => {
                          form.setFieldValue("brand.name", e.target.value); // Update Formik state
                          setSelectedBrand(e.target.value);
                          console.log("Selected Brand ::: ", e.target.value);
                        }}
                      >
                        {brands.length > 0 &&
                          brands
                            .map((b) => b.name)
                            .map((option) => (
                              <option key={option} value={option}>
                                {Utils.convertToTitleCase(option.toUpperCase())}
                              </option>
                            ))}
                      </Select>
                      <FormErrorMessage>
                        {form.errors.category}
                      </FormErrorMessage>
                    </FormControl>
                  )}
                </Field>

                {selectedBrand && (
                  <Field name="brand.category">
                    {({ field, form }) => (
                      <FormControl
                        isRequired
                        isInvalid={
                          form.errors.brandCategory &&
                          form.touched.brandCategory
                        }
                      >
                        <FormLabel>Brand Category</FormLabel>
                        <Select
                          {...field}
                          placeholder="Select Brand"
                          onChange={(e) => {
                            form.setFieldValue(
                              "brand.category",
                              e.target.value
                            ); // Update Formik state
                            // setSelectedCategory(e.target.value);
                            console.log(
                              "Selected Brand Category ::: ",
                              e.target.value
                            );
                          }}
                        >
                          {brands.length > 0 &&
                            getBrandCategories(selectedBrand).map((option) => (
                              <option key={option} value={option}>
                                {Utils.convertToTitleCase(option)}
                              </option>
                            ))}
                        </Select>
                        <FormErrorMessage>
                          {form.errors.category}
                        </FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>
                )}

                {selectedCategory && (
                  <FormControl>
                    <FormLabel>Number of Variants</FormLabel>
                    <Select
                      onChange={(e) => {
                        const numVariants = Number(e.target.value);
                        setNoOfVariants(numVariants);
                        getVariantFeatures();
                      }}
                      placeholder="Select number of variants"
                    >
                      {[1, 2, 3].map((num) => (
                        <option key={num} value={num}>
                          {num}
                        </option>
                      ))}
                    </Select>
                  </FormControl>
                )}

                <Button
                  mt={4}
                  colorScheme="teal"
                  isLoading={formikProps.isSubmitting}
                  type="submit"
                >
                  Submit
                </Button>
              </Stack>

              {selectedCategory && (
                <Stack
                  flex={1}
                  spacing={1}
                  w={"fit-content"}
                  maxW={"500px"}
                  // bg={useColorModeValue("gray.60", "gray.700")}
                  rounded={"xl"}
                  boxShadow={"lg"}
                  p={4}
                  my={2}
                  maxHeight="400px" // Set a maximum height
                  overflowY="auto" // Add vertical scrolling
                >
                  <Heading
                    lineHeight={1}
                    color={"ButtonFace"}
                    fontSize={{ base: "large", md: "2xl" }}
                  >
                    Base Features
                  </Heading>

                  <FieldArray name="features">
                    {({ push, remove, form }) => (
                      <div>
                        {categoryBaseFields.map((field, index) => (
                          <Field key={index} name={`features.${field.name}`}>
                            {({ field: formikField }) => (
                              <FormControl>
                                <FormLabel
                                  style={{
                                    fontWeight: "560",
                                    fontFamily: "Google Font Name, sans-serif",
                                    fontSize: 14,
                                  }}
                                >
                                  {Utils.snakeCaseToTitleCase(field.name)}
                                </FormLabel>
                                <Input
                                  {...formikField}
                                  placeholder={field.placeholder}
                                />
                              </FormControl>
                            )}
                          </Field>
                        ))}
                      </div>
                    )}
                  </FieldArray>
                </Stack>
              )}

              {Array.from({ length: noOfVariants }).map((_, variantIndex) => (
                <Stack
                  key={variantIndex}
                  flex={1}
                  spacing={1}
                  w={"fit-content"}
                  maxW={"fit-content"}
                  // bg={useColorModeValue("gray.60", "gray.700")}
                  rounded={"xl"}
                  boxShadow={"lg"}
                  p={4}
                  my={2}
                  maxHeight="400px" // Set a maximum height
                  overflowY="auto" // Add vertical scrolling
                >
                  <Heading
                    lineHeight={1.1}
                    fontSize={{ base: "1.4xl", md: "2xl" }}
                  >
                    Variant : {variantIndex + 1}
                  </Heading>

                  <FieldArray name={`variants[${variantIndex}]`}>
                    {(form) => (
                      <Stack>
                        {Object.keys(categorySpecificFields).map(
                          (key, fieldIndex) => (
                            <Field
                              name={`variants[${variantIndex}].features.${key}`}
                              key={fieldIndex}
                            >
                              {/* {`features[${index}].${field.name}`} */}
                              {({ field }) => (
                                <FormControl>
                                  <FormLabel
                                    style={{
                                      fontWeight: "560",
                                      fontFamily:
                                        "Google Font Name, sans-serif",
                                      fontSize: 14,
                                    }}
                                  >
                                    {Utils.snakeCaseToTitleCase(key)}
                                  </FormLabel>
                                  <Input
                                    {...field}
                                    placeholder={categorySpecificFields[key]}
                                  />
                                </FormControl>
                              )}
                            </Field>
                          )
                        )}
                      </Stack>
                    )}
                  </FieldArray>

                  <Stack
                    key={variantIndex}
                    flex={1}
                    spacing={1}
                    w={"fit-content"}
                    maxW={"fit-content"}
                    bg={color}
                    rounded={"xl"}
                    boxShadow={"lg"}
                    p={4}
                    my={2}
                    border="1.6px solid" // Set the border width and style
                    borderColor="gray.300" // You can adjust the border color
                  >
                    <Field name={`variants[${variantIndex}].price`}>
                      {({ field }) => (
                        <FormControl>
                          <FormLabel>Price</FormLabel>
                          <Input
                            {...field}
                            type="number"
                            placeholder="Enter price"
                          />
                        </FormControl>
                      )}
                    </Field>

                    <Field name={`variants[${variantIndex}].sku`}>
                      {({ field, form }) => (
                        <FormControl>
                          <FormLabel>SKU</FormLabel>
                          <Input {...field} placeholder="Enter SKU" />
                          <Button
                            size={"sm"}
                            mt={1} // Margin Top for spacing (adjust as needed)
                            onClick={() => {
                              // Generate SKU
                              const sku = () => {
                                const trimmedBrand = selectedBrand.substring(
                                  0,
                                  4
                                );

                                const trimmedCategory =
                                  values.brand.category.substring(0, 3);
                                return (
                                  trimmedBrand.toUpperCase() +
                                  "-" +
                                  trimmedCategory.toUpperCase() +
                                  "-" +
                                  Math.floor(Math.random() * 10000)
                                );
                              };

                              // Update field value
                              form.setFieldValue(field.name, sku());
                            }}
                          >
                            Generate SKU
                          </Button>
                        </FormControl>
                      )}
                    </Field>

                    <Field name={`variants[${variantIndex}].quantity`}>
                      {({ field }) => (
                        <FormControl>
                          <FormLabel>Quantity</FormLabel>
                          <Input
                            {...field}
                            placeholder="Enter Quantity"
                            type="number"
                          />
                        </FormControl>
                      )}
                    </Field>
                  </Stack>
                </Stack>
              ))}
            </Flex>
          </Form>
        );
      }}
    </Formik>
  );
};

export default AddProduct;
