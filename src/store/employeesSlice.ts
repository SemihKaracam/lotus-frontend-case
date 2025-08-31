// src/store/employeesSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { Employee } from "../types/schema";
import * as api from "../services/employees";

interface EmployeesState {
  items: Employee[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error?: string;
}

const initialState: EmployeesState = {
  items: [],
  status: "idle",
  error: undefined,
};

// Thunks
export const fetchEmployees = createAsyncThunk("employees/fetch", async () => {
  return await api.getEmployees();
});

export const addEmployee = createAsyncThunk(
  "employees/add",
  async (emp: Omit<Employee, "id">) => {
    return await api.createEmployee(emp);
  }
);

export const updateEmployee = createAsyncThunk(
  "employees/edit",
  async (emp: Employee) => {
    return await api.updateEmployee(emp);
  }
);

export const removeEmployee = createAsyncThunk(
  "employees/remove",
  async (id: string) => {
    return await api.deleteEmployee(id);
  }
);

const employeesSlice = createSlice({
  name: "employees",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchEmployees.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchEmployees.fulfilled, (state, action: PayloadAction<Employee[]>) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchEmployees.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      // Add
      .addCase(addEmployee.fulfilled, (state, action: PayloadAction<Employee>) => {
        state.items.push(action.payload);
      })
      // Edit
      .addCase(updateEmployee.fulfilled, (state, action: PayloadAction<Employee>) => {
        const idx = state.items.findIndex((e) => e.id === action.payload.id);
        if (idx !== -1) state.items[idx] = action.payload;
      })
      // Remove
      .addCase(removeEmployee.fulfilled, (state, action: PayloadAction<string>) => {
        state.items = state.items.filter((e) => e.id !== action.payload);
      });
  },
});

export default employeesSlice.reducer;
