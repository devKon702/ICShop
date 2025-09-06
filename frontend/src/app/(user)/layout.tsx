import AuthModal from "@/components/features/auth/auth-modal";
import FloatButton from "@/components/features/contact/float-button";
import TopBreadcrump from "@/components/layouts/top-breadcrumb";
import CategoryBar from "@/components/layouts/category-bar";
import Footer from "@/components/layouts/footer";
import Header from "@/components/layouts/header";
import { UserProvider } from "@/libs/contexts/UserContext";
import React from "react";
import { categoryService } from "@/libs/services/category.service";
import { notFound } from "next/navigation";

export default async function UserLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const categories = await categoryService.getCategoryOverview();
  // if (!categories) notFound();
  return (
    <UserProvider>
      <>
        <Header></Header>
        {/* <CategoryBar categories={categories}></CategoryBar> */}
        <TopBreadcrump></TopBreadcrump>
        <div className="mx-24 my-2">{children}</div>
        <Footer></Footer>
        <FloatButton></FloatButton>
        <AuthModal></AuthModal>
      </>
    </UserProvider>
  );
}
