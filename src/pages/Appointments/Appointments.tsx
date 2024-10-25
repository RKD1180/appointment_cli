import { useEffect, useState } from "react";
import apiCall from "@/utils/apiSlice";
import DataTable from "@/components/DataTable/DataTable";
import { SearchInput } from "@/components/ui/search-input";
import StatusHandle from "@/components/StatusHandle/StatusHandle";
import SelectComponent from "@/components/SelectComponent/SelectComponent";
import { useToast } from "@/hooks/use-toast";

interface Participant {
  _id: string;
  name: string;
}

export interface Appointment {
  _id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  status: "pending" | "confirmed" | "canceled" | "completed";
  participant: Participant;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

type Column<T> = {
  label: string;
  key: keyof T;
  render?: (item: T) => JSX.Element;
};

const Appointments = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [filteredAppointments, setFilteredAppointments] = useState<
    Appointment[]
  >([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Fetch all appointments for the logged-in user
  const fetchAppointments = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiCall("/appointment/all");
      const userAppointments = response.appointments || [];
      setAppointments(userAppointments);
      const formattedData = userAppointments.map((item: any) => ({
        ...item,
        createdAt: formatDate(item.createdAt),
        updatedAt: formatDate(item.updatedAt),
        date: formatDate(item.date),
      }));
      setFilteredAppointments(formattedData);
    } catch (err) {
      console.error("Error fetching appointments:", err);
      setError("Failed to load appointments. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  // Handle status change
  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await apiCall(`/appointment/${id}/status`, "POST", { status: newStatus });
      toast({
        title: "Appointment Status Changed",
      });
      fetchAppointments();
    } catch (err) {
      console.error("Error updating status:", err);
      setError("Failed to update status. Please try again.");
    }
  };

  // Handle search input change with debounce
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;
    setSearchQuery(query);
    filterAppointments(query, statusFilter);
  };

  // Handle status filter change
  const handleStatusFilterChange = (status: string | null) => {
    setStatusFilter(status);
    filterAppointments(searchQuery, status);
  };

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString();

  // Filter appointments based on search, status, and date range
  const filterAppointments = (query: string, status: string | null) => {
    let filtered = [...appointments];

    if (query) {
      filtered = filtered.filter(
        (appointment) =>
          appointment.title.toLowerCase().includes(query.toLowerCase()) ||
          appointment.description.toLowerCase().includes(query.toLowerCase())
      );
    }

    if (status) {
      filtered = filtered.filter(
        (appointment) => appointment.status === status
      );
    }
    const formattedData = filtered.map((item) => ({
      ...item,
      createdAt: formatDate(item.createdAt),
      updatedAt: formatDate(item.updatedAt),
      date: formatDate(item.date),
    }));

    setFilteredAppointments(formattedData);
  };

  // Define columns for the DataTable
  const columns: Column<Appointment>[] = [
    { label: "ID", key: "_id" },
    { label: "Title", key: "title" },
    { label: "Description", key: "description" },
    { label: "Date", key: "date" },
    { label: "Time", key: "time" },
    {
      label: "Participant",
      key: "participant",
      render: (appointment: Appointment) => (
        <span>{appointment.participant.name}</span>
      ),
    },
    {
      label: "Status",
      key: "status",
      render: (appointment: Appointment) => (
        <StatusHandle status={appointment.status} />
      ),
    },
    { label: "Created At", key: "createdAt" },
    { label: "Updated At", key: "updatedAt" },
    {
      label: "Change Status",
      key: "status",
      render: (appointment: Appointment) => (
        <SelectComponent
          options={[
            { value: "pending", label: "Pending" },
            { value: "confirmed", label: "Confirmed" },
            { value: "canceled", label: "Canceled" },
            { value: "completed", label: "Completed" },
          ]}
          selectedValue={appointment.status}
          placeholder="Select Status"
          onChange={(value) => handleStatusChange(appointment._id, value)}
        />
      ),
    },
  ];

  return (
    <div className="appointments">
      <h2 className="text-2xl font-bold mb-4">My Appointments</h2>

      <div className="flex justify-between items-center mb-4">
        <SearchInput
          placeholder="Search Appointments"
          value={searchQuery}
          onChange={handleSearch}
          className="w-1/2"
        />
        <SelectComponent
          options={[
            { value: "all", label: "All" },
            { value: "pending", label: "Pending" },
            { value: "confirmed", label: "Confirmed" },
            { value: "canceled", label: "Canceled" },
            { value: "completed", label: "Completed" },
          ]}
          selectedValue={statusFilter || "all"} // Set default to "all"
          placeholder="Filter by Status"
          onChange={(value) =>
            handleStatusFilterChange(value !== "all" ? value : null)
          }
        />
      </div>

      {loading ? (
        <div className="text-center py-5">Loading...</div>
      ) : error ? (
        <div className="text-red-500 text-center py-5">{error}</div>
      ) : (
        <DataTable<Appointment>
          caption="List of Appointments"
          columns={columns}
          data={filteredAppointments.reverse()}
        />
      )}
    </div>
  );
};

export default Appointments;
