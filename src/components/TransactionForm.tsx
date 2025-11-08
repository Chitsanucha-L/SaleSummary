import { BanknoteArrowDown, BanknoteArrowUp, ChevronDown, Plus, X } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

interface TransactionItem {
  category: string;
  amount: string | number;
  note: string;
}

interface CategoryOption {
  name: string;
  logo?: string;
}

interface TransactionFormProps {
  type: "income" | "expense" | "cost";
  data: TransactionItem[];
  onAdd: () => void;
  onRemove: (index: number) => void;
  onUpdate: (index: number, key: keyof TransactionItem, value: string) => void;
  openDropdown: { type: string; index: number } | null;
  toggleDropdown: (type: string, index: number) => void;
}

const incomeOptions: CategoryOption[] = [
  { name: "Grab", logo: "/images/grab.png" },
  { name: "Lineman", logo: "/images/lineman.png" },
  { name: "Shopeefood", logo: "/images/shopeefood.png" },
  { name: "Robinhood", logo: "/images/robinhood.png" },
  { name: "หน้าร้าน", logo: "/images/store.png" },
  { name: "คนละครึ่ง", logo: "/images/halfhalf.png" },
  { name: "อื่นๆ", logo: "/images/others.png" },
];

const expenseOptions: CategoryOption[] = [
  { name: "กุ้ง" },
  { name: "แซลมอน" },
  { name: "ผัก" },
  { name: "บรรจุภัณฑ์" },
  { name: "เครื่องปรุง" },
  { name: "เครื่องดื่ม" },
  { name: "เครื่องเคียง" },
  { name: "อื่นๆ" }
];

const costOptions: CategoryOption[] = [
  { name: "ส่วนของเจ้าของ" }
];

const TransactionFormItem = ({
  type,
  item,
  index,
  onUpdate,
  dropdownOpen,
  onToggleDropdown,
}: {
  type: "income" | "expense" | "cost";
  item: TransactionItem;
  index: number;
  onUpdate: (index: number, key: keyof TransactionItem, value: string) => void;
  dropdownOpen: boolean;
  onToggleDropdown: () => void;
}) => {

  const options =
    type === "income"
      ? incomeOptions
      : type === "expense"
        ? expenseOptions
        : costOptions;

  const selected = options.find(o => o.name === item.category);

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

      {/* Dropdown */}
      <div className="relative">
        <button
          type="button"
          onClick={onToggleDropdown}
          className="flex items-center justify-between w-full border border-gray-500 p-2 rounded-lg shadow-sm"
        >
          <div className="flex items-center gap-2">
            {selected?.logo && (
              <img src={selected.logo} className="w-6 h-6 object-contain" />
            )}
            <span className={item.category ? "text-black" : "text-gray-500"}>
              {item.category || "-- เลือกหมวดหมู่ --"}
            </span>
          </div>
          <ChevronDown className="text-gray-600" size={18} strokeWidth={2.5} />
        </button>

        {dropdownOpen && (
          <ul className="absolute left-0 right-0 mt-1 bg-white border border-gray-400 rounded-lg shadow-lg z-50 max-h-72 overflow-y-auto">
            {options.map(opt => (
              <li
                key={opt.name}
                className="flex items-center gap-2 p-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => {
                  handleChange("category", opt.name);
                  onToggleDropdown(); // ปิด dropdown หลังเลือก
                }}
              >
                {opt.logo && (
                  <img src={opt.logo} className="w-6 h-6 object-contain" />
                )}
                <span className="text-black ml-1">{opt.name}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Input จำนวนเงิน */}
      <input
        type="number"
        placeholder="จำนวนเงิน"
        value={localnumber}
        onChange={e => setLocalnumber(e.target.value)}
        onBlur={() => handleChange("amount", Number(localnumber).toString())}
        className="border border-gray-500 shadow-sm p-2 rounded-lg"
      />

      {/* Textarea หมายเหตุ */}
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

const TransactionForm = ({ type, data, onAdd, onRemove, onUpdate, openDropdown, toggleDropdown }: TransactionFormProps) => {
  const renderIcon = useMemo(() => type === "income"
    ? <BanknoteArrowUp className="mr-2 text-green-700" />
    : type === "expense"
      ? <BanknoteArrowDown className="mr-2 text-red-700" />
      : <>🏷️</>, [type]);

  const handleAdd = useCallback(() => onAdd(), [onAdd]);
  const handleRemove = useCallback(() => onRemove(data.length - 1), [onRemove, data.length]);

  return (
    <div className="col-span-3 grid grid-cols-2 gap-2 items-center mb-6">
      <div className={`w-full font-medium flex border shadow-sm p-2 rounded-lg ${type === "income"
        ? "border-green-300 bg-green-100 text-green-700"
        : type === "expense"
          ? "border-red-300 bg-red-100 text-red-700"
          : "border-blue-300 bg-blue-100 text-blue-700"
        }`}>
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
          dropdownOpen={openDropdown?.type === type && openDropdown.index === index}
          onToggleDropdown={() => toggleDropdown(type, index)}
        />
      ))}
    </div>
  );
};

export default TransactionForm;
