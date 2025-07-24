import { createBrowserRouter } from "react-router";
import RootLayout from "../layouts/RootLayout";
import Error from "../pages/Error";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import PrivateRoute from "./PrivateRoute";
import DashboardLayout from "../layouts/DashboardLayout";
import Profile from "../dashboard/Profile";
import MyDonationRequests from "../dashboard/MyDonationRequests";
import DashboardHome from "../dashboard/DashboardHome";
import CreateDonationRequest from "../dashboard/CreateDonationRequest";
import EditDonationRequest from "../dashboard/EditDonationRequest";
import DonationDetails from "../dashboard/DonationDetails";
import AllUsers from "../dashboard/AllUsers";

const mainRoutes = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout></RootLayout>,
    errorElement: <Error></Error>,
    children: [
      {
        path: "/",
        element: <Home></Home>,
      },
      {
        path: "login",
        element: <Login></Login>,
      },
      {
        path: "registration",
        element: <Register></Register>,
      },
    ],
  },
  {
    path: "/dashboard",
    element: (
      <PrivateRoute>
        <DashboardLayout></DashboardLayout>
      </PrivateRoute>
    ),
    children: [
      {
        index: true,
        element: (
          <PrivateRoute>
            <DashboardHome />
          </PrivateRoute>
        ),
      },
      {
        path: "profile",
        element: (
          <PrivateRoute>
            <Profile></Profile>
          </PrivateRoute>
        ),
      },
      {
        path: "my-donation-requests",
        element: (
          <PrivateRoute>
            <MyDonationRequests></MyDonationRequests>
          </PrivateRoute>
        ),
      },
      {
        path: "create-donation-requests",
        element: (
          <PrivateRoute>
            <CreateDonationRequest></CreateDonationRequest>
          </PrivateRoute>
        ),
      },
      {
        path: "donation-requests/:id",
        element: (
          <PrivateRoute>
            <DonationDetails />
          </PrivateRoute>
        ),
      },
      {
        path: "/dashboard/donation-requests/:id/edit",
        element: (
          <PrivateRoute>
            <EditDonationRequest></EditDonationRequest>
          </PrivateRoute>
        ),
      },
      {
        path: "/dashboard/manage-users",
        element: (
          <PrivateRoute>
            <AllUsers></AllUsers>
          </PrivateRoute>
        ),
      },
    ],
  },
]);

export default mainRoutes;
