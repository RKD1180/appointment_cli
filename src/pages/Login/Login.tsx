import { z } from "zod";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import FormWrapper from "@/components/FormComponent/FormWrapper";
import FormInput from "@/components/FormComponent/FormInput";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import apiCall from "@/utils/apiSlice";
import { useState } from "react";

const formSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  password: z.string().min(4, {
    message: "password must be at least 2 characters.",
  }),
});

const Login = () => {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setError("");
    try {
      const response = await apiCall("/auth/login", "POST", values);
      if (response.status === 200) {
        // Handle successful login (e.g., redirect or show a success message)
        // store token in session
        sessionStorage.setItem("token", response.user.token);
        sessionStorage.setItem("user", JSON.stringify(response.user));
        setSuccess("Login successful!");
        navigate("/dashboard")
      } else {
        setError(response.message);
      }
      // Handle successful registration (e.g., redirect or show a success message)
    } catch (error) {
      // console.error("Registration error:", error);
      // Handle registration error (e.g., show an error message)
    }
  };

  return (
    <div className="flex justify-center items-center h-screen w-2/4 mx-auto">
      <div className="border p-5 m-3 rounded flex items-center justify-center w-1/2 h-2/4 shadow-lg">
        <FormWrapper form={form} onSubmit={onSubmit}>
          <div className="grid grid-col-12 gap-2">
            <div className="col-span-12">
              <FormInput name="username" label="User Name" remark={true} />
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
              <Button type="submit">Submit</Button>
            </div>
            <div className="col-span-12">
              {success && <p className="text-green-500">{success}</p>}
              {error && <p>{error}</p>}
              <p className="text-center text-gray-500">
                Don't have an account?{" "}
                <Link to={"/sign-up"} className="text-blue-500">
                  Sign Up
                </Link>
              </p>
            </div>
          </div>
        </FormWrapper>
      </div>
    </div>
  );
};

export default Login;
