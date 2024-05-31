import { Checkbox, CheckboxGroup, SimpleGrid, Stack } from "@chakra-ui/react";
import ProductCard from "./productCard";
import { useEffect, useState } from "react";
import ProductService from "../../api/productService";
import CustomizedTreeView from "../categoryTree";
import { ThemeProvider } from "@mui/material";
import theme from "../../theme";
import { Heading } from "@chakra-ui/react";
import CategoryService from "../../api/categoryService";

const ProductGrid = () => {
  const [products, setProducts] = useState([]);
  const [selectCategories, setSelectCategories] = useState([]);
  // const [selectedCategory, setSelectedCategory] = useState();

  // useEffect(() => {
  //   getProducts();
  // }, [selectedCategory]);

  useEffect(() => {
    getAllCategories();
  }, []);

  const getAllCategories = () => {
    const response = CategoryService.getAllCategories();

    // let categories = [];
    response
      .then((res) => {
        console.log(res.data);

        if (res.status === 200) {
          setSelectCategories(res.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // const getProducts = async () => {
  //   const { data, status } = await ProductService.fetchAllProducts();
  //   if (status === 200) {
  //     setProducts(data.items);
  //   }
  // };

  const handleCategoryChange = async (categoryId) => {
    const { data, status } = await ProductService.fetchAllProducts(categoryId);
    if (status === 200) {
      setProducts(data.items);
    }
  };

  return (
    <div>
      {selectCategories.length > 0 && (
        <Stack>
          <Heading as="h4" size="1xl" noOfLines={1}>
            Select Category
          </Heading>
          <ThemeProvider theme={theme}>
            <CustomizedTreeView
              data={selectCategories}
              // selectedCategory={selectedCategory}
              onCategoryChange={handleCategoryChange}
            />
          </ThemeProvider>
        </Stack>
      )}

      {/* <CheckboxGroup colorScheme="green" defaultValue={["naruto", "kakashi"]}>
        <Stack spacing={[1, 5]} direction={["column", "row"]}>
          <Checkbox value="naruto">Naruto</Checkbox>
          <Checkbox value="sasuke">Sasuke</Checkbox>
          <Checkbox value="kakashi">Kakashi</Checkbox>
        </Stack>
      </CheckboxGroup> */}

      <SimpleGrid columns={{ base: 2, md: 3, lg: 4 }} spacing={10}>
        {products.length > 0 &&
          products.map((product, index) => (
            <ProductCard
              key={index}
              data={product}
              // maxWidth="px"
              // maxHeight="400px"
              boxShadow="md"
              // bg="white"
              _hover={{ bg: "gray.900" }}
            />
          ))}
      </SimpleGrid>
    </div>
  );
};

export default ProductGrid;
