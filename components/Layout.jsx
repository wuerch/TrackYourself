import React from "react";
import Header from './Header'
  
const Footer = () => {
  return <h3 className="">This is a Footer</h3>;
};
  
const Layout = ({ children }) => {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
};
  
export default Layout;