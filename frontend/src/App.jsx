import { Routes, Route } from 'react-router-dom'
// Pages
import GuestHomePage from './pages/public/GuestHomePage'
import DestinationsPage from './pages/public/DestinationsPage'
import AboutPage from './pages/public/AboutPage'
import ContactPage from './pages/public/ContactPage'
import FAQPage from './pages/public/FAQPage'
import PrivacyPage from './pages/public/PrivacyPage'
import TermsPage from './pages/public/TermsPage'
import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage'
import VerifyPasswordPage from './pages/auth/VerifyPasswordPage'
import UpdatePasswordPage from './pages/auth/UpdatePasswordPage'

import CheckoutPage from './pages/public/CheckoutPage'
import DestinationDetailsPage from './pages/public/DestinationDetailsPage'
import HotelDetailsPage from './pages/public/HotelDetailsPage'

// Dashboards
import TravelerDashboard from './pages/dashboards/TravelerDashboard'
import AdminDashboard from './pages/dashboards/AdminDashboard'
import ProviderDashboard from './pages/dashboards/ProviderDashboard'
import RiderDashboard from './pages/dashboards/RiderDashboard'

// Layout
import Navbar from './components/layout/Navbar'

const App = () => (
    <Routes>
        <Route path="/" element={<GuestHomePage />} />
        <Route path="/destinations" element={<DestinationsPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/faq" element={<FAQPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/destinations/:slug" element={<DestinationDetailsPage />} />
        <Route path="/hotel/:hotelId" element={<HotelDetailsPage />} />

        {/* Auth Pages */}
        <Route path="/signin" element={<LoginPage />} />
        <Route path="/signup" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/verify-password" element={<VerifyPasswordPage />} />
        <Route path="/update-password" element={<UpdatePasswordPage />} />

        {/* User Dashboards */}
        <Route path="/dashboard/traveler" element={<TravelerDashboard />} />
        <Route path="/dashboard/admin" element={<AdminDashboard />} />
        <Route path="/dashboard/provider" element={<ProviderDashboard />} />
        <Route path="/dashboard/rider" element={<RiderDashboard />} />
    </Routes>
)

export default App
