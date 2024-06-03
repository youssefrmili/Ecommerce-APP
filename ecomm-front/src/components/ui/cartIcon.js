import React from "react";
import { ThemeProvider, Badge, IconButton } from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import theme from "../../theme";
import styled from "@emotion/styled";

const CartIconButton = ({ count }) => {
  const StyledBadge = styled(Badge)(({ theme }) => ({
    // Style your badge as needed, example:
    "& .MuiBadge-badge": {
      right: -3,
      top: 13,
      border: `2px solid ${theme.palette.background.paper}`,
      padding: "0 2px",
    },
  }));

  return (
    <ThemeProvider theme={theme}>
      <IconButton
        aria-label="cart"
        style={{ color: "white", fontSize: "2.2rem" }}
      >
        {" "}
        {/* Adjust the color and size here */}
        <StyledBadge badgeContent={count} color="secondary">
          <ShoppingCartIcon style={{ fontSize: "inherit" }} />{" "}
          {/* Inherits fontSize from IconButton */}
        </StyledBadge>
      </IconButton>
    </ThemeProvider>
  );
};

export default CartIconButton;
