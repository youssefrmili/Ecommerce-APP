import {
  Flex,
  Circle,
  Box,
  Image,
  Badge,
  useColorModeValue,
  Icon,
  chakra,
  Tooltip,
} from "@chakra-ui/react";
import { BsStar, BsStarFill, BsStarHalf } from "react-icons/bs";
import { FiShoppingCart } from "react-icons/fi";
import { useHistory } from "react-router-dom";

function Rating({ rating, numReviews }) {
  return (
    <Box display="flex" alignItems="center">
      {Array(5)
        .fill("")
        .map((_, i) => {
          const roundedRating = Math.round(rating * 2) / 2;
          if (roundedRating - i >= 1) {
            return (
              <BsStarFill
                key={i}
                style={{ marginLeft: "1" }}
                color={i < rating ? "teal.500" : "gray.300"}
              />
            );
          }
          if (roundedRating - i === 0.5) {
            return <BsStarHalf key={i} style={{ marginLeft: "1" }} />;
          }
          return <BsStar key={i} style={{ marginLeft: "1" }} />;
        })}
      <Box as="span" ml="2" color="gray.600" fontSize="sm">
        {numReviews} review{numReviews > 1 && "s"}
      </Box>
    </Box>
  );
}

const ProductCard = ({ data, ...props }) => {
  const history = useHistory();

  const handleClick = () => {
    history.push("/product/".concat(data.productId));
  };

  const truncateString = (str, length) => {
    if (str.length <= length) {
      return str;
    }
    return str.substring(0, length) + "...";
  };

  return (
    <Flex p={50} w="full" alignItems="center" justifyContent="center">
      <Box
        bg={useColorModeValue("white", "gray.800")}
        maxW="sm"
        borderWidth="1px"
        rounded="lg"
        shadow="lg"
        position="relative"
        {...props}
      >
        {data.isNew && (
          <Circle
            size="10px"
            position="absolute"
            top={2}
            right={2}
            bg="red.200"
          />
        )}

        <Image
          src={data.imageURL}
          // src={
          //   "https://ecomm-backend-images.s3.ca-central-1.amazonaws.com/55/iphone14pro-1.png"
          // }
          alt={`Picture of ${truncateString(data.name, 30)}`}
          roundedTop="lg"
          height={190}
          width={250}
        />

        <Box p="4">
          <Box display="flex" alignItems="baseline">
            {data.isNew && (
              <Badge rounded="full" px="2" fontSize="0.8em" colorScheme="red">
                New
              </Badge>
            )}
          </Box>
          <Flex
            mt="1"
            justifyContent="space-between"
            alignContent="center"
            marginBottom="1.5rem"
          >
            <Box
              fontSize="1xl"
              fontWeight="semibold"
              as="h5"
              lineHeight="tight"
              onClick={handleClick}
            >
              {truncateString(data.name, 38)}
            </Box>
            {/* <Tooltip
              label="Add to cart"
              bg="white"
              placement={"top"}
              color={"gray.800"}
              fontSize={"1.2em"}
            >
              <chakra.a href={"#"} display={"flex"}>
                <Icon as={FiShoppingCart} h={5} w={5} alignSelf={"center"} />
              </chakra.a>
            </Tooltip> */}
          </Flex>

          <Flex
            justifyContent="space-between"
            alignContent="center"
            direction={"column"}
          >
            <Rating rating={data.rating} numReviews={data.numReviews} />
            <Box fontSize="2xl" color={useColorModeValue("gray.800", "white")}>
              <Box as="span" color={"gray.600"} fontSize="md">
                $
              </Box>
              {data.price.toFixed(2)}
            </Box>
          </Flex>
        </Box>
      </Box>
    </Flex>
  );
};

export default ProductCard;
