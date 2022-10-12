import { useState } from "react";
import reactLogo from "./assets/react.svg";
import "./App.css";
import { Box, Button, Group, Modal } from "@mantine/core";
import useSWR from "swr";
import UserModal from "./components/UserModal";
import { DataGrid, GridColDef, GridValueGetterParams } from "@mui/x-data-grid";
import { Stack } from "@mui/material";
export interface User {
  id: number;
  email: string;
  username: string;
}
export const ENDPOINT = "http://localhost:4000";

const fetcher = (url: string) =>
  fetch(`${ENDPOINT}/${url}`).then((r) => r.json());

function App() {
  const { data, mutate } = useSWR<User[]>("getAll", fetcher);
  const [open, setOpen] = useState(false);

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 90 },
    {
      field: "username",
      headerName: "User name",
      width: 150,
      editable: true,
    },
    {
      field: "email",
      headerName: "E-mail",
      width: 250,
      editable: true,
    },
    {
      field: "action",
      headerName: "Actions",
      sortable: false,
      width: 200,
      renderCell: (params) => {
        const [editModal, setEditModal] = useState(false);
        const [deleteModal, setDeleteModal] = useState(false);

        return (
          <>
            <Stack
              direction="row"
              justifyContent={"center"}
              alignItems="center"
            >
              <Button
                onClick={() => {
                  setEditModal(true);
                }}
              >
                Edit
              </Button>
              <Button
                variant="outline"
                ml={2}
                onClick={() => {
                  setDeleteModal(true);
                }}
              >
                Delete
              </Button>
            </Stack>
            {editModal && (
              <UserModal
                mutate={mutate}
                user={params?.row as User}
                open={true}
                edit={true}
                setOpen={setEditModal}
              ></UserModal>
            )}

            {deleteModal && (
              <UserModal
                mutate={mutate}
                user={params?.row as User}
                open={true}
                edit={true}
                del={deleteModal}
                setOpen={setDeleteModal}
              ></UserModal>
            )}
          </>
        );
      },
    },
  ];
  return (
    <Box>
      {!!data && (
        <Box sx={{ height: 400, width: 800, backgroundColor: "white" }}>
          <DataGrid
            rows={data as User[]}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5]}
            checkboxSelection
            disableSelectionOnClick
            experimentalFeatures={{ newEditingApi: true }}
          />
        </Box>
      )}
      {/* <UserModal mutate={mutate}></UserModal> */}

      <Group position="center">
        <Button
          fullWidth
          onClick={() => {
            setOpen(true);
          }}
        >
          ADD USER
        </Button>
      </Group>

      {open && (
        <UserModal
          mutate={mutate}
          open={true}
          edit={false}
          setOpen={setOpen}
        ></UserModal>
      )}
    </Box>
  );
}

export default App;
