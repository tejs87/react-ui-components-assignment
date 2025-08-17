import type { Meta, StoryObj } from "@storybook/react";
import DataTable, { Column } from "./DataTable";

type Person = {
  id: string;
  name: string;
  email: string;
  age: number;
  joined: string; // ISO date
};

const sampleData: Person[] = [
  { id: "1", name: "Aarav",  email: "aarav@example.com",  age: 24, joined: "2024-09-12" },
  { id: "2", name: "Bhavna", email: "bhavna@example.com", age: 31, joined: "2023-03-05" },
  { id: "3", name: "Chirag", email: "chirag@example.com", age: 28, joined: "2025-01-18" },
  { id: "4", name: "Divya",  email: "divya@example.com",  age: 22, joined: "2022-06-20" },
];

const columns: Column<Person>[] = [
  { key: "name", header: "Name", sortable: true },
  { key: "email", header: "Email" },
  { key: "age", header: "Age", sortable: true, width: "w-16" },
  {
    key: "joined",
    header: "Joined",
    sortable: true,
    render: (row) => new Date(row.joined).toLocaleDateString(),
  },
];

const meta: Meta<typeof DataTable<Person>> = {
  title: "Components/DataTable",
  component: DataTable<Person>,
  tags: ["autodocs"],
  argTypes: {
    loading: { control: "boolean" },
    selectable: { control: "boolean" },
  },
};
export default meta;

type Story = StoryObj<typeof DataTable<Person>>;

export const Default: Story = {
  render: (args) => (
    <div className="p-4">
      <DataTable<Person>
        {...args}
        columns={columns}
        data={sampleData}
        rowKey={(r) => r.id}
      />
    </div>
  ),
};

export const Selectable: Story = {
  render: (args) => (
    <div className="p-4">
      <DataTable<Person>
        {...args}
        selectable
        columns={columns}
        data={sampleData}
        rowKey={(r) => r.id}
      />
    </div>
  ),
};

export const Loading: Story = {
  render: (args) => (
    <div className="p-4">
      <DataTable<Person>
        {...args}
        loading
        columns={columns}
        data={[]}
        rowKey={(r) => r.id}
      />
    </div>
  ),
};

export const Empty: Story = {
  render: (args) => (
    <div className="p-4">
      <DataTable<Person>
        {...args}
        columns={columns}
        data={[]}
        rowKey={(r) => r.id}
        emptyMessage="Nothing to show"
      />
    </div>
  ),
};
