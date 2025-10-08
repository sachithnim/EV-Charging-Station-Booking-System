import { useNavigate } from "react-router-dom";
import StationList from "./StationList";

export default function ChargingStationManagement() {
  const navigate = useNavigate();

  return (
    <StationList
      onCreate={() => navigate("/charging-station-management/new")}
      onView={(row) => navigate(`/charging-station-management/${row.id}`)}
      onEdit={(row) => navigate(`/charging-station-management/${row.id}/edit`)}
    />
  );
}
