import { BanknoteArrowDown, BanknoteArrowUp } from "lucide-react";
import { useEffect, useState } from "react";

interface Transaction {
    id: number;
    date: string;
    type: "income" | "expense";
    category: string;
    amount: number;
    note: string;
}

interface EditModalProps {
    open: boolean;
    onClose: () => void;
    transaction: Transaction | null;
    onSave: (updated: Transaction) => void;
}

const EditTransactionModal = ({ open, onClose, transaction, onSave }: EditModalProps) => {
    const [form, setForm] = useState(transaction);

    // อัปเดต form ถ้า transaction เปลี่ยน
    useEffect(() => {
        setForm(transaction);
    }, [transaction]);

    if (!open || !transaction) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold mb-4">แก้ไขรายการ</h2>
                    {transaction.type === "income" ? (
                        <div className="mb-4 text-green-700 font-semibold flex items-center">
                            <BanknoteArrowUp className="mr-2" /> รายรับ
                        </div>
                    ) : (
                        <div className="mb-4 text-red-700 font-semibold flex items-center">
                            <BanknoteArrowDown className="mr-2" /> รายจ่าย
                        </div>
                    )
                    }
                </div>

                <input
                    type="date"
                    value={form?.date || ""}
                    onChange={(e) => setForm({ ...form!, date: e.target.value })}
                    className="w-full mb-2 border p-2 rounded"
                />

                <select
                    value={form?.category || ""}
                    onChange={(e) => setForm({ ...form!, category: e.target.value })}
                    className="w-full mb-2 border p-2 rounded"
                >
                    <option value="">-- เลือกหมวดหมู่ --</option>
                    <option value="ต้นทุน">ต้นทุน</option>
                    <option value="ขายอาหาร">ขายอาหาร</option>
                    <option value="อื่นๆ">อื่นๆ</option>
                </select>

                <input
                    type="number"
                    placeholder="จำนวนเงิน"
                    value={form?.amount || 0}
                    onChange={(e) => setForm({ ...form!, amount: Number(e.target.value) })}
                    className="w-full mb-2 border p-2 rounded"
                />

                <input
                    type="text"
                    placeholder="หมายเหตุ"
                    value={form?.note || ""}
                    onChange={(e) => setForm({ ...form!, note: e.target.value })}
                    className="w-full mb-4 border p-2 rounded"
                />

                <div className="flex justify-end space-x-2">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
                    >
                        ยกเลิก
                    </button>
                    <button
                        onClick={() => {
                            if (form) onSave(form);
                            onClose();
                        }}
                        className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
                    >
                        บันทึก
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditTransactionModal;
