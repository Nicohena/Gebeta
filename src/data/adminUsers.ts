import type { StoredAdminUser } from "@/types/admin";

export const ADMIN_USERS: StoredAdminUser[] = [
  {
    email: "admin@panda.com",
    password: "panda2024",
    role: "superadmin",
    name: "Head Admin",
  },
  {
    email: "manager@panda.com",
    password: "manager123",
    role: "manager",
    name: "Floor Manager",
  },
];
