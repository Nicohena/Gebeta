import AdminDrinkTable from "@/components/admin/AdminDrinkTable";

export default function AdminDrinksPage() {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-[#1A1A1A]" style={{ fontFamily: "var(--font-playfair)" }}>
          Drinks
        </h2>
        <p className="text-gray-500 text-sm mt-1">Add, edit, and manage all drinks including size variants.</p>
      </div>
      <AdminDrinkTable />
    </div>
  );
}
