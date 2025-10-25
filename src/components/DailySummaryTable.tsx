import { useCallback } from "react"
import { format } from "date-fns"
import { MonthYearPicker } from "./MonthYearPicker"

interface DailySummaryItem {
    date: string
    income: number
    expense: number
    cost: number
    net: number
    cashFlow: number
}

interface DailySummaryTableProps {
    dailySummaryArray: DailySummaryItem[]
    onClickRow: (date: string) => void
    isLoading?: boolean
    year: number
    month: number
    setYear: (year: number) => void
    setMonth: (month: number) => void
}

const DailySummaryTable = ({
    dailySummaryArray,
    onClickRow,
    isLoading,
    year,
    month,
    setYear,
    setMonth,
}: DailySummaryTableProps) => {
    const handleClick = useCallback(
        (date: string) => {
            onClickRow(date)
        },
        [onClickRow]
    )

    return (
        <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-700">📅 สรุปรายวัน</h2>
                <div>
                    <MonthYearPicker
                        selectedYear={year}
                        selectedMonth={month}
                        onChange={(y, m) => {
                            setYear(y)
                            setMonth(m)
                            console.log("Selected:", y, m + 1)
                        }}
                        disabled={isLoading}
                    />
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-indigo-100 text-gray-700">
                            <th className="p-2 border border-gray-600">วันที่</th>
                            <th className="p-2 border border-gray-600">ต้นทุน</th>
                            <th className="p-2 border border-gray-600">รายรับรวม</th>
                            <th className="p-2 border border-gray-600">รายจ่ายรวม</th>
                            <th className="p-2 border border-gray-600">กำไร/ขาดทุน</th>
                            <th className="p-2 border border-gray-600">กระแสเงินสด</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            <tr>
                                <td colSpan={6} className="p-4 text-center text-gray-500 border">
                                    <div className="flex items-center justify-center">
                                        <div className="py-2 px-3 bg-gray-100 rounded-md flex items-center space-x-2 shadow-md">
                                            <svg
                                                className="size-5 animate-spin text-gray-600"
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                            >
                                                <circle
                                                    className="opacity-25"
                                                    cx="12"
                                                    cy="12"
                                                    r="10"
                                                    stroke="currentColor"
                                                    strokeWidth="4"
                                                ></circle>
                                                <path
                                                    className="opacity-75"
                                                    fill="currentColor"
                                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                ></path>
                                            </svg>
                                            <span>กำลังโหลดข้อมูล...</span>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        ) : dailySummaryArray.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="p-3 text-center text-gray-500 border">
                                    ไม่มีข้อมูล
                                </td>
                            </tr>
                        ) : (
                            dailySummaryArray.map((d) => {
                                // ✅ แปลงวันที่เป็น dd/MM/yyyy
                                let formattedDate = d.date
                                try {
                                    formattedDate = format(new Date(d.date), "dd/MM/yyyy")
                                } catch (err) {
                                    console.warn("Invalid date:", d.date)
                                }

                                return (
                                    <tr
                                        key={d.date}
                                        className="hover:bg-gray-50 transition cursor-pointer"
                                        onClick={() => handleClick(d.date)}
                                    >
                                        <td className="p-2 border border-gray-600 font-[450]">{formattedDate}</td>
                                        <td className="p-2 border border-gray-600 text-blue-500 text-right">
                                            {d.cost.toLocaleString()}
                                        </td>
                                        <td className="p-2 border border-gray-600 text-green-600 text-right">
                                            {d.income.toLocaleString()}
                                        </td>
                                        <td className="p-2 border border-gray-600 text-red-600 text-right">
                                            {d.expense.toLocaleString()}
                                        </td>
                                        <td
                                            className={`p-2 border border-gray-600 text-right font-semibold ${d.net >= 0 ? "text-green-700" : "text-red-700"
                                                }`}
                                        >
                                            {d.net.toLocaleString()}
                                        </td>
                                        <td
                                            className={`p-2 border border-gray-600 text-right font-semibold ${d.cashFlow >= 0 ? "text-green-700" : "text-red-700"
                                                }`}
                                        >
                                            {d.cashFlow.toLocaleString()}
                                        </td>
                                    </tr>
                                )
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default DailySummaryTable
