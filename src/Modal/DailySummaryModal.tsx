import { FilePenLine, Trash2 } from "lucide-react";
import type { Transaction } from "../App"; // หรือ import interface จากไฟล์หลัก

interface DailySummaryModalProps {
    open: boolean;
    date: string;
    transactions: Transaction[];
    onClose: () => void;
    onEdit: (t: Transaction) => void;
    onDelete: (id: string) => void;
}

const DailySummaryModal = ({ open, date, transactions, onClose, onEdit, onDelete }: DailySummaryModalProps) => {
    if (!open) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-full max-w-2xl shadow-lg overflow-y-auto max-h-[80vh]">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">รายการธุรกรรมวันที่ {date}</h2>
                    <button onClick={onClose} className="text-white font-bold py-1.5 px-2.5 bg-red-500 rounded-lg shadow-md">ปิด</button>
                </div>
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="p-2 border">ประเภท</th>
                            <th className="p-2 border">หมวดหมู่</th>
                            <th className="p-2 border">จำนวนเงิน</th>
                            <th className="p-2 border">หมายเหตุ</th>
                            <th className="p-2 border w-26">จัดการ</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactions.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={5}
                                    className="p-3 text-center text-gray-500 border"
                                >
                                    ไม่มีข้อมูล
                                </td>
                            </tr>
                        ) : (
                            transactions.map(t => (
                                <tr key={t._id} className="hover:bg-gray-50">
                                    <td className={`p-2 border border-black font-medium text-center ${t.type === "income" ? "text-green-700" : t.type === "expense" ? "text-red-700" : "text-blue-700"}`}>
                                        {t.type === "income" ? "รายรับ" : t.type === "expense" ? "รายจ่าย" : "ต้นทุน"}
                                    </td>
                                    <td className="p-2 border text-center">{t.category}</td>
                                    <td className="p-2 border">{t.amount.toLocaleString()}</td>
                                    <td className="p-2 border">{t.note}</td>
                                    <td className="p-2 border space-x-3">
                                        <button onClick={() => onEdit(t)} className="text-white text-[15px] py-[5px] px-2 bg-blue-500 rounded-md"><FilePenLine size={21} /></button>
                                        <button onClick={() => onDelete(t._id)} className="text-white text-[15px] py-[5px] px-2 bg-red-500 rounded-md"><Trash2 size={21} /></button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default DailySummaryModal;
