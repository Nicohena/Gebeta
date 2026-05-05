import AdminPriceEditor from "@/components/admin/AdminPriceEditor";

export default function AdminPricingPage() {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-[#1A1A1A]" style={{ fontFamily: "var(--font-playfair)" }}>
          Pricing Editor
        </h2>
        <p className="text-gray-500 text-sm mt-1">Bulk adjust prices by category or edit individual items.</p>
      </div>
      <AdminPriceEditor />
    </div>
  );
}
