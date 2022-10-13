import { useEffect, useState } from "react";
import "./App.css";
import { Button, Grid, Text } from "@mantine/core";
import useSWR from "swr";
import UserModal from "./components/UserModal";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
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
  const { data, mutate, error } = useSWR<any>("getAll", fetcher);
  const [open, setOpen] = useState(false);

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 250 },
    {
      field: "username",
      headerName: "User name",
      width: 150,
      editable: true,
    },
    {
      field: "email",
      headerName: "E-mail",
      width: 200,
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
                variant="light"
              >
                Edit
              </Button>
              <Button
                variant="subtle"
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
    <Grid
      sx={{
        height: 500,
        width: 900,
        backgroundColor: "white",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Grid
        sx={{
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        <Text
          color="gray"
          component="span"
          align="center"
          variant="gradient"
          weight={900}
          gradient={{ from: "indigo", to: "cyan", deg: 45 }}
          style={{
            fontFamily: "Greycliff CF, sans-serif",
            marginLeft: 15,
          }}
        >
          USERS
        </Text>
        <Button
          onClick={() => {
            setOpen(true);
          }}
          size="sm"
          style={{ marginRight: 5 }}
          variant="gradient"
        >
          NEW
        </Button>
      </Grid>

      <Grid
        sx={{
          height: 400,
          width: 900,
          backgroundColor: "white",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <DataGrid
          sx={{ p: 1 }}
          checkboxSelection={false}
          rows={data?.data?.data || []}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
          disableSelectionOnClick
          experimentalFeatures={{ newEditingApi: true }}
        />
      </Grid>

      {open && (
        <UserModal
          mutate={mutate}
          open={true}
          edit={false}
          setOpen={setOpen}
        ></UserModal>
      )}
    </Grid>
  );
}

export default App;
