/**
 * จัดรูปแบบวันที่เป็นภาษาไทย
 * @param dateString วันที่ในรูปแบบ ISO string
 * @returns วันที่ในรูปแบบ "วันที่ DD เดือน YYYY"
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString)

  // ถ้าวันที่ไม่ถูกต้อง
  if (isNaN(date.getTime())) {
    return "ไม่ระบุวันที่"
  }

  const day = date.getDate()
  const month = getThaiMonth(date.getMonth())
  const year = date.getFullYear() + 543 // แปลงเป็น พ.ศ.

  return `วันที่ ${day} ${month} ${year}`
}

/**
 * แปลงเลขเดือนเป็นชื่อเดือนภาษาไทย
 */
function getThaiMonth(month: number): string {
  const thaiMonths = [
    "มกราคม",
    "กุมภาพันธ์",
    "มีนาคม",
    "เมษายน",
    "พฤษภาคม",
    "มิถุนายน",
    "กรกฎาคม",
    "สิงหาคม",
    "กันยายน",
    "ตุลาคม",
    "พฤศจิกายน",
    "ธันวาคม",
  ]
  return thaiMonths[month]
}

/**
 * คำนวณเวลาที่ผ่านไปจากวันที่ที่กำหนดจนถึงปัจจุบัน
 * @param dateString วันที่ในรูปแบบ ISO string
 * @returns ข้อความแสดงเวลาที่ผ่านไป เช่น "เมื่อ 2 วันที่แล้ว", "เมื่อ 3 ชั่วโมงที่แล้ว"
 */
export function timeAgo(dateString: string): string {
  const date = new Date(dateString)

  // ถ้าวันที่ไม่ถูกต้อง
  if (isNaN(date.getTime())) {
    return "ไม่ระบุเวลา"
  }

  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  // น้อยกว่า 1 นาที
  if (diffInSeconds < 60) {
    return "เมื่อไม่กี่วินาทีที่แล้ว"
  }

  // น้อยกว่า 1 ชั่วโมง
  const diffInMinutes = Math.floor(diffInSeconds / 60)
  if (diffInMinutes < 60) {
    return `เมื่อ ${diffInMinutes} นาทีที่แล้ว`
  }

  // น้อยกว่า 1 วัน
  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) {
    return `เมื่อ ${diffInHours} ชั่วโมงที่แล้ว`
  }

  // น้อยกว่า 30 วัน
  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays < 30) {
    return `เมื่อ ${diffInDays} วันที่แล้ว`
  }

  // น้อยกว่า 12 เดือน
  const diffInMonths = Math.floor(diffInDays / 30)
  if (diffInMonths < 12) {
    return `เมื่อ ${diffInMonths} เดือนที่แล้ว`
  }

  // มากกว่า 1 ปี
  const diffInYears = Math.floor(diffInMonths / 12)
  return `เมื่อ ${diffInYears} ปีที่แล้ว`
}
