/** OA 考勤打卡类型枚举（对应字典 oa_attendance_type：1 上班，2 下班） */
export const OA_ATTENDANCE_TYPE = {
  CLOCK_IN: 1, // 上班打卡
  CLOCK_OUT: 2 // 下班打卡
} as const

/** OA 考勤状态枚举（对应字典 oa_attendance_status：1 正常，2 迟到，3 早退） */
export const OA_ATTENDANCE_STATUS = {
  NORMAL: 1, // 正常
  LATE: 2, // 迟到
  EARLY: 3 // 早退
} as const

