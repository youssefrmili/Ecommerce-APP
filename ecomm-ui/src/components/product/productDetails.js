import {
  Box,
  Container,
  Stack,
  Text,
  Image,
  Flex,
  VStack,
  Button,
  Heading,
  SimpleGrid,
  StackDivider,
  List,
  ListItem,
  useToast,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { MdLocalShipping } from "react-icons/md";
import { useParams } from "react-router-dom";
import ProductService from "../../api/productService";
import Utils from "../../utils/jsutils";
import { Radio, RadioGroup } from "@chakra-ui/react";
import { green, grey } from "@mui/material/colors";
import { Form, Formik } from "formik";

const ProductDetails = ({ addCount }) => {
  const toast = useToast();
  const { productId } = useParams();
  const [product, setProduct] = useState();
  const [selectedVariant, setSelectedVariant] = useState();
  const [mergedFeatures, setMergedFeatures] = useState();

  useEffect(() => {
    getProductDetailsWithVariants(productId);
  }, [productId]);

  const generateName = () => {
    var productVariantName = product.name;
    for (const key in selectedVariant.features) {
      if (selectedVariant.features.hasOwnProperty(key)) {
        productVariantName = productVariantName.concat(
          ` ${Utils.convertToTitleCase(key)} ${selectedVariant.features[key]}`
        );
      }
    }
    return productVariantName;
  };

  const generatedPrice = () => {
    return selectedVariant.price;
  };

  const getProductDetailsWithVariants = (product) => {
    console.log("Product ID => ", product);
    const response = ProductService.getProductDetailsWithVariants(product);

    response
      .then((res) => {
        console.log(res.data);

        if (res.status === 200) {
          if (res.data.variants) {
            const variant = res.data.variants[0];
            setSelectedVariant(variant);
            setMergedFeatures(
              mergeObjects(res.data.variants.map((variant) => variant.features))
            );
          }
          setProduct(res.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  function mergeObjects(objectsArray) {
    const merged = {};

    objectsArray.forEach((obj) => {
      Object.keys(obj).forEach((key) => {
        if (!merged[key]) {
          merged[key] = [];
        }
        merged[key].push(obj[key]);
      });
    });

    return merged;
  }

  const variantValue = (feature) => {
    var value = mergedFeatures[feature]
      .filter((item, index, arr) => arr.indexOf(item) === index)
      .filter((value) => value === selectedVariant.features[feature]);
    return value[0];
  };

  const handleFeatureChange = (feature, newValue) => {
    const newVariant = product.variants.find(
      (variant) => variant.features[feature] === newValue
    );

    if (newVariant) {
      setSelectedVariant(newVariant);
    } else {
      // Handle the case where no variant matches the new feature value
      console.log("No variant found with the selected feature value");
    }

    console.log(selectedVariant);
  };

  const adjustCartItemsCount = () => {
    addCount(0, "add");
  };

  const addProductToCart = () => {
    const response = ProductService.addProductToCart({
      product_id: product.id,
      variant_id: selectedVariant.id,
      quantity: 1,
    });

    response
      .then((res) => {
        console.log(res.data);

        if (res.status === 200 || res.status === 201) {
          toast({
            title: "Product added to cart.",
            description: "We've added the item to cart.",
            status: "success",
            duration: 3000,
            isClosable: true,
          });
        }

        adjustCartItemsCount();
      })
      .catch((error) => {
        toast({
          title: "Add item to cart failed.",
          description: error.message,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        console.log(error);
      });
  };

  return (
    <Formik
      initialValues={{}}
      onSubmit={(values, { setSubmitting }) => {
        setTimeout(() => {
          // alert(JSON.stringify(values, null, 2));
          //   console.log("final output ::: ", values);
          addProductToCart();
          setSubmitting(false);
        }, 400);
      }}
    >
      {(formikProps) => {
        const { values, setFieldValue } = formikProps;
        return (
          <Form>
            <Container maxW={"7xl"}>
              {product && (
                <SimpleGrid
                  columns={{ base: 1, lg: 2 }}
                  spacing={{ base: 5, md: 10 }}
                  py={{ base: 10, md: 18 }}
                >
                  <Flex>
                    <Image
                      rounded={"md"}
                      alt={"product image"}
                      //src={
                      //  selectedVariant && selectedVariant.images.length > 0
                      //    ? selectedVariant.images[0].url
                      //    : "https://images.unsplash.com/photo-1596516109370-29001ec8ec36?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyODE1MDl8MHwxfGFsbHx8fHx8fHx8fDE2Mzg5MzY2MzE&ixlib=rb-1.2.1&q=80&w=1080"
                      //}
                      src={
                        "https://images.unsplash.com/photo-1596516109370-29001ec8ec36?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyODE1MDl8MHwxfGFsbHx8fHx8fHx8fDE2Mzg5MzY2MzE&ixlib=rb-1.2.1&q=80&w=1080"
                      }
                      fit={"cover"}
                      align={"center"}
                      w={"100%"}
                      h={{ base: "100%", sm: "400px", lg: "500px" }}
                    />
                  </Flex>
                  <Stack spacing={{ base: 6, md: 10 }}>
                    <Box as={"header"}>
                      <Heading
                        lineHeight={1.1}
                        fontWeight={500}
                        fontSize={{ base: "2xl", sm: "4xl", lg: "4xl" }}
                      >
                        {generateName()}
                      </Heading>
                      <Text
                        // color={useColorModeValue("gray.900", "gray.400")}
                        fontWeight={500}
                        fontSize={"2xl"}
                        color={"ButtonFace"}
                      >
                        $ {generatedPrice()}
                      </Text>
                    </Box>

                    <Stack
                      spacing={{ base: 4, sm: 6 }}
                      direction={"column"}
                      divider={
                        <StackDivider
                        //   borderColor={useColorModeValue("gray.200", "gray.600")}
                        />
                      }
                    >
                      <VStack spacing={{ base: 4, sm: 6 }}>
                        <Text
                          //   color={useColorModeValue("gray.500", "gray.400")}
                          fontSize={"2xl"}
                          fontWeight={"300"}
                        >
                          Lorem ipsum dolor sit amet, consetetur sadipscing
                          elitr, sed diam nonumy eirmod tempor invidunt ut
                          labore
                        </Text>
                        <Text fontSize={"lg"}>
                          Lorem ipsum dolor sit amet, consectetur adipisicing
                          elit. Ad aliquid amet at delectus doloribus dolorum
                          expedita hic, ipsum maxime modi nam officiis porro,
                          quae, quisquam quos reprehenderit velit? Natus, totam.
                        </Text>
                      </VStack>

                      {Object.keys(mergedFeatures).map((feature) => (
                        <RadioGroup
                          onChange={(newValue) =>
                            handleFeatureChange(feature, newValue)
                          }
                          value={variantValue(feature)}
                          key={feature}
                        >
                          <Text
                            fontSize={"larger"}
                            color={"-moz-initial"}
                            fontWeight={800}
                          >
                            {Utils.convertToTitleCase(feature)}
                          </Text>
                          <Stack direction="row">
                            {mergedFeatures[feature]
                              .filter(
                                (item, index, arr) =>
                                  arr.indexOf(item) === index
                              )
                              .map((value) => (
                                <Radio value={value} key={value}>
                                  {/* {Utils.convertToTitleCase(value)} */}
                                  {value}
                                </Radio>
                              ))}
                          </Stack>
                        </RadioGroup>
                      ))}

                      <Box>
                        <Text
                          fontSize={{ base: "16px", lg: "18px" }}
                          //   color={useColorModeValue("yellow.500", "yellow.300")}
                          fontWeight={"500"}
                          textTransform={"uppercase"}
                          mb={"4"}
                        >
                          Features
                        </Text>

                        <List spacing={2}>
                          {Object.keys(selectedVariant.features).map((key) => (
                            <ListItem>
                              <Text as={"span"} fontWeight={"bold"}>
                                {Utils.convertToTitleCase(key)}
                              </Text>{" "}
                              {selectedVariant.features[key]}
                            </ListItem>
                          ))}

                          {Object.keys(product.features).map((key) => (
                            <ListItem>
                              <Text as={"span"} fontWeight={"bold"}>
                                {Utils.convertToTitleCase(key)}
                              </Text>{" "}
                              {product.features[key]}
                            </ListItem>
                          ))}
                        </List>
                      </Box>
                    </Stack>

                    <Button
                      rounded={"none"}
                      w={"full"}
                      mt={8}
                      size={"lg"}
                      py={"7"}
                      bg={"lightcoral"}
                      color={"-moz-initial"}
                      textTransform={"uppercase"}
                      _hover={{
                        transform: "translateY(2px)",
                        boxShadow: "lg",
                      }}
                      isLoading={formikProps.isSubmitting}
                      type="submit"
                    >
                      Add to cart
                    </Button>

                    <Stack
                      direction="row"
                      alignItems="center"
                      justifyContent={"center"}
                    >
                      <MdLocalShipping />
                      <Text>2-3 business days delivery</Text>
                    </Stack>
                  </Stack>
                </SimpleGrid>
              )}
            </Container>
          </Form>
        );
      }}
    </Formik>
  );
};

export default ProductDetails;
