import axiosInstanceNoToken from "../axiosInstanceNoToken";

const login = async (credentials) => {
  try {
    const response = await axiosInstanceNoToken.post("/auth/login", credentials);
    return response.data;
  } catch (error) {
    console.error("Login failed:", error);
    throw error;
  }
};

const logout = async () => {
  try {
    localStorage.removeItem("token");
  } catch (error) {
    console.error("Logout failed:", error);
    throw error;
  }
};

export { login, logout };
