// export const getISTDateTime = () => {
//   const formatter = new Intl.DateTimeFormat("en-US", {
//     timeZone: "Asia/Kolkata",
//     year: "numeric",
//     month: "2-digit",
//     day: "2-digit",
//     hour: "2-digit",
//     minute: "2-digit",
//     second: "2-digit",
//     hour12: false,
//   });

//   const parts = formatter.formatToParts(new Date());
//   const dateMap: { [key: string]: string } = {};

//   parts.forEach((part) => {
//     dateMap[part.type] = part.value;
//   });

//   return new Date(
//     `${dateMap.year}-${dateMap.month}-${dateMap.day}T${dateMap.hour}:${dateMap.minute}:${dateMap.second}`
//   );
// };

// export const isAfterCutoff = () => {
//   const ist = getISTDateTime();
//   return ist.getHours() >= 19; // 7 PM IST
// };

// export const getExpectedDeliveryDate = () => {
//   const ist = getISTDateTime();

//   const cutoff = 19;
//   const hour = ist.getHours();

//   const deliveryDate = new Date(ist);

//   if (hour >= cutoff) {
//     deliveryDate.setDate(deliveryDate.getDate() + 1);
//   }

//   return deliveryDate.toISOString().split("T")[0]; // YYYY-MM-DD
// };

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
};

// ✅ FIXED: Now checks both before 6 AM AND after 7 PM
export const isAfterCutoff = () => {
  const ist = getISTDateTime();
  const hour = ist.getHours();
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
