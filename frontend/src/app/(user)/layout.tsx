import FloatButton from "@/components/features/contact/float-button";
import TopBreadcrump from "@/components/layouts/top-breadcrumb";
import CategoryBar from "@/components/layouts/category-bar";
import Footer from "@/components/layouts/footer";
import Header from "@/components/layouts/header";
import { UserProvider } from "@/libs/contexts/UserContext";
import React from "react";

export default async function UserLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <UserProvider>
      <>
        <Header></Header>
        <CategoryBar></CategoryBar>
        <TopBreadcrump></TopBreadcrump>
        <div className="mx-24 my-2">{children}</div>
        <Footer></Footer>
        <FloatButton></FloatButton>
      </>
    </UserProvider>
  );
}
