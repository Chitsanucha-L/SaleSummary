import { useState } from "react"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface DatePickerProps {
  date: string
  onChange: (d: string) => void
  disabled?: boolean // ✅ optional prop (ไม่ต้องใส่ทุกครั้งก็ได้)
}

export function DatePicker({ date, onChange, disabled = false }: DatePickerProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    date ? new Date(date) : undefined
  )
  const [open, setOpen] = useState(false)

  const handleSelect = (d: Date | undefined) => {
    setSelectedDate(d)
    if (d) {
      onChange(format(d, "dd/MM/yyyy"))
      setOpen(false)
    }
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          disabled={disabled} // ✅ ใช้ prop disabled ที่นี่
          onClick={() => !disabled && setOpen(!open)}
          className={`flex w-full text-left justify-between items-center mb-2 ${
            disabled ? "opacity-60 cursor-not-allowed" : ""
          }`}
        >
          <span className="text-[15px] font-medium mt-[2px]">
            {selectedDate ? format(selectedDate, "dd/MM/yyyy") : "เลือกวันที่"}
          </span>
          <CalendarIcon
            size={17}
            className="text-gray-600 shrink-0 transition-colors"
          />
        </Button>
      </PopoverTrigger>
      {!disabled && (
        <PopoverContent className="w-auto p-0">
          <Calendar
            className="p-2"
            mode="single"
            selected={selectedDate}
            onSelect={handleSelect}
          />
        </PopoverContent>
      )}
    </Popover>
  )
}
