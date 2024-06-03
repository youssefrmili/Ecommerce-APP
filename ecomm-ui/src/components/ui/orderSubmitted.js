import {
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from "@chakra-ui/react";

export const OrderSubmitted = ({ status, title, description }) => {
  return (
    <Alert
      status="success"
      variant="subtle"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      textAlign="center"
      height="200px"
    >
      <AlertIcon boxSize="40px" mr={0} />
      <AlertTitle mt={4} mb={1} fontSize="lg">
        Order Submitted!
      </AlertTitle>
      <AlertDescription maxWidth="sm">
        Your order has been placed, you will get notification in the email
      </AlertDescription>
    </Alert>
  );
};
