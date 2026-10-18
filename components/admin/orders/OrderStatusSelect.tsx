
"use client";

const statuses = [
  "PENDING",
  "CONFIRMED",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
];

type Props = {
  orderId: number;
  status: string;
  updating: boolean;
  onChange: (status: string) => void;
};

export default function OrderStatusSelect({
  orderId,
  status,
  updating,
  onChange,
}: Props) {
  return (
    <div className="mt-6">
      <label
        htmlFor={`status-${orderId}`}
        className="mb-2 block text-sm font-bold"
      >
        Update Order Status
      </label>

      <select
        id={`status-${orderId}`}
        value={status}
        disabled={updating}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-xl border border-[#E7E0EF] bg-white px-4 py-3 text-sm outline-none focus:border-[#75619A] disabled:opacity-50"
      >
        {statuses.map((item) => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
      </select>

      {updating && (
        <p className="mt-2 text-xs text-[#75619A]">
          Updating status...
        </p>
      )}
    </div>
  );
}

