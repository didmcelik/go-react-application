import React, { useEffect } from "react";
import { useState } from "react";
import { useForm } from "@mantine/form";
import { Button, Group, Modal, Textarea, TextInput } from "@mantine/core";
import { ENDPOINT, User } from "../App";
import { KeyedMutator } from "swr";
function UserModal({
  mutate,
  edit,
  del,
  user,
  open,
  setOpen,
}: {
  mutate: KeyedMutator<any>; //  KeyedMutator<User[]>
  edit?: boolean;
  del?: boolean;
  user?: User;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  useEffect(() => {
    if (edit) {
      form.setValues({ email: user?.email, username: user?.username });
      //setOpen(true);
    }
  }, []);

  const form = useForm({
    initialValues: {
      username: "",
      email: "",
    },
  });

  async function createUser(values: { username: string; email: string }) {
    let updated;
    if (edit && !del) {
      updated = await fetch(`${ENDPOINT}/update/${user?.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      }).then((r) => r.json());
      console.log("updated", updated);
    } else if (edit && del) {
      updated = await fetch(`${ENDPOINT}/delete/${user?.id}`, {
        method: "DELETE",
      }).then((r) => r.json());
    } else {
      updated = await fetch(`${ENDPOINT}/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      }).then((r) => r.json());
    }

    mutate("getAll"); // must be updated?
    form.reset();
    setOpen(false);
  }

  return (
    <>
      <Modal
        opened={open}
        onClose={() => {
          setOpen(false);
        }}
        title={
          edit ? (del ? "Delete User" : "Update User Info") : "Create New User"
        }
      >
        <form onSubmit={form.onSubmit(createUser)}>
          <TextInput
            disabled={del}
            required
            mb={12}
            label={"User Name"}
            placeholder={"johnnynelson"}
            {...form.getInputProps("username")}
          ></TextInput>
          <TextInput
            disabled={del}
            required
            mb={12}
            label={"Email"}
            placeholder={"johnnynelson@abc.com"}
            {...form.getInputProps("email")}
          ></TextInput>

          <Button type="submit" size="sm">
            {edit ? (del ? "Delete" : "Save") : "Create"}
          </Button>
          <Button
            ml={1}
            size="sm"
            variant="outline"
            onClick={() => {
              setOpen(false);
            }}
          >
            Back
          </Button>
        </form>
      </Modal>
    </>
  );
}
export default UserModal;
