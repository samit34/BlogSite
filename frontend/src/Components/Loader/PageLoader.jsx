import React from "react";
import "./Skeleton.css";
import {
  StoryListSkeleton,
  ArticleSkeleton,
  AccountSkeleton,
  HomeSkeleton,
  AuthSkeleton,
  FormSkeleton,
} from "./Skeleton";

function PageLoader({
  fullScreen = false,
  variant = "stories",
  className = "",
}) {
  if (fullScreen) {
    return <AuthSkeleton />;
  }

  const inner =
    variant === "article" ? (
      <ArticleSkeleton />
    ) : variant === "account" ? (
      <AccountSkeleton />
    ) : variant === "home" ? (
      <HomeSkeleton />
    ) : variant === "form" ? (
      <FormSkeleton />
    ) : (
      <StoryListSkeleton />
    );

  return <div className={`sk-page ${className}`.trim()}>{inner}</div>;
}

export default PageLoader;
export {
  StoryListSkeleton,
  ArticleSkeleton,
  AccountSkeleton,
  HomeSkeleton,
  AuthSkeleton,
  FormSkeleton,
};
