import { FC } from "react";
import { useFormContext } from "react-hook-form";

import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface InputFieldProps {
  label?: string;
  placeholder?: string;
  type?: string;
  className?: string;
  style?: any;
  disabled?: boolean;
  remark?: true | false;
  min?: any;
  max?: any;
  minlength?: any;
  maxlength?: any;
  pattern?: any;
  inputmode?: any;
  onChange?: any;
  value?: any;
}

type FormInputProps = {
  name: string;
} & InputFieldProps;

const FormInput: FC<FormInputProps> = ({ name, ...otherProps }) => {
  const { control } = useFormContext();
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className=" flex flex-col justify-start items-start w-full">
          {otherProps.label && (
            <div className=" justify-between items-center">
              <Label className="text-[#4B5563]">
                {otherProps.label}
                <span className="text-red-500 pl-1">
                  {otherProps?.remark && "*"}{" "}
                </span>
              </Label>
            </div>
          )}
          <div className={`relative w-full`}>
            <FormControl className="m-0 p-0">
              <Input
                {...field}
                {...otherProps}
                className={`border-[1px] rounded-md px-2 ${
                  !otherProps.label && "pl-10"
                }`}
              />
            </FormControl>
            <FormMessage className="absolute-bottom-6" />
          </div>
        </FormItem>
      )}
    />
  );
};

export default FormInput;