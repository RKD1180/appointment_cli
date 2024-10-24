import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import FormWrapper from "@/components/FormComponent/FormWrapper";
import FormInput from "@/components/FormComponent/FormInput";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import apiCall from "@/utils/apiSlice";
import { useState } from "react";

const formSchema = z.object({
  name: z.string().min(1, {
    message: "Name is required.",
  }),
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  password: z.string().min(4, {
    message: "Password must be at least 4 characters.",
  }),
});

const Register = () => {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
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
      const response = await apiCall("/auth/register", "POST", values);
      if (response.status === 200) {
        // Handle successful registration (e.g., show a success message)
        setSuccess("Registration successful! Please log in.");
        setError(""); // Clear any previous errors
        form.reset();
      } else {
        setError(response.message);
        setSuccess(""); // Clear any previous success messages
      }
    } catch (error) {
      setError("An error occurred during registration. Please try again.");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen w-2/4 mx-auto">
      <div className="border p-5 m-3 rounded flex items-center justify-center w-1/2 h-fit shadow-lg">
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
              <Button type="submit">Register</Button>
            </div>
            <div className="col-span-12">
              {error && <p className="text-red-500">{error}</p>}
              {success && <p className="text-green-500">{success}</p>}
              <p className="text-center text-gray-500">
                Already have an account?{" "}
                <Link to={"/login"} className="text-blue-500">
                  Log In
                </Link>
              </p>
            </div>
          </div>
        </FormWrapper>
      </div>
    </div>
  );
};

export default Register;
