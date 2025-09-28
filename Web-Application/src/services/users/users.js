import axiosInstance from "../axiosInstance";

const createUser = async (userData) => {
    try {
        const response = await axiosInstance.post("/auth/register", userData);
        return response.data;
    } catch (error) {
        console.error("Error creating user:", error);
        throw error;
    }
};

const getAllUsers = async () => {
    try {
        const response = await axiosInstance.get("/user");
        return response.data;
    } catch (error) {
        console.error("Error fetching users:", error);
        throw error;
    }
}

const getUserById = async (id) => {
    try {
        const response = await axiosInstance.get(`/user/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching user by ID:", error);
        throw error;
    }
};

const updateUser = async (id, userData) => {
    try {
        const response = await axiosInstance.put(`/user/${id}`, userData);
        return response.data;
    } catch (error) {
        console.error("Error updating user:", error);
        throw error;
    }
};

const deleteUser = async (id) => {
    try {
        const response = await axiosInstance.delete(`/user/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting user:", error);
        throw error;
    }
};

export { createUser, getAllUsers, getUserById, updateUser, deleteUser };