import { createBrowserRouter } from "react-router-dom";
import HomeLayout from "../layouts/homeLayout/HomeLayout";
import Dashboard from "../layouts/dashboard/Dashboard";
import EVOwnerManagement from "../layouts/evOwnerManagement/EVOwnerManagement";
import SignIn from "../layouts/signIn/SignIn";
import ChargingStationManagement from "../layouts/chargingStationManagement/ChargingStationManagement";
import BookingManagement from "../layouts/bookingManagement/BookingManagement";
import UserManagement from "../layouts/userManagement/UserManagement";
import StationForm from "../layouts/chargingStationManagement/StationForm";
import StationDetails from "../layouts/chargingStationManagement/StationDetails";



export const router = createBrowserRouter([
    {
        path: "/",
        element: <HomeLayout />,
        children: [
            {
                index: true,
                element: <Dashboard />
            },
            {
                path: "ev-owner-management",
                children: [
                    {
                        index: true,
                        element: <EVOwnerManagement />
                    }
                ]
            },
            {
                path: "charging-station-management",
                children: [
                    { index: true, element: <ChargingStationManagement /> },
                    { path: "new", element: <StationForm /> },
                    { path: ":id/edit", element: <StationForm /> },
                    { path: ":id", element: <StationDetails /> },
                ]
                },
            {
                path: "booking-management",
                children: [
                    {
                        index: true,
                        element: <BookingManagement />
                    }
                ]
            },
            {
                path: "user-management",
                children: [
                    {
                        index: true,
                        element: <UserManagement />
                    }
                ]
            }
        ]
    },
    {
        path: "/sign-in",
        element: <SignIn />
    },
])