import { useState, useEffect, useCallback, useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import TransactionForm from "./components/TransactionForm";
import EditTransactionModal from "./Modal/EditTransactionModal";
import DailySummaryTable from "./components/DailySummaryTable";
import DailySummaryModal from "./Modal/DailySummaryModal";
import { DatePicker } from "./components/DatePicker";

export interface Transaction {
  _id: string;
  date: string;
  type: "income" | "expense" | "cost";
  category: string;
  amount: number;
  note: string;
}

export default function App() {
  const today = new Date().toISOString().split("T")[0];

  // -------------------- State --------------------
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [formIncome, setFormIncome] = useState({
    date: today,
    type: "income",
    data: [{ category: "", amount: "", note: "" }]
  });
  const [formExpense, setFormExpense] = useState({
    date: today,
    type: "expense",
    data: [{ category: "", amount: "", note: "" }]
  });
  const [formCost, setFormCost] = useState({
    date: today,
    type: "cost",
    data: [{ category: "", amount: "", note: "" }]
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isGetData, setIsGetData] = useState(false);
  const [chartMode, setChartMode] = useState<"day" | "week" | "month">("day");
  const [salesChartMode, setSalesChartMode] = useState<"day" | "month" | "all">("day");

  const [dailyModalOpen, setDailyModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const selectedDateTransactions = useMemo(() => {
    return transactions.filter(t => t.date === selectedDate);
  }, [transactions, selectedDate]);


  // -------------------- Fetch Transactions --------------------
  useEffect(() => {
    const fetchTransactions = async () => {
      setIsGetData(false);
      try {
        const res = await fetch("https://backend-sale-summary.vercel.app/api/transactions");
        const data = await res.json();
        setTransactions(data);
      } catch (err) {
        console.error(err);
      }
      setIsGetData(true);
    };
    fetchTransactions();
  }, []);

  // -------------------- Handler useCallback --------------------
  const updateIncomeItem = useCallback(
    (index: number, key: "category" | "amount" | "note", value: string) => {
      setFormIncome(prev => {
        const newData = prev.data.map((item, i) =>
          i === index ? { ...item, [key]: value } : item
        );
        return { ...prev, data: newData };
      });
    },
    [setFormIncome]
  );

  const updateExpenseItem = useCallback((index: number, key: "category" | "amount" | "note", value: string) => {
    setFormExpense(prev => {
      const newData = prev.data.map((item, i) => i === index ? { ...item, [key]: value } : item);
      return { ...prev, data: newData };
    });
  }, [setFormExpense]);

  const updateCostItem = useCallback((index: number, key: "category" | "amount" | "note", value: string) => {
    setFormCost(prev => {
      const newData = prev.data.map((item, i) => i === index ? { ...item, [key]: value } : item);
      return { ...prev, data: newData };
    });
  }, [setFormCost]);

  const addIncomeItem = useCallback(() => setFormIncome(prev => ({
    ...prev,
    data: [...prev.data, { category: "", amount: "", note: "" }]
  })), []);

  const addExpenseItem = useCallback(() => setFormExpense(prev => ({
    ...prev,
    data: [...prev.data, { category: "", amount: "", note: "" }]
  })), []);

  const addCostItem = useCallback(() => setFormCost(prev => ({
    ...prev,
    data: [...prev.data, { category: "", amount: "", note: "" }]
  })), []);

  const removeIncomeItem = useCallback((index: number) => setFormIncome(prev => ({
    ...prev,
    data: prev.data.filter((_, i) => i !== index)
  })), []);

  const removeExpenseItem = useCallback((index: number) => setFormExpense(prev => ({
    ...prev,
    data: prev.data.filter((_, i) => i !== index)
  })), []);

  const removeCostItem = useCallback((index: number) => setFormCost(prev => ({
    ...prev,
    data: prev.data.filter((_, i) => i !== index)
  })), []);

  // -------------------- Save Transaction --------------------
  const saveTransaction = useCallback(async () => {
    const newTransactions = [
      ...formIncome.data.filter(i => i.category && i.amount).map(i => ({
        date: formIncome.date,
        type: "income",
        category: i.category,
        amount: Number(i.amount),
        note: i.note
      })),
      ...formExpense.data.filter(i => i.category && i.amount).map(i => ({
        date: formExpense.date,
        type: "expense",
        category: i.category,
        amount: Number(i.amount),
        note: i.note
      })),
      ...formCost.data.filter(i => i.category && i.amount).map(i => ({
        date: formCost.date,
        type: "cost",
        category: i.category,
        amount: Number(i.amount),
        note: i.note
      }))
    ];

    if (!newTransactions.length) return alert("กรุณากรอกข้อมูลให้ครบ");

    setIsSaving(true);
    try {
      const saved = await Promise.all(newTransactions.map(async t => {
        const res = await fetch("https://backend-sale-summary.vercel.app/api/transactions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(t)
        });
        return res.json();
      }));
      setTransactions(prev => [...prev, ...saved]);
      setFormIncome({ date: today, type: "income", data: [{ category: "", amount: "", note: "" }] });
      setFormExpense({ date: today, type: "expense", data: [{ category: "", amount: "", note: "" }] });
      setFormCost({ date: today, type: "cost", data: [{ category: "", amount: "", note: "" }] });
    } catch (err) {
      console.error(err);
      alert("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
    } finally {
      setIsSaving(false);
    }
  }, [formIncome, formExpense, formCost, today]);

  // -------------------- Chart Data --------------------
  const chartData = useMemo(() => {
    const grouped: Record<string, { income: number; expense: number; cost: number }> = {};
    transactions.forEach(t => {
      const key = chartMode === "day" ? t.date : getWeek(t.date);
      if (!grouped[key]) grouped[key] = { income: 0, expense: 0, cost: 0 };
      grouped[key][t.type] += t.amount;
    });
    return Object.entries(grouped)
      .map(([name, val]) => ({ name, ...val }))
      .sort((a, b) => new Date(a.name).getTime() - new Date(b.name).getTime());
  }, [transactions, chartMode]);

  // -------------------- Summary --------------------
  const summary = useMemo(() => {
    return transactions.reduce((acc, t) => {
      if (t.type === "income") acc.income += t.amount;
      else if (t.type === "expense") acc.expense += t.amount;
      return acc;
    }, { income: 0, expense: 0 });
  }, [transactions]);

  const totalCost = useMemo(() => transactions.filter(t => t.type === "cost").reduce((sum, t) => sum + t.amount, 0), [transactions]);

  // Summary ตามวัน 
  const dailySummary = transactions.reduce((acc, t) => {
    if (!acc[t.date]) {
      acc[t.date] = { income: 0, expense: 0, cost: 0 };
    }
    if (t.type === "income") acc[t.date].income += t.amount;
    if (t.type === "expense") acc[t.date].expense += t.amount;
    if (t.type === "cost") acc[t.date].cost += t.amount;
    return acc;
  },
    {} as Record<string, { income: number; expense: number; cost: number }>);

  const dailySummaryArray = useMemo(() => {
    const sortedDates = Object.keys(dailySummary).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
    let cumulativeCashFlow = 0;

    return sortedDates.map(date => {
      const { income, expense, cost } = dailySummary[date];
      const net = income - expense;
      cumulativeCashFlow += income + cost - expense; // กระแสเงินสดสะสม
      return {
        date,
        income,
        expense,
        cost,
        net,
        cashFlow: cumulativeCashFlow
      };
    });
  }, [dailySummary]);


  // -------------------- Utilities --------------------
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

  // -------------------- Handlers --------------------
  const handleDateChange = useCallback((newDate: string) => {
    setFormIncome(prev => ({ ...prev, date: newDate }));
    setFormExpense(prev => ({ ...prev, date: newDate }));
    setFormCost(prev => ({ ...prev, date: newDate }));
  }, []);

  const handleDeleteTransaction = useCallback(async (id: string) => {
    if (!confirm("คุณต้องการลบรายการนี้หรือไม่?")) return;
    setIsSaving(true);
    try {
      await fetch(`https://backend-sale-summary.vercel.app/api/transactions/${id}`, { method: "DELETE" });
      setTransactions(prev => prev.filter(t => t._id !== id));
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  }, []);

  const handleClickDailyRow = useCallback((date: string) => {
    setSelectedDate(date);
    setDailyModalOpen(true);
  }, []);

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editTransactionItem, setEditTransactionItem] = useState<Transaction | null>(null);
  const editTransaction = (t: Transaction) => {
    setEditTransactionItem(t);
    setEditModalOpen(true);
  };

  const saveEditedTransaction = async (updated: Transaction) => {
    try {
      const res = await fetch(` 
        https://backend-sale-summary.vercel.app/api/transactions/${updated._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updated),
        }
      );
      const saved = await res.json();
      setTransactions(transactions.map(t => t._id === saved._id ? saved : t));
      return saved; // เพิ่ม return 
    } catch (err) {
      console.error(err); throw err; // ให้ reject 
    }
  };

  // -------------------- Chart Data per Channel --------------------
  const salesChannelChartData = useMemo(() => {
    // 1. จัดกลุ่มข้อมูลตาม salesChartMode
    const grouped: Record<string, Record<string, number>> = {};

    transactions.forEach(t => {
      if (t.type !== "income") return; // สนใจเฉพาะรายรับ

      let key = t.date;

      if (salesChartMode === "month") {
        const d = new Date(t.date);
        key = `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, "0")}`;
      } else if (salesChartMode === "all") {
        key = "ทั้งหมด";
      }

      if (!grouped[key]) {
        grouped[key] = { Grab: 0, Lineman: 0, ShopeeFood: 0, Robinhood: 0, "หน้าร้าน": 0, "อื่นๆ": 0 };
      }

      grouped[key][t.category] = (grouped[key][t.category] || 0) + t.amount;
    });

    // 2. แปลงเป็น array สำหรับ BarChart
    return Object.entries(grouped)
      .map(([name, values]) => ({ name, ...values }))
      .sort((a, b) => new Date(a.name).getTime() - new Date(b.name).getTime());
  }, [transactions, salesChartMode]);

  // -------------------- Render --------------------
  return (
    <div className="font-display min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <header className="bg-blue-600 text-white py-4 shadow-md">
        <h1 className="text-center text-2xl font-bold">🍜 ระบบติดตามรายรับ–รายจ่าย ร้านอาหาร</h1>
      </header>

      <main className="grid grid-cols-2 lg:grid-cols-3 gap-0 lg:gap-6 p-4 md:p-6 max-w-[96rem] mx-auto space-y-8 pb-16">
        {/* ฟอร์มบันทึก */}
        <div className="col-span-2 lg:col-span-1 bg-white p-6 rounded-xl shadow-lg">
          <div className="grid grid-cols-2 gap-2 items-center">
            <DatePicker date={formIncome.date} onChange={handleDateChange} />
          </div>

          <TransactionForm
            type="income"
            data={formIncome.data}
            onAdd={addIncomeItem}
            onRemove={removeIncomeItem}
            onUpdate={updateIncomeItem}
          />

          <TransactionForm
            type="expense"
            data={formExpense.data}
            onAdd={addExpenseItem}
            onRemove={removeExpenseItem}
            onUpdate={updateExpenseItem}
          />

          <TransactionForm
            type="cost"
            data={formCost.data}
            onAdd={addCostItem}
            onRemove={removeCostItem}
            onUpdate={updateCostItem}
          />

          <button
            onClick={saveTransaction}
            disabled={isSaving || !isGetData}
            className={`mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 ${(isSaving || !isGetData) ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {isSaving ?
              <div className="flex space-x-2">
                <svg className="mt-[2px] mr-3 -ml-1 size-5 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                กำลังบันทึก...
              </div>
              :
              "บันทึกข้อมูล"}
          </button>
        </div>

        {/* ตารางสรุปรายวัน */}
        <div className="col-span-2">
          <DailySummaryTable
            dailySummaryArray={dailySummaryArray}
            onClickRow={handleClickDailyRow}
          />
        </div>


        {/* สรุปรวม */}
        <div className="col-span-2 lg:col-span-3 grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5  gap-6">
          <div className="bg-blue-100 p-6 rounded-xl shadow text-center">
            <h3 className="text-lg font-semibold text-blue-700">🏷️ ต้นทุน</h3>
            <p className="text-2xl font-bold text-blue-800">{totalCost.toLocaleString()} บาท</p>
          </div>
          <div className="bg-green-100 p-6 rounded-xl shadow text-center">
            <h3 className="text-lg font-semibold text-green-700">💰 รายรับรวม</h3>
            <p className="text-2xl font-bold text-green-800">{summary.income.toLocaleString()} บาท</p>
          </div> <div className="bg-red-100 p-6 rounded-xl shadow text-center">
            <h3 className="text-lg font-semibold text-red-700">💸 รายจ่ายรวม</h3>
            <p className="text-2xl font-bold text-red-800">{summary.expense.toLocaleString()} บาท</p>
          </div>
          <div className="w-full bg-yellow-100 p-6 rounded-xl shadow text-center">
            <h3 className="text-lg font-semibold text-yellow-700">📊 กำไรสุทธิ</h3>
            <p className="text-2xl font-bold text-yellow-800">{(summary.income - summary.expense).toLocaleString()} บาท</p>
          </div> <div className="w-full bg-orange-100 p-6 rounded-xl shadow text-center">
            <h3 className="text-lg font-semibold text-orange-700">📊 กระแสเงินสด</h3>
            <p className="text-2xl font-bold text-orange-800">{(summary.income + totalCost - summary.expense).toLocaleString()} บาท</p>
          </div>
        </div>

        {/* Chart */}
        <div className="col-span-3 xl:col-span-1 bg-white p-6 rounded-xl shadow-lg mb-5 xl:mb-0">
          <div className="flex justify-between mb-4">
            <h2 className="text-xl font-bold">📊 สรุปกราฟรายรับ–รายจ่าย</h2>
            <select
              value={chartMode}
              onChange={(e) => setChartMode(e.target.value as "day" | "week")}
              className="border border-gray-400 rounded p-1"
            >
              <option value="day">รายวัน</option>
              {/* <option value="week">รายสัปดาห์</option> */}
            </select>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="cost" fill="#3b82f6" name="ต้นทุน" />
              <Bar dataKey="income" fill="#22c55e" name="รายรับ" />
              <Bar dataKey="expense" fill="#ef4444" name="รายจ่าย" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="col-span-3 xl:col-span-2 bg-white p-6 rounded-xl shadow-lg">
          <div className="flex justify-between mb-4">
            <h2 className="text-xl font-bold">📊 ยอดขายแต่ละช่องทาง</h2>
            <select
              value={salesChartMode}
              onChange={(e) => setSalesChartMode(e.target.value as "day" | "month" | "all")}
              className="border border-gray-400 rounded p-1"
            >
              <option value="day">รายวัน</option>
              <option value="month">รายเดือน</option>
              <option value="all">ทั้งหมด</option>
            </select>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={salesChannelChartData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="Grab" fill="#1cb454ff" />
              <Bar dataKey="Lineman" fill="#3b82f6" />
              <Bar dataKey="ShopeeFood" fill="#f97316" />
              <Bar dataKey="Robinhood" fill="#8054e7ff" />
              <Bar dataKey="หน้าร้าน" fill="#facc15" />
              <Bar dataKey="อื่นๆ" fill="#6b7280" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </main>

      <EditTransactionModal
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        transaction={editTransactionItem}
        onSave={saveEditedTransaction}
      />

      <DailySummaryModal
        key={selectedDate + transactions.length} // รีเฟรช modal ถ้าข้อมูลเปลี่ยน
        open={dailyModalOpen}
        date={selectedDate}
        transactions={selectedDateTransactions}
        onClose={() => setDailyModalOpen(false)}
        onEdit={editTransaction}
        onDelete={handleDeleteTransaction}
      />
    </div >
  );
}
