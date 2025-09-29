import { useCallback } from "react";

interface DailySummaryItem {
    date: string;
    income: number;
    expense: number;
    cost: number;
    net: number;
    cashFlow: number;
}

interface DailySummaryTableProps {
    dailySummaryArray: DailySummaryItem[];
    onClickRow: (date: string) => void;
}

const DailySummaryTable = ({ dailySummaryArray, onClickRow }: DailySummaryTableProps) => {
    const handleClick = useCallback((date: string) => {
        onClickRow(date);
    }, [onClickRow]);

    return (
        <div className="bg-white p-6 rounded-xl shadow-lg">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">📅 สรุปรายวัน</h2>
            <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-indigo-100 text-gray-700">
                            <th className="p-2 border border-black">วันที่</th>
                            <th className="p-2 border border-black">ต้นทุน</th>
                            <th className="p-2 border border-black">รายรับรวม</th>
                            <th className="p-2 border border-black">รายจ่ายรวม</th>
                            <th className="p-2 border border-black">กำไร/ขาดทุน</th>
                            <th className="p-2 border border-black">กระแสเงินสด</th>
                        </tr>
                    </thead>
                    <tbody>
                        {dailySummaryArray.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={6}
                                    className="p-3 text-center text-gray-500 border"
                                >
                                    ไม่มีข้อมูล
                                </td>
                            </tr>
                        ) : (
                            dailySummaryArray.map(d => (
                                <tr
                                    key={d.date}
                                    className="hover:bg-gray-50 transition cursor-pointer"
                                    onClick={() => handleClick(d.date)}
                                >
                                    <td className="p-2 border border-black font-medium">{d.date}</td>
                                    <td className="p-2 border border-black text-blue-500 text-right">{d.cost.toLocaleString()}</td>
                                    <td className="p-2 border border-black text-green-600 text-right">{d.income.toLocaleString()}</td>
                                    <td className="p-2 border border-black text-red-600 text-right">{d.expense.toLocaleString()}</td>
                                    <td className={`p-2 border border-black text-right font-semibold ${d.net >= 0 ? "text-green-700" : "text-red-700"}`}>{d.net.toLocaleString()}</td>
                                    <td className={`p-2 border border-black text-right font-semibold ${d.cashFlow >= 0 ? "text-green-700" : "text-red-700"}`}>{d.cashFlow.toLocaleString()}</td>
                                </tr>
                            ))

                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default DailySummaryTable;
