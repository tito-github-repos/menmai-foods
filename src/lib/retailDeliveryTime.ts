// src/lib/retailDeliveryTime.ts

export const getISTDateTime = () => {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });

  const parts = formatter.formatToParts(new Date());
  const dateMap: { [key: string]: string } = {};

  parts.forEach((part) => {
    dateMap[part.type] = part.value;
  });

  return new Date(
    `${dateMap.year}-${dateMap.month}-${dateMap.day}T${dateMap.hour}:${dateMap.minute}:${dateMap.second}`,
  );

  // return new Date("2026-06-20T23:59:59");
};

// ✅ FIXED: Now checks both before 6 AM AND after 7 PM
export const isAfterCutoff = () => {
  const ist = getISTDateTime();
  const day = ist.getDay(); // 0 = Sunday, 6 = Saturday
  const hour = ist.getHours();
  if (day === 0) {
    return true; // Always cutoff on Sunday
  }
  return hour < 6 || hour >= 19; // Outside 6 AM - 7 PM window
};

export const getExpectedDeliveryDate = () => {
  const ist = getISTDateTime();
  const hour = ist.getHours();
  const deliveryDate = new Date(ist);

  // If after 7 PM OR before 6 AM, deliver next day
  if (hour >= 19 || hour < 6) {
    deliveryDate.setDate(deliveryDate.getDate() + 1);
  }

  return deliveryDate.toISOString().split("T")[0];
};

export const getDeliveryMessage = () => {
  const ist = getISTDateTime();

  const day = ist.getDay(); // 0 = Sunday
  const hour = ist.getHours();

  // Sunday
  if (day === 0) {
    return "Orders placed on Sunday will be delivered on Monday.";
  }

  // Saturday after 7 PM
  if (day === 6 && hour >= 19) {
    return "Orders placed after 7:00 PM on Saturday will be delivered on Monday.";
  }

  // Any other day after 7 PM
  if (hour >= 19) {
    return "Orders placed after 7:00 PM will be delivered tomorrow.";
  }

  // Before 6 AM
  if (hour < 6) {
    return "Orders placed before 6:00 AM will be delivered today.";
  }

  return "";
};
