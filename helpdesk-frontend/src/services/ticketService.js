import api from "./api";

export const getAllTickets = async () => {
  const response = await api.get("/Tickets");
  return response.data;
};
