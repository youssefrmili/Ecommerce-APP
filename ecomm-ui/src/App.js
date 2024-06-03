import React, { useEffect, useState } from "react";
import { Router, Route, Switch } from "react-router-dom";
import { Container } from "reactstrap";
import Footer from "./components/ui/Footer";
import Home from "./views/Home";
import { useAuth0 } from "@auth0/auth0-react";
import history from "./utils/history";
import "./App.css";
import initFontAwesome from "./utils/initFontAwesome";
import AddProduct from "./components/product/addProduct";
import ProductGrid from "./components/product/products";
import ProductDetails from "./components/product/productDetails";
import Cart from "./components/order-checkout/cart";
import { NavbarChakra } from "./components/ui/navbarChakra";
import Checkout from "./components/order-checkout/checkout";
import LoginUser from "./components/user-auth/loginUser";
import { MyComponent } from "./components/testcomponent";
import { useCustomAuth } from "./components/user-auth/authContext";
import { OrderSubmitted } from "./components/ui/orderSubmitted";
import MySocketComponent from "./events";
import Events from "./events";
import CartService from "./api/cartService";
import { stepButtonClasses } from "@mui/material";
import Register from "./components/user-auth/register";
import ProfilePage from "./components/user-auth/profile";
initFontAwesome();

const App = () => {
  const [loggedInUser, setLoggedInUser] = useState();
  const { user, isLoading, error } = useAuth0();
  const { appUser } = useCustomAuth();
  const [count, setCount] = useState(0);

  useEffect(() => {
    const loggedUser = appUser() ? appUser() : user;
    if (loggedUser) {
      setLoggedInUser(loggedUser);
      setCartItemsCount();
      history.push("/home");
    } else {
      history.push("/login");
    }
  }, []);

  // if (error) {
  //   return <div>Oops... {error.message}</div>;
  // }

  const setCartItemsCount = async () => {
    console.log("[Fetching cart items]");
    const response = CartService.getCartItems();

    response
      .then((res) => {
        console.log(res.data);

        if (res.status === 200) {
          if (res.data.cartItems) {
            setCount(res.data.cartItems.length);
          }
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const updateCount = (cartItemCount, modifier) => {
    if (modifier === "add") {
      setCount((prevCount) => prevCount + 1);
    } else {
      setCount(() => cartItemCount);
    }
    console.log("updating count to ::: ", count);
  };

  return (
    <Router history={history}>
      <div id="app" className="d-flex flex-column h-100">
        <NavbarChakra count={count} />
        <Container className="flex-grow-1 mt-5">
          <Switch>
            <Route path="/" exact component={Home} />
            <Route path="/home" exact component={Home} />
            <Route path="/login" exact component={LoginUser} />
            <Route path="/register" exact component={Register} />
            <Route path="/profile" exact component={ProfilePage} />
            {/* <Route path="/external-api" exact component={ExternalApi} /> */}
            <Route path="/add-product" exact component={AddProduct} />
            <Route
              path="/product/:productId"
              exact
              render={(props) => (
                <ProductDetails
                  {...props}
                  {...props}
                  addCount={(newCount, modifier) =>
                    updateCount(newCount, modifier)
                  }
                />
              )}
            />
            <Route path="/product" exact component={ProductGrid} />
            <Route
              path="/cart"
              render={(props) => (
                <Cart
                  {...props}
                  {...props}
                  reusable={true}
                  updateCount={updateCount}
                />
              )}
            />
            <Route path="/checkout" exact component={Checkout} />
            <Route path="/test" exact component={MyComponent} />
            <Route path="/order-submitted" exact component={OrderSubmitted} />
            <Route path="/events" exact component={Events} />
          </Switch>
        </Container>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
