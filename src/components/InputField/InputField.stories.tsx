import type { Meta, StoryObj } from "@storybook/react";
import InputField from "./InputField";

const meta: Meta<typeof InputField> = {
  title: "Components/InputField",
  component: InputField,
  tags: ["autodocs"],
  argTypes: {
    label: { control: "text" },
    placeholder: { control: "text" },
    variant: { control: "radio", options: ["filled", "outlined", "ghost"] },
    size: { control: "radio", options: ["sm", "md", "lg"] },
    disabled: { control: "boolean" },
    invalid: { control: "boolean" },
    loading: { control: "boolean" },
    helperText: { control: "text" },
    errorText: { control: "text" },
  },
};

export default meta;
type Story = StoryObj<typeof InputField>;

export const Filled: Story = {
  args: {
    label: "Name",
    variant: "filled",
    helperText: "Enter your full name",
  },
};

export const Outlined: Story = {
  args: {
    label: "Email",
    variant: "outlined",
    helperText: "We’ll never share your email.",
  },
};

export const Ghost: Story = {
  args: {
    label: "Search",
    variant: "ghost",
    placeholder: "Type here...",
  },
};

export const Disabled: Story = {
  args: {
    label: "Disabled field",
    disabled: true,
    placeholder: "Cannot edit",
  },
};

export const Invalid: Story = {
  args: {
    label: "Password",
    invalid: true,
    errorText: "Password must be at least 8 characters.",
  },
};

export const Loading: Story = {
  args: {
    label: "Username",
    loading: true,
    placeholder: "Checking availability...",
  },
};

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <InputField label="Small" size="sm" />
      <InputField label="Medium" size="md" />
      <InputField label="Large" size="lg" />
    </div>
  ),
};
