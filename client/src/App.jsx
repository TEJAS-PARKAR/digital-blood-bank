import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Register from "./pages/Register";
import FindDonor from "./pages/FindDonor";
import RequestBlood from "./pages/RequestBlood";
import AdminDashboard from "./pages/AdminDashboard";

function App() {
  return (
    <BrowserRouter>

      <Routes>

        <Route path="/" element={<Home />} />

        <Route path="/register" element={<Register />} />

        <Route path="/find-donor" element={<FindDonor />} />

        <Route path="/request-blood" element={<RequestBlood />} />

        <Route path="/admin" element={<AdminDashboard />} />

      </Routes>

    </BrowserRouter>
  );
}

export default App;