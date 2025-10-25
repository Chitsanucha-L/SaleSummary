import { useState } from "react"
import { ChevronLeft, ChevronRight, CalendarIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover"

interface MonthYearPickerProps {
  selectedYear?: number
  selectedMonth?: number // 0 = January, 11 = December
  onChange: (year: number, month: number) => void
  disabled?: boolean
}

export function MonthYearPicker({
  selectedYear,
  selectedMonth,
  onChange,
  disabled = false,
}: MonthYearPickerProps) {
  const now = new Date()
  const [open, setOpen] = useState(false)

  // ใช้ props สำหรับ display ปุ่ม
  const displayYear = selectedYear || now.getFullYear()
  const displayMonth = selectedMonth ?? now.getMonth()

  // temporary state สำหรับ year ใน popover
  const [tempYear, setTempYear] = useState(displayYear)

  const months = [
    "January", "February", "March", "April",
    "May", "June", "July", "August",
    "September", "October", "November", "December",
  ]

  const handleMonthClick = (m: number) => {
    if (disabled) return
    onChange(tempYear, m)
    setOpen(false)
  }

  const handlePrevYear = () => {
    if (disabled) return
    setTempYear((y) => y - 1)
  }

  const handleNextYear = () => {
    if (disabled) return
    setTempYear((y) => y + 1)
  }

  return (
    <Popover open={open} onOpenChange={(o) => !disabled && setOpen(o)}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          disabled={disabled}
          className={`flex w-full justify-between items-center text-left ${
            disabled ? "opacity-60 cursor-not-allowed" : ""
          }`}
        >
          <span className="text-[15px] font-medium">
            {months[displayMonth]} {displayYear}
          </span>
          <CalendarIcon
            size={17}
            className={`text-gray-600 shrink-0 mt-[-2px] ml-4 ${
              disabled ? "opacity-50" : ""
            }`}
          />
        </Button>
      </PopoverTrigger>

      {!disabled && (
        <PopoverContent className="w-64 p-3">
          {/* Header - Year Navigation */}
          <div className="flex items-center justify-between mb-3">
            <Button size="icon" variant="ghost" onClick={handlePrevYear} className="h-7 w-7">
              <ChevronLeft size={18} />
            </Button>
            <span className="font-semibold">{tempYear}</span>
            <Button size="icon" variant="ghost" onClick={handleNextYear} className="h-7 w-7">
              <ChevronRight size={18} />
            </Button>
          </div>

          {/* Month Grid */}
          <div className="grid grid-cols-3 gap-2">
            {months.map((m, i) => (
              <Button
                key={m}
                variant={"outline"}
                disabled={disabled}
                className={`text-[13px] py-1 ${
                  i === displayMonth && tempYear === displayYear
                    ? "bg-black text-white hover:bg-black hover:text-white border-none"
                    : ""
                }`}
                onClick={() => handleMonthClick(i)}
              >
                {m.slice(0, 3)}
              </Button>
            ))}
          </div>
        </PopoverContent>
      )}
    </Popover>
  )
}
