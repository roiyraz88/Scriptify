export const getCronString = (
  frequencyType: string,
  executionTime: string,
  weeklyDay?: string
): string => {
  const [hour, minute] = executionTime.split(":");

  if (frequencyType === "Every day") {
    return `${minute} ${hour} * * *`;
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
    return `${minute} ${hour} * * ${day}`;
  }

  throw new Error("Invalid schedule parameters");
};
