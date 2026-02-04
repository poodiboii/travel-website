import { Routes, Route } from "react-router-dom";

import Header from "./components/Header";
import Footer from "./components/Footer";

/* Pages */
import Home from "./pages/Home";
import About from "./pages/About";
import Packages from "./pages/Packages";
import Contact from "./pages/Contact";
import PackageDetailsPage from "./pages/PackageDetailsPage";

/* ✅ Custom Package */
import CustomPackage from "./pages/CustomPackage";

/* Hotels */
import Hotels from "./pages/Hotels";
import HotelDetailsPage from "./pages/HotelDetailsPage";

/* Visa */
import Visa from "./pages/Visa";

/* Cab */
import Cab from "./pages/Cab";

/* Cart */
import Cart from "./pages/Cart";

/* Floating WhatsApp */
import WhatsAppChat from "./components/WhatsAppChat";

function App() {
  return (
    <div className="app-container">
      <Header />

      <main className="app-main">
        <Routes>
          {/* Home */}
          <Route path="/" element={<Home />} />

          {/* About */}
          <Route path="/about" element={<About />} />

          {/* Packages */}
          <Route path="/packages" element={<Packages />} />
          <Route
            path="/packages/:packageId"
            element={<PackageDetailsPage />}
          />

          {/* ✅ Custom Package */}
          <Route
            path="/custom-package"
            element={<CustomPackage />}
          />

          {/* Hotels */}
          <Route path="/hotels" element={<Hotels />} />
          <Route
            path="/hotels/:hotelId"
            element={<HotelDetailsPage />}
          />

          {/* Visa */}
          <Route path="/visa" element={<Visa />} />
          <Route path="/visa/:visaId" element={<Visa />} />

          {/* Cab */}
          <Route path="/cab" element={<Cab />} />
          <Route path="/cab/:cabId" element={<Cab />} />

          {/* Cart */}
          <Route path="/cart" element={<Cart />} />

          {/* Contact */}
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </main>

      <Footer />

      {/* Floating WhatsApp chat on all pages */}
      <WhatsAppChat />
    </div>
  );
}

export default App;
