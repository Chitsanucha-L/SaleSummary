import { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface Transaction {
  id: number;
  date: string;
  type: "income" | "expense";
  category: string;
  amount: number;
  note: string;
}

export default function App() {
  const today = new Date().toISOString().split("T")[0];

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [form, setForm] = useState({
    date: today,
    type: "income",
    category: "",
    amount: "",
    note: "",
  });
  const [editId, setEditId] = useState<number | null>(null);
  const [chartMode, setChartMode] = useState<"day" | "week">("day");

  useEffect(() => {
    const saved = localStorage.getItem("transactions");
    if (saved) setTransactions(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("transactions", JSON.stringify(transactions));
  }, [transactions]);

  const saveTransaction = () => {
    if (!form.date || !form.amount) return;

    if (editId) {
      // แก้ไขรายการ
      setTransactions(transactions.map(t =>
        t.id === editId ? {
          ...t,
          date: form.date,
          type: form.type as "income" | "expense",
          category: form.category,
          amount: Number(form.amount),
          note: form.note,
        } : t
      ));
      setEditId(null);
    } else {
      // เพิ่มรายการใหม่
      const newTransaction: Transaction = {
        id: Date.now(),
        date: form.date,
        type: form.type as "income" | "expense",
        category: form.category,
        amount: Number(form.amount),
        note: form.note,
      };
      setTransactions([...transactions, newTransaction]);
    }

    setForm({ date: today, type: "income", category: "", amount: "", note: "" });
  };

  const deleteTransaction = (id: number) => {
    if (confirm("คุณต้องการลบรายการนี้หรือไม่?")) {
      setTransactions(transactions.filter(t => t.id !== id));
    }
  };

  const editTransaction = (t: Transaction) => {
    setForm({
      date: t.date,
      type: t.type,
      category: t.category,
      amount: t.amount.toString(),
      note: t.note,
    });
    setEditId(t.id);
  };

  const summary = transactions.reduce(
    (acc, t) => {
      if (t.type === "income") acc.income += t.amount;
      else acc.expense += t.amount;
      return acc;
    },
    { income: 0, expense: 0 }
  );

  // ---- ฟังก์ชันหาหมายเลขสัปดาห์ ----
  function getWeek(dateStr: string) {
    const date = new Date(dateStr);
    const onejan = new Date(date.getFullYear(), 0, 1);
    const millisecsInDay = 86400000;
    return (
      date.getFullYear() +
      "-W" +
      Math.ceil(((date.getTime() - onejan.getTime()) / millisecsInDay + onejan.getDay() + 1) / 7)
    );
  }

  // ---- สร้าง chartData ----
  let chartData: { name: string; income: number; expense: number }[] = [];

  if (chartMode === "day") {
    const grouped = transactions.reduce((acc, t) => {
      if (!acc[t.date]) acc[t.date] = { income: 0, expense: 0 };
      acc[t.date][t.type] += t.amount;
      return acc;
    }, {} as Record<string, { income: number; expense: number }>);

    chartData = Object.entries(grouped).map(([date, val]) => ({
      name: date,
      income: val.income,
      expense: val.expense,
    })).sort((a, b) => new Date(b.name).getTime() - new Date(a.name).getTime());
  } else {
    const grouped = transactions.reduce((acc, t) => {
      const week = getWeek(t.date);
      if (!acc[week]) acc[week] = { income: 0, expense: 0 };
      acc[week][t.type] += t.amount;
      return acc;
    }, {} as Record<string, { income: number; expense: number }>);

    chartData = Object.entries(grouped).map(([week, val]) => ({
      name: week,
      income: val.income,
      expense: val.expense,
    }));
  }

  // ---- สรุปรายวัน ----
  const dailySummary = transactions.reduce((acc, t) => {
    if (!acc[t.date]) acc[t.date] = { income: 0, expense: 0 };
    acc[t.date][t.type] += t.amount;
    return acc;
  }, {} as Record<string, { income: number; expense: number }>);

  const dailySummaryArray = Object.entries(dailySummary)
    .map(([date, val]) => ({
      date,
      income: val.income,
      expense: val.expense,
      net: val.income - val.expense,
    }))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()); // ใหม่สุด → เก่าสุด

  // ---- จัดกลุ่ม transactions สำหรับตาราง ----
  const groupedByDate = transactions.reduce((acc, t) => {
    if (!acc[t.date]) acc[t.date] = [];
    acc[t.date].push(t);
    return acc;
  }, {} as Record<string, Transaction[]>);

  const sortedDates = Object.keys(groupedByDate).sort(
    (a, b) => new Date(b).getTime() - new Date(a).getTime() // ใหม่สุด → เก่าสุด
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-blue-600 text-white py-4 shadow-md">
        <h1 className="text-center text-2xl font-bold">🍜 ระบบติดตามรายรับ–รายจ่าย ร้านอาหาร</h1>
      </header>

      <main className="p-6 max-w-5xl mx-auto space-y-8">
        {/* ฟอร์มบันทึก */}
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">➕ เพิ่มรายการ</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <input
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              className="border border-gray-500 shadow-sm p-2 rounded-lg focus:ring-2 focus:ring-blue-400"
            />
            <select
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
              className="border border-gray-500 shadow-sm p-2 rounded-lg focus:ring-2 focus:ring-blue-400"
            >
              <option value="income">รายรับ</option>
              <option value="expense">รายจ่าย</option>
            </select>
            <input
              type="text"
              placeholder="หมวดหมู่"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="border border-gray-500 shadow-sm p-2 rounded-lg focus:ring-2 focus:ring-blue-400"
            />
            <input
              type="number"
              placeholder="จำนวนเงิน"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
              className="border border-gray-500 shadow-sm p-2 rounded-lg focus:ring-2 focus:ring-blue-400"
            />
            <input
              type="text"
              placeholder="หมายเหตุ"
              value={form.note}
              onChange={(e) => setForm({ ...form, note: e.target.value })}
              className="border border-gray-500 shadow-sm p-2 rounded-lg focus:ring-2 focus:ring-blue-400 col-span-2"
            />
          </div>
          <button
            onClick={saveTransaction}
            className="mt-4 bg-blue-600 shadow-md hover:bg-blue-700 text-white px-6 py-2 rounded-lg shadow"
          >
            {editId ? "บันทึกการแก้ไข" : "บันทึก"}
          </button>
        </div>

        {/* ตารางรายการ */}
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">📅 รายการ</h2>
          <div className="overflow-x-auto">
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
                {sortedDates.map((date) => (
                  <>
                    <tr key={date} className="bg-gray-100">
                      <td colSpan={6} className="p-2 font-semibold text-gray-700">
                        📅 {date}
                      </td>
                    </tr>
                    {groupedByDate[date].map((t) => (
                      <tr key={t.id} className="hover:bg-gray-50 transition">
                        <td className="p-2 border">{t.date}</td>
                        <td className={`p-2 border font-medium ${t.type === "income" ? "text-green-600" : "text-red-600"}`}>
                          {t.type === "income" ? "รายรับ" : "รายจ่าย"}
                        </td>
                        <td className="p-2 border">{t.category}</td>
                        <td className="p-2 border text-right">{t.amount.toLocaleString()}</td>
                        <td className="p-2 border">{t.note}</td>
                        <td className="p-2 border space-x-2 w-30">
                          <button
                            onClick={() => editTransaction(t)}
                            className="px-2 py-1 bg-yellow-400 text-white rounded hover:bg-yellow-500"
                          >
                            แก้ไข
                          </button>
                          <button
                            onClick={() => deleteTransaction(t.id)}
                            className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                          >
                            ลบ
                          </button>
                        </td>
                      </tr>
                    ))}
                  </>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ตารางสรุปรายวัน */}
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">📅 สรุปรายวัน</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-indigo-100 text-gray-700">
                  <th className="p-2 border">วันที่</th>
                  <th className="p-2 border">รายรับรวม</th>
                  <th className="p-2 border">รายจ่ายรวม</th>
                  <th className="p-2 border">กำไร/ขาดทุน</th>
                </tr>
              </thead>
              <tbody>
                {dailySummaryArray.map((d) => (
                  <tr key={d.date} className="hover:bg-gray-50 transition">
                    <td className="p-2 border font-medium">{d.date}</td>
                    <td className="p-2 border border-black text-green-600 text-right">{d.income.toLocaleString()}</td>
                    <td className="p-2 border border-black text-red-600 text-right">{d.expense.toLocaleString()}</td>
                    <td className={`p-2 border border-black text-right font-semibold ${d.net >= 0 ? "text-green-700" : "text-red-700"}`}>
                      {d.net.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* สรุปรวม */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-green-100 p-6 rounded-xl shadow text-center">
            <h3 className="text-lg font-semibold text-green-700">💰 รายรับรวม</h3>
            <p className="text-2xl font-bold text-green-800">{summary.income.toLocaleString()} บาท</p>
          </div>
          <div className="bg-red-100 p-6 rounded-xl shadow text-center">
            <h3 className="text-lg font-semibold text-red-700">💸 รายจ่ายรวม</h3>
            <p className="text-2xl font-bold text-red-800">{summary.expense.toLocaleString()} บาท</p>
          </div>
          <div className="bg-indigo-100 p-6 rounded-xl shadow text-center">
            <h3 className="text-lg font-semibold text-indigo-700">📊 กำไร/ขาดทุนสุทธิ</h3>
            <p className="text-2xl font-bold text-indigo-800">{(summary.income - summary.expense).toLocaleString()} บาท</p>
          </div>
        </div>

        {/* กราฟ */}
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-700">📈 กราฟรายรับ–รายจ่าย</h2>
            <div className="space-x-2">
              <button
                onClick={() => setChartMode("day")}
                className={`px-3 py-1 rounded ${chartMode === "day" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
              >
                รายวัน
              </button>
              {/* <button
                onClick={() => setChartMode("week")}
                className={`px-3 py-1 rounded ${chartMode === "week" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
              >
                รายสัปดาห์
              </button> */}
            </div>
          </div>

          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="income" fill="#22c55e" name="รายรับ" />
                <Bar dataKey="expense" fill="#ef4444" name="รายจ่าย" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </main>
    </div>
  );
}
