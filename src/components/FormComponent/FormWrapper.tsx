import { ReactNode } from "react";
import { UseFormReturn } from "react-hook-form";
import { Form } from "../ui/form";

interface Props {
  children: ReactNode;
  className?: string;
  form: UseFormReturn<any>;
  onSubmit: (data: any) => void;
}

const FormWrapper: React.FC<Props> = ({ children, className, form, onSubmit }) => {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={ `${className} w-full`}>
        {children}
      </form>
    </Form>
  );
};

export default FormWrapper;