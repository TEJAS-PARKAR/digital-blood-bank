import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import API from "../services/api";

function LoginSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const name = searchParams.get("name");
    const role = searchParams.get("role");

    const setSession = async () => {
      try {
        const meRes = await API.get("/auth/me");

        if (meRes.data.success) {
          localStorage.setItem("user", JSON.stringify(meRes.data.user));

          navigate("/");
          window.location.reload();
        } else {
          // fallback to minimal user data
          localStorage.setItem("user", JSON.stringify({ name, role }));

          navigate("/");
          window.location.reload();
        }
      } catch (err) {
        console.error(err);
        localStorage.setItem("user", JSON.stringify({ name, role }));
        navigate("/");
        window.location.reload();
      }
    };

    setSession();
  }, [navigate, searchParams]);

  return (
    <div className="container">
      <h2>Login successful</h2>
      <p>Redirecting…</p>
    </div>
  );
}

export default LoginSuccess;
