import { Button } from "@/components/ui/button";
import { FaLongArrowAltRight, FaPlus } from "react-icons/fa";
import { LuBookPlus } from "react-icons/lu";
import DataTable from "@/components/DataTable/DataTable";
import { useEffect, useState } from "react";
import apiCall from "@/utils/apiSlice";
import { SearchInput } from "@/components/ui/search-input";
import Modal from "@/components/Modal/Modal";
import AddUser from "./AddUser/AddUser";
import CreateAppointment from "./Appointment/Appointment";

// Define the User interface
export interface User {
  _id: string;
  name: string;
  username: string;
  createdAt: string;
  updatedAt: string;
}

// Define the Action type
type Action<T> = {
  label: string;
  icon: React.ComponentType<{ size: number }>;
  variant?: "destructive" | "default";
  onClick: (row: T) => void;
};

// Define the Column type
type Column<T> = {
  label: string;
  key: keyof T;
};

const Users = () => {
  const [data, setData] = useState<User[]>([]); // Original user data
  const [filteredData, setFilteredData] = useState<User[]>([]); // Filtered data for display
  const [searchQuery, setSearchQuery] = useState<string>(""); // Search query
  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(false); // Loading state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const openAppointmentModal = () => setIsAppointmentModalOpen(true);
  const closeAppointmentModal = () => {
    setUserData(null)
    setIsAppointmentModalOpen(false)
  };

  // Fetch data from API or mock data
  const fetchUsers = async () => {
    try {
      const response = await apiCall("/auth/users"); // Replace with your API endpoint
      const users = response.users || [];
      setData(users);
      setFilteredData(users); // Initially, display all users
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };
  useEffect(() => {
    fetchUsers();
  }, []);

  // Handle search input change
  const handleSearch = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;
    setSearchQuery(query);
    setLoading(true); // Set loading to true

    try {
      const response = await apiCall(`/auth/users/search?query=${query}`); // Replace with your search API endpoint
      const users = response.users || [];
      setFilteredData(users); // Update filtered data with search results
    } catch (error) {
      console.error("Error fetching search results:", error);
      setFilteredData(data); // Optionally reset to original data on error
    } finally {
      setLoading(false); // Set loading to false
    }
  };

  // Define columns with proper types
  const columns: Column<User>[] = [
    { label: "ID", key: "_id" },
    { label: "Name", key: "name" },
    { label: "Username", key: "username" },
    { label: "Created At", key: "createdAt" },
    { label: "Updated At", key: "updatedAt" },
  ];

  // Define actions with proper typing
  const actions: Action<User>[] = [
    {
      label: "Appointments",
      icon: LuBookPlus,
      variant: "default",
      onClick: (row: User) => {
        openAppointmentModal();
        setUserData(row);
      },
    },
  ];

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString();

  // Format the filtered data for display
  const formattedData = filteredData.map((user) => ({
    ...user,
    createdAt: formatDate(user.createdAt),
    updatedAt: formatDate(user.updatedAt),
  }));

  return (
    <div className="w-full">
      <div className="reports">
        <h2 className="mx-5 my-8 pb-10 text-white text-[25px] flex items-center gap-5">
          Admin Dashboard <FaLongArrowAltRight /> Users
        </h2>
      </div>
      <div className="mx-10 my-[-50px] bg-white rounded-lg">
        <div className="flex justify-between mx-5 py-5 items-center">
          <Button
            onClick={openModal}
            variant="outline"
            className="hover:bg-[#056014] hover:text-white px-20 flex gap-2 items-center"
          >
            <FaPlus size={15} />
            Add New User
          </Button>
          <div className="flex w-full items-center justify-end">
            <SearchInput
              placeholder="Search User by username or name"
              className="w-1/2"
              value={searchQuery}
              onChange={handleSearch}
            />
            <Button
              onClick={fetchUsers}
              variant="outline"
              className="hover:bg-[#056014] hover:text-white px-20 flex gap-2 items-center"
            >
              All
            </Button>
          </div>
        </div>
        {loading ? ( // Show loading state
          <div className="text-center py-5">Loading...</div>
        ) : (
          <DataTable<User>
            caption="List of Users"
            columns={columns}
            data={formattedData.reverse()}
            actions={actions}
          />
        )}
      </div>
      {/* User add modal */}
      <Modal isOpen={isModalOpen} title="New User" onClose={closeModal}>
        <AddUser fetchUsers={fetchUsers} closeModal={closeModal} />
      </Modal>
      {/* Appointment Modal */}
      <Modal
        isOpen={isAppointmentModalOpen}
        title={`Appointment with User:- ${userData?.name}`}
        onClose={closeAppointmentModal}
      >
        <CreateAppointment user={userData} closeAppointmentModal={closeAppointmentModal}/>
      </Modal>
    </div>
  );
};

export default Users;
