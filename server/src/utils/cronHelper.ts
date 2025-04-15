import { DateTime } from "luxon";

export const getCronString = (
  frequencyType: string,
  executionTime: string,
  weeklyDay?: string
): string => {
  const [hour, minute] = executionTime.split(":").map(Number);

  // המרה מ־Asia/Jerusalem ל־UTC
  const utcTime = DateTime.fromObject(
    { hour, minute },
    { zone: "Asia/Jerusalem" }
  ).toUTC();

  const utcHour = utcTime.hour;
  const utcMinute = utcTime.minute;

  if (frequencyType === "Every day") {
    return `${utcMinute} ${utcHour} * * *`;
  }

  if (frequencyType === "Every week" && weeklyDay) {
    const dayMap: Record<string, number> = {
      sunday: 0,
      monday: 1,
      tuesday: 2,
      wednesday: 3,
      thursday: 4,
      friday: 5,
      saturday: 6,
    };
    const day = dayMap[weeklyDay.toLowerCase()];
    return `${utcMinute} ${utcHour} * * ${day}`;
  }

  throw new Error("Invalid schedule parameters");
};
