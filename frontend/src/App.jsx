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

        {/* Auth Pages */}
        <Route path="/signin" element={<LoginPage />} />
        <Route path="/signup" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/verify-password" element={<VerifyPasswordPage />} />
        <Route path="/update-password" element={<UpdatePasswordPage />} />
    </Routes>
)

export default App
