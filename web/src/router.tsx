import { createBrowserRouter, Navigate } from 'react-router-dom'
import { GuestLayout } from './components/layout/GuestLayout'
import { HostLayout } from './components/layout/HostLayout'
import { HostBookingsPage } from './pages/host/HostBookingsPage'
import { HostEventsPage } from './pages/host/HostEventsPage'
import { EventSlotsPage } from './pages/guest/EventSlotsPage'
import { HostProfilePage } from './pages/guest/HostProfilePage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/host" replace />,
  },
  {
    path: '/hosts/:hostSlug',
    element: <GuestLayout />,
    children: [
      {
        index: true,
        element: <HostProfilePage />,
      },
      {
        path: 'events/:eventSlug',
        element: <EventSlotsPage />,
      },
    ],
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
