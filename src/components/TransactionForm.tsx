import { BanknoteArrowDown, BanknoteArrowUp, Plus, X } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

interface TransactionItem {
  category: string;
  amount: string | number;
  note: string;
}

interface TransactionFormProps {
  type: "income" | "expense" | "cost";
  data: TransactionItem[];
  onAdd: () => void;
  onRemove: (index: number) => void;
  onUpdate: (index: number, key: keyof TransactionItem, value: string) => void;
}

const TransactionFormItem = ({
  type,
  item,
  index,
  onUpdate,
}: {
  type: "income" | "expense" | "cost";
  item: TransactionItem;
  index: number;
  onUpdate: (index: number, key: keyof TransactionItem, value: string) => void;
}) => {
  const options = useMemo(() => {
    if (type === "income") return ["Grab", "Lineman", "Shopeefood", "Robinhood", "หน้าร้าน", "อื่นๆ"];
    if (type === "expense") return ["กุ้ง", "แซลมอน", "ผัก", "บรรจุภัณฑ์", "เครื่องปรุง", "เครื่องดื่ม", "เครื่องเคียง", "อื่นๆ"];
    if (type === "cost") return ["ส่วนของเจ้าของ"];
    return [];
  }, [type]);

  const handleChange = useCallback(
    (key: keyof TransactionItem, value: string) => {
      onUpdate(index, key, value);
    },
    [index, onUpdate]
  );

  const [localnumber, setLocalnumber] = useState(item.amount);
  const [localNote, setLocalNote] = useState(item.note);

  useEffect(() => {
    setLocalnumber(item.amount);
    setLocalNote(item.note);
  }, [item.amount, item.note]);

  return (
    <div className="mt-[1px] col-span-2 grid grid-cols-2 gap-2 items-center">
      <select
        value={item.category}
        onChange={(e) => handleChange("category", e.target.value)}
        className={`border border-gray-500 shadow-sm p-2 rounded-lg ${item.category === "" ? "text-gray-500" : "text-black"}`}
      >
        <option value="">-- เลือกหมวดหมู่ --</option>
        {options.map((cat) => (
          <option key={cat} value={cat} className="text-black">{cat}</option>
        ))}
      </select>

      <input
        type="number"
        placeholder="จำนวนเงิน"
        value={localnumber}
        onChange={e => setLocalnumber(e.target.value)}
        onBlur={() => handleChange("amount", Number(localnumber).toString())}
        className="border border-gray-500 shadow-sm p-2 rounded-lg"
      />

      <textarea
        placeholder="หมายเหตุ"
        value={localNote}
        onChange={e => setLocalNote(e.target.value)}
        onBlur={() => handleChange("note", localNote)}
        rows={2}
        className="col-span-2 border border-gray-500 shadow-sm p-2 rounded-lg overflow-auto mb-1.5"
      />
    </div>
  );
};

const TransactionForm = ({ type, data, onAdd, onRemove, onUpdate }: TransactionFormProps) => {
  const renderIcon = useMemo(() => type === "income"
    ? <BanknoteArrowUp className="mr-2 text-green-700" />
    : type === "expense"
      ? <BanknoteArrowDown className="mr-2 text-red-700" />
      : <>🏷️</>, [type]);

  const handleAdd = useCallback(() => onAdd(), [onAdd]);
  const handleRemove = useCallback(() => onRemove(data.length - 1), [onRemove, data.length]);

  return (
    <div className="col-span-3 grid grid-cols-2 gap-2 items-center mb-6">
      <div className={`w-full font-medium flex border shadow-sm p-2 rounded-lg ${type === "income" ? "border-green-300 bg-green-100 text-green-700" : type === "expense" ? "border-red-300 bg-red-100 text-red-700" : "border-blue-300 bg-blue-100 text-blue-700"}`}>
        {renderIcon} {type === "income" ? "รายรับ" : type === "expense" ? "รายจ่าย" : "ต้นทุน"}
      </div>

      <div className="flex space-x-2">
        <button onClick={handleAdd} className="text-white font-bold bg-green-400 shadow-md p-2 rounded-lg">
          <Plus />
        </button>
        {data.length > 1 && (
          <button type="button" onClick={handleRemove}
            className="text-white font-bold bg-red-400 shadow-md p-2 rounded-lg">
            <X />
          </button>
        )}
      </div>

      {data.map((item, index) => (
        <TransactionFormItem
          key={index}
          type={type}
          item={item}
          index={index}
          onUpdate={onUpdate}
        />
      ))}
    </div>
  );
};

export default TransactionForm;
