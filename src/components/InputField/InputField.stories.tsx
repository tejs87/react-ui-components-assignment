import type { Meta, StoryObj } from "@storybook/react";
import { InputField } from "./InputField";

const meta: Meta<typeof InputField> = {
  title: "Components/InputField",
  component: InputField,
};
export default meta;

type Story = StoryObj<typeof InputField>;

export const Default: Story = {
  args: {
    label: "Name",
    placeholder: "Enter your name",
  },
};

export const Error: Story = {
  args: {
    label: "Email",
    placeholder: "Enter your email",
    errorMessage: "Invalid email address",
    invalid: true,
  },
};

export const Disabled: Story = {
  args: {
    label: "Username",
    placeholder: "Disabled input",
    disabled: true,
  },
};

export const Variants: Story = {
  args: {
    label: "Password",
    placeholder: "Enter password",
    variant: "filled",
  },
};
