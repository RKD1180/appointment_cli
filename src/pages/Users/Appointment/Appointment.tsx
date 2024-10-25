import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import FormWrapper from "@/components/FormComponent/FormWrapper";
import FormInput from "@/components/FormComponent/FormInput";
import { Button } from "@/components/ui/button";
import apiCall from "@/utils/apiSlice";
import { User } from "../Users";
import { useToast } from "@/hooks/use-toast";

// Define the validation schema using Zod
const appointmentSchema = z.object({
  title: z.string().min(1, { message: "Title is required." }),
  description: z
    .string()
    .min(5, { message: "Description must be at least 5 characters." }),
  date: z.string().min(1, { message: "Date is required." }),
  time: z.string().min(1, { message: "Time is required." }),
  participantId: z.string().min(1, { message: "Participant ID is required." }),
});

type AppointmentFormData = z.infer<typeof appointmentSchema>;

interface Props {
  user: User | null;
  closeAppointmentModal: () => void;
}

const CreateAppointment = ({ user, closeAppointmentModal }: Props) => {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { toast } = useToast();

  const form = useForm<AppointmentFormData>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      title: "",
      description: "",
      date: "",
      time: "",
      participantId: user?._id,
    },
  });

  const onSubmit = async (values: AppointmentFormData) => {
    const user = sessionStorage.getItem("user") || "";
    const parseD = JSON.parse(user);
    const data = { createdBy: parseD._id, ...values };
    try {
      const response = await apiCall("/appointment", "POST", data);

      if (response.status === 201) {
        setSuccess("Appointment created successfully!");
        setError(""); 
        toast({
          title: "Appointment created successfully!",
        });
        form.reset();
        closeAppointmentModal();
        
      } else {
        setError(response.error.message);
        setSuccess(""); // Clear any previous success messages
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <div className="flex justify-center items-center h-full w-full mx-auto">
      <div className="border p-5 m-3 rounded flex items-center justify-center w-full h-fit shadow-lg">
        <FormWrapper form={form} onSubmit={onSubmit}>
          <div className="grid grid-cols-12 gap-2">
            <div className="col-span-12">
              <FormInput name="title" label="Title" />
            </div>
            <div className="col-span-12">
              <FormInput name="description" label="Description" />
            </div>
            <div className="col-span-6">
              <FormInput name="date" label="Date" type="date" />
            </div>
            <div className="col-span-6">
              <FormInput name="time" label="Time" type="time" />
            </div>
            <div className="col-span-12">
              <FormInput
                name="participantId"
                label="Participant ID"
                disabled={true}
              />
            </div>
            <div className="col-span-12">
              <Button type="submit">Create Appointment</Button>
            </div>
            <div className="col-span-12">
              {error && <p className="text-red-500">{error}</p>}
              {success && <p className="text-green-500">{success}</p>}
            </div>
          </div>
        </FormWrapper>
      </div>
    </div>
  );
};

export default CreateAppointment;
