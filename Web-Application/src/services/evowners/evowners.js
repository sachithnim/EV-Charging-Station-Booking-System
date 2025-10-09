import axiosInstance from "../axiosInstance";

const getAllEVOwners = async () => {
    try {
        const response = await axiosInstance.get("/EVOwners");
        return response.data;
    } catch (error) {
        console.error("Error fetching EV Owners:", error);
        throw error;
    }
}

const deleteEVOwner = async (nic) => {
    try {
        const response = await axiosInstance.delete(`/EVOwners/${nic}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting EV Owner:", error);
        throw error;
    }
}

const getEVOwnerByNIC = async (nic) => {
    try {
        const response = await axiosInstance.get(`/EVOwners/${nic}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching EV Owner by NIC:", error);
        throw error;
    }
}

const deactivateEVOwner = async (nic) => {
    try {
        const response = await axiosInstance.post(`/EVOwners/${nic}/deactivate`);
        return response.data;
    } catch (error) {
        console.error("Error deactivating EV Owner:", error);
        throw error;
    }
}

const activateEVOwner = async (nic) => {
    try {
        const response = await axiosInstance.post(`/EVOwners/${nic}/activate`);
        return response.data;
    } catch (error) {
        console.error("Error activating EV Owner:", error);
        throw error;
    }
}

export { getAllEVOwners, deleteEVOwner, deactivateEVOwner, activateEVOwner, getEVOwnerByNIC };