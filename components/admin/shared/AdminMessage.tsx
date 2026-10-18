type AdminMessageProps = {
  message: string;
  type?: "error" | "success" | "info";
};

const messageStyles = {
  error: "border-red-200 bg-red-50 text-red-700",
  success: "border-green-200 bg-green-50 text-green-800",
  info: "border-[#E7E0EF] bg-[#EEE8F7] text-[#65528A]",
};

export default function AdminMessage({
  message,
  type = "info",
}: AdminMessageProps) {
  if (!message) {
    return null;
  }

  return (
    <div
      role={type === "error" ? "alert" : "status"}
      className={`mt-6 break-words rounded-xl border p-4 text-sm ${messageStyles[type]}`}
    >
      {message}
    </div>
  );
}