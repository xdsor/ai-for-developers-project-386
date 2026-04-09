import { createBrowserRouter, Navigate } from 'react-router-dom'
import { AdminLayout } from './components/layout/AdminLayout'
import { AdminBookingsPage } from './pages/admin/AdminBookingsPage'
import { AdminEventsPage } from './pages/admin/AdminEventsPage'
import { EventSlotsPage } from './pages/public/EventSlotsPage'
import { UserProfilePage } from './pages/public/UserProfilePage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/admin" replace />,
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
    path: '/admin',
    element: <AdminLayout />,
    children: [
      {
        index: true,
        element: <AdminEventsPage />,
      },
      {
        path: 'bookings',
        element: <AdminBookingsPage />,
      },
    ],
  },
])
