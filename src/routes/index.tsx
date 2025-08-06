import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import ChatProvider from "pages/chat/context/chat";
import ProtectedRoute from "components/ProtectedRoute";
const ChatPage = React.lazy(() => import("pages/chat/chat-room-page"));
const UnSelectedChatPage = React.lazy(() => import("pages/chat/unselected-page"));
const LoginPage = React.lazy(() => import("pages/auth/LoginPage"));
const SignupPage = React.lazy(() => import("pages/auth/SignupPage"));

const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/signup",
    element: <SignupPage />,
  },
  {
    path: "/:id",
    element: (
      <ProtectedRoute>
        <ChatPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <UnSelectedChatPage />
      </ProtectedRoute>
    ),
  },
]);

export default function AppRoutes() {
  return (
    <ChatProvider>
      <RouterProvider router={router} />
    </ChatProvider>
  );
}
