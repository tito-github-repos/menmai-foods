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

  // return new Date("2026-07-02T08:59:59");
};

// ✅ FIXED: Now checks both before 6 AM AND after 7 PM
export const isAfterCutoff = () => {
  const ist = getISTDateTime();
  const day = ist.getDay(); // 0 = Sunday, 6 = Saturday
  const hour = ist.getHours();
  if (day === 0) {
    return true; // Always cutoff on Sunday
  }
  return hour < 9 || hour >= 19; // Outside 9 AM - 7 PM window
};

export const getExpectedDeliveryDate = () => {
  const ist = getISTDateTime();
  const day = ist.getDay(); // 0 = Sunday
  const hour = ist.getHours();
  const deliveryDate = new Date(ist);

  // Sunday -> Monday
  if (day === 0) {
    deliveryDate.setDate(deliveryDate.getDate() + 1);
  }
  // Saturday after 7 PM -> Monday
  else if (day === 6 && hour >= 19) {
    deliveryDate.setDate(deliveryDate.getDate() + 2);
  }
  // Monday to Friday after 7 PM -> Next Day
  else if (hour >= 19) {
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
    return "Orders placed on Sunday will be delivered on Monday between 9:00 AM and 7:00 PM.";
  }

  // Saturday after 7 PM
  if (day === 6 && hour >= 19) {
    return "Orders placed after 7:00 PM on Saturday will be delivered on Monday between 9:00 AM and 7:00 PM.";
  }

  // Any other day after 7 PM
  if (hour >= 19) {
    return "Orders placed after 7:00 PM will be delivered next day between 9:00 AM and 7:00 PM.";
  }

  // Before 9 AM
  if (hour < 9) {
    return "Your order will be delivered today between 9:00 AM and 7:00 PM.";
  }

  return "";
};
