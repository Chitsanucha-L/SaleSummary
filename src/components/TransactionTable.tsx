import React from "react";

interface Transaction {
  _id: string;
  date: string;
  type: "income" | "expense" | "cost";
  category: string;
  amount: number;
  note: string;
}

interface TransactionTableProps {
  transactions: Transaction[];
  onEdit: (t: Transaction) => void;
  onDelete: (id: string) => void;
  isSaving: boolean;
}

const TransactionTable = React.memo(({ transactions, onEdit, onDelete, isSaving }: TransactionTableProps) => {
  const groupedByDate = React.useMemo(() => {
    return transactions.reduce((acc, t) => {
      if (!acc[t.date]) acc[t.date] = [];
      acc[t.date].push(t);
      return acc;
    }, {} as Record<string, Transaction[]>);
  }, [transactions]);

  const sortedDates = React.useMemo(() => Object.keys(groupedByDate).sort(
    (a, b) => new Date(a).getTime() - new Date(b).getTime()
  ), [groupedByDate]);

  return (
    <div className="overflow-x-auto bg-white p-6 rounded-xl shadow-lg">
      <h2 className="text-xl font-semibold mb-4 text-gray-700">📅 รายการ</h2>
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-blue-100 text-gray-700">
            <th className="p-2 border">วันที่</th>
            <th className="p-2 border">ประเภท</th>
            <th className="p-2 border">หมวดหมู่</th>
            <th className="p-2 border">จำนวนเงิน</th>
            <th className="p-2 border">หมายเหตุ</th>
            <th className="p-2 border">จัดการ</th>
          </tr>
        </thead>
        <tbody>
          {sortedDates.map(date => (
            <React.Fragment key={date}>
              <tr className="bg-gray-100">
                <td colSpan={6} className="p-2 font-semibold text-gray-700">📅 {date}</td>
              </tr>
              {groupedByDate[date].map(t => (
                <tr key={t._id} className="bg-white transition">
                  <td className="p-2 border">{t.date}</td>
                  <td className={`p-2 border border-black font-medium ${t.type === "income" ? "text-green-600" : t.type === "cost" ? "text-blue-700" : "text-red-600"}`}>
                    {t.type === "income" ? "รายรับ" : t.type === "cost" ? "ต้นทุน" : "รายจ่าย"}
                  </td>
                  <td className="p-2 border">{t.category}</td>
                  <td className="p-2 border text-right">{t.amount.toLocaleString()}</td>
                  <td className="p-2 border">{t.note}</td>
                  <td className="p-2 border space-x-2 w-28">
                    <div className="flex justify-between items-center">
                      <button onClick={() => onEdit(t)} disabled={isSaving} className={`px-2 py-1 bg-yellow-400 text-white rounded hover:bg-yellow-500 ${isSaving ? "opacity-50 cursor-not-allowed" : ""}`}>แก้ไข</button>
                      <button onClick={() => onDelete(t._id)} disabled={isSaving} className={`px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 ${isSaving ? "opacity-50 cursor-not-allowed" : ""}`}>ลบ</button>
                    </div>
                  </td>
                </tr>
              ))}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
});

export default TransactionTable;
