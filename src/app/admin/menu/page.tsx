import AdminMenuTable from "@/components/admin/AdminMenuTable";

export default function AdminMenuPage() {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-[#1A1A1A]" style={{ fontFamily: "var(--font-playfair)" }}>
          Menu Items Manager
        </h2>
        <p className="text-gray-500 text-sm mt-1">Add, edit, and manage all food items on the public menu.</p>
      </div>
      <AdminMenuTable />
    </div>
  );
}
