import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeClosed, KeyRoundIcon } from "lucide-react";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  password: z.string().nonempty(),
});

interface Props {
  onSubmit: (password: string) => void;
  submitting: boolean;
}

function AdminCheckPasswordForm({ onSubmit, submitting }: Props) {
  const [showPassword, setShowPassword] = React.useState(false);
  const form = useForm({
    resolver: zodResolver(formSchema),
    mode: "onSubmit",
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((val) => {
          onSubmit(val.password);
        })}
        className="w-[30dvw] p-2 space-y-2"
      >
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-semibold opacity-50">
                Mật khẩu
              </FormLabel>
              <FormControl>
                <InputGroup>
                  <InputGroupAddon>
                    <KeyRoundIcon />
                  </InputGroupAddon>
                  <InputGroupInput
                    {...field}
                    type={showPassword ? "text" : "password"}
                  />
                  <InputGroupAddon
                    align={"inline-end"}
                    className="cursor-pointer"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <Eye /> : <EyeClosed />}
                  </InputGroupAddon>
                </InputGroup>
              </FormControl>
            </FormItem>
          )}
        />
        <Button className="flex ms-auto" disabled={submitting}>
          Xác nhận
        </Button>
      </form>
    </Form>
  );
}

export default AdminCheckPasswordForm;
