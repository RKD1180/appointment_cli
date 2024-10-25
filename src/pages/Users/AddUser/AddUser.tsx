import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import FormWrapper from "@/components/FormComponent/FormWrapper";
import FormInput from "@/components/FormComponent/FormInput";
import { Button } from "@/components/ui/button";
import apiCall from "@/utils/apiSlice";
import { useState } from "react";

interface Props {
  fetchUsers: () => void; // Function to fetch users from the API
  closeModal: () => void; // Function to close the modal
}

const formSchema = z.object({
  name: z.string().min(1, { message: "Name is required." }),
  username: z
    .string()
    .min(2, { message: "Username must be at least 2 characters." }),
  password: z
    .string()
    .min(4, { message: "Password must be at least 4 characters." }),
});

const AddUser = ({ fetchUsers, closeModal }: Props) => {
  const [message, setMessage] = useState<string | null>(null); // Single state for success/error messages

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      username: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await apiCall("/auth/register", "POST", values); // Adjust endpoint
      if (response.status === 200) {
        setMessage("User added successfully!"); // Success message
        fetchUsers();
        closeModal();
        form.reset();
      } else {
        setMessage(response.message || "Failed to add user."); // API error message
      }
    } catch (error) {
      setMessage("An error occurred. Please try again.");
    }
  };

  return (
    <div className="border p-2 m-1 rounded flex items-center justify-center w-full h-full shadow-lg">
      <FormWrapper form={form} onSubmit={onSubmit}>
        <div className="grid grid-cols-12 gap-2">
          <div className="col-span-12">
            <FormInput name="name" label="Name" remark={true} />
          </div>
          <div className="col-span-12">
            <FormInput name="username" label="Username" remark={true} />
          </div>
          <div className="col-span-12">
            <FormInput
              name="password"
              label="Password"
              type="password"
              remark={true}
            />
          </div>
          <div className="col-span-12">
            <Button type="submit">Add User</Button>
          </div>
          <div className="col-span-12">
            {message && (
              <p
                className={`text-center ${
                  message.includes("success")
                    ? "text-green-500"
                    : "text-red-500"
                }`}
              >
                {message}
              </p>
            )}
          </div>
        </div>
      </FormWrapper>
    </div>
  );
};

export default AddUser;
