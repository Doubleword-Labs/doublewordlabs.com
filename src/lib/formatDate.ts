import dayjs from "dayjs";

export function formatDate(date: Date) {
  return dayjs(date).format("D MMMM YYYY");
}
