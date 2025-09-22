import { BanknoteArrowDown, BanknoteArrowUp } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

interface Transaction {
    _id: string;
    date: string;
    type: "income" | "expense" | "cost";
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
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        setForm(transaction);
    }, [transaction]);

    const categoryOptions = useMemo(() => {
        if (!form) return [];
        switch (form.type) {
            case "income":
                return ["ต้นทุน", "ขายอาหาร", "อื่นๆ"];
            case "expense":
                return ["กุ้ง", "แซลมอน", "ผัก", "บรรจุภัณฑ์", "เครื่องปรุง", "เครื่องดื่ม", "เครื่องเคียง", "อื่นๆ"];
            case "cost":
                return ["ส่วนของเจ้าของ"];
            default:
                return [];
        }
    }, [form]);

    if (!open || !transaction) return null;

    const handleSave = async () => {
        if (!form) return;
        setIsSaving(true); // เริ่มสถานะกำลังบันทึก
        try {
            await onSave(form); // สมมติ onSave เป็น async function
            onClose();
        } catch (err) {
            console.error(err);
        } finally {
            setIsSaving(false);
        }
    };

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
                    )}
                </div>

                <input
                    type="date"
                    value={form?.date || ""}
                    onChange={(e) => setForm({ ...form!, date: e.target.value })}
                    className="w-full mb-2 border p-2 rounded"
                    disabled={isSaving}
                />

                <select
                    value={form?.category || ""}
                    onChange={(e) => setForm({ ...form!, category: e.target.value })}
                    className="w-full mb-2 border p-2 rounded"
                    disabled={isSaving}
                >
                    <option value="">-- เลือกหมวดหมู่ --</option>
                    {categoryOptions.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                    ))}
                </select>

                <input
                    type="number"
                    placeholder="จำนวนเงิน"
                    value={form?.amount || ""}
                    onChange={(e) => setForm({ ...form!, amount: Number(e.target.value) })}
                    className="w-full mb-2 border p-2 rounded"
                    disabled={isSaving}
                />

                <input
                    type="text"
                    placeholder="หมายเหตุ"
                    value={form?.note || ""}
                    onChange={(e) => setForm({ ...form!, note: e.target.value })}
                    className="w-full mb-4 border p-2 rounded"
                    disabled={isSaving}
                />

                <div className="flex justify-end space-x-2">
                    <button
                        onClick={onClose}
                        className={`px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 ${isSaving ? "opacity-50 cursor-not-allowed" : ""}`}
                        disabled={isSaving}
                    >
                        ยกเลิก
                    </button>
                    <button
                        onClick={handleSave}
                        className={`px-4 py-2 rounded bg-blue-600 text-white ${isSaving ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"}`}
                        disabled={isSaving}
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
                            "บันทึก"
                        }
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditTransactionModal;