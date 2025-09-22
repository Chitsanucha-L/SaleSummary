import { useCallback, useMemo } from "react";

interface CategorySelectProps {
  type: "income" | "expense" | "cost";
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export default function CategorySelect({ type, value, onChange, disabled }: CategorySelectProps) {
  // จำ options ตามประเภท
  const options = useMemo(() => {
    switch (type) {
      case "income":
        return ["ต้นทุน", "ขายอาหาร", "อื่นๆ"];
      case "expense":
        return ["กุ้ง","แซลมอน","ผัก","บรรจุภัณฑ์","เครื่องปรุง","เครื่องดื่ม","เครื่องเคียง","อื่นๆ"];
      case "cost":
        return ["ส่วนของเจ้าของ"];
      default:
        return [];
    }
  }, [type]);

  // handler จำ
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      onChange(e.target.value);
    },
    [onChange]
  );

  return (
    <select
      value={value}
      onChange={handleChange}
      className={`border border-gray-500 shadow-sm p-2 rounded-lg focus:ring-2 focus:ring-blue-400 ${value === "" ? "text-gray-500" : "text-black"}`}
      disabled={disabled}
    >
      <option value="">-- เลือกหมวดหมู่ --</option>
      {options.map((cat) => (
        <option key={cat} value={cat}>{cat}</option>
      ))}
    </select>
  );
}
