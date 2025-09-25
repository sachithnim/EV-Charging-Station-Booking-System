import { useState } from "react";
import { Mail, Lock, Zap } from "lucide-react";
import Input from "./../../components/input/Input";
import Button from "./../../components/button/Button";
import { useNavigate } from "react-router-dom";

export default function SignIn() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // if (!validateForm()) return;

    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      navigate("/");
      console.log("Sign in attempted with:", formData);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-500 to-success-500">
        <div
          className="absolute inset-0 opacity-20 animate-float"
          style={{
            backgroundImage: `
              radial-gradient(circle at 25% 25%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
              radial-gradient(circle at 75% 75%, rgba(255, 255, 255, 0.1) 0%, transparent 50%)
            `,
            backgroundSize: "100px 100px",
          }}
        ></div>
      </div>

      {/* Sign In Card */}
      <div className="bg-white rounded-3xl shadow-2xl p-12 w-full max-w-md relative overflow-hidden">
        {/* Top accent */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-500 to-success-500"></div>

        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center text-white">
              <Zap className="w-7 h-7" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800">ChargePoint</h1>
          </div>
          <p className="text-gray-600">
            Power up your journey with smart EV charging
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            type="email"
            label="Email Address"
            placeholder="Enter your email"
            value={formData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            error={errors.email}
            icon={Mail}
            required
          />

          <Input
            type="password"
            label="Password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={(e) => handleInputChange("password", e.target.value)}
            error={errors.password}
            icon={Lock}
            required
          />

          <div className="flex items-center justify-center text-sm">
            <a
              href="#"
              className="text-primary-500 hover:text-primary-600 font-medium transition-colors"
            >
              Forgot password?
            </a>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            loading={loading}
            className="w-full"
          >
            Sign In
          </Button>
        </form>
      </div>
    </div>
  );
}
