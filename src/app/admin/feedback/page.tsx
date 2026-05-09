import { getFeedback, markAllFeedbackAsRead, createClient } from "@/lib/supabase-server";
import Image from "next/image";

export const dynamic = "force-dynamic";

export default async function AdminFeedbackPage() {
  const feedbacks = await getFeedback();
  
  // Mark all as read when visited
  const hasUnread = feedbacks.some(f => !f.is_read);
  if (hasUnread) {
    await markAllFeedbackAsRead();
  }

  // Fetch items to map names
  const supabase = await createClient();
  const [{ data: menuItems }, { data: drinkItems }] = await Promise.all([
    supabase.from("menu_items").select("id, name, image"),
    supabase.from("drink_items").select("id, name, image")
  ]);

  const itemMap = new Map();
  [...(menuItems || []), ...(drinkItems || [])].forEach(item => {
    itemMap.set(item.id, {
      name: item.name.en || item.name,
      image: item.image
    });
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Customer Feedback</h1>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 border-b border-gray-200 text-xs uppercase text-gray-500 font-semibold">
              <tr>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Item</th>
                <th className="px-6 py-4">Rating</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Comment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {feedbacks.map((fb) => {
                const itemInfo = itemMap.get(fb.item_id);
                const isNew = !fb.is_read;
                
                return (
                <tr key={fb.id} className={`hover:bg-gray-50/50 transition-colors ${isNew ? 'bg-amber-50/30' : ''}`}>
                  <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                    {new Date(fb.created_at).toLocaleDateString()} {new Date(fb.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    {isNew && <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-red-100 text-red-800">NEW</span>}
                  </td>
                  <td className="px-6 py-4">
                    {itemInfo ? (
                      <div className="flex items-center gap-3">
                        <div className="relative w-10 h-10 rounded-lg overflow-hidden shrink-0 border border-gray-100">
                          <Image src={itemInfo.image} alt={itemInfo.name} fill className="object-cover" sizes="40px" />
                        </div>
                        <span className="font-semibold text-gray-900">{itemInfo.name}</span>
                      </div>
                    ) : (
                      <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded text-gray-600">
                        {fb.item_id}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex text-amber-400 text-lg">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <span key={i} className={i < fb.rating ? "" : "text-gray-300"}>★</span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-700">
                    {fb.customer_name || <span className="text-gray-400 italic">Anonymous</span>}
                  </td>
                  <td className="px-6 py-4 text-gray-600 max-w-xs truncate" title={fb.comment}>
                    {fb.comment || <span className="text-gray-400 italic">No comment</span>}
                  </td>
                </tr>
                );
              })}
              {feedbacks.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center justify-center">
                      <svg className="w-12 h-12 mb-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                      <p className="text-lg font-medium text-gray-900">No feedback yet</p>
                      <p className="text-sm mt-1">When customers submit feedback, it will appear here.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
