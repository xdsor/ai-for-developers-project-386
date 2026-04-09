import { createBrowserRouter, Navigate } from 'react-router-dom'
import { HostLayout } from './components/layout/HostLayout'
import { HostBookingsPage } from './pages/host/HostBookingsPage'
import { HostEventsPage } from './pages/host/HostEventsPage'
import { EventSlotsPage } from './pages/guest/EventSlotsPage'
import { UserProfilePage } from './pages/guest/UserProfilePage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/host" replace />,
  },
  {
    path: '/users/:userSlug',
    element: <UserProfilePage />,
  },
  {
    path: '/users/:userSlug/events/:eventSlug',
    element: <EventSlotsPage />,
  },
  {
    path: '/host',
    element: <HostLayout />,
    children: [
      {
        index: true,
        element: <HostEventsPage />,
      },
      {
        path: 'bookings',
        element: <HostBookingsPage />,
      },
    ],
  },
])
