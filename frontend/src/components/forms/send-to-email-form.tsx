import Input from "@/components/common/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const schema = z.object({
  email: z.string().email("Email không đúng định dạng"),
});

export default function SendToEmailForm() {
  const form = useForm({
    resolver: zodResolver(schema),
    mode: "all",
    defaultValues: { email: "" },
  });
  return (
    <Form {...form}>
      <form noValidate className="space-y-4">
        <FormField
          name="email"
          control={form.control}
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  icon={
                    <i className="bx bxs-envelope text-xl bg-black text-white p-3"></i>
                  }
                  placeholder="example@gmail.com"
                  isError={fieldState.invalid}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <button
          className="bg-black text-white rounded-sm px-4 py-2 cursor-pointer opacity-80 hover:opacity-100 ms-auto block"
          onClick={() => {}}
        >
          Gửi
        </button>
      </form>
    </Form>
  );
}
