import { FiFolder } from "react-icons/fi";

type Props = {
  total: number;
  main: number;
};

export default function CategoryStats({ total, main }: Props) {
  const stats = [
    { title: "Total Categories", value: total },
    { title: "Main Categories", value: main },
  ];

  return (
    <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
      {stats.map((stat) => (
        <div
          key={stat.title}
          className="rounded-2xl border border-purple-100 bg-white p-5"
        >
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-purple-100 p-3 text-purple-700">
              <FiFolder size={22} />
            </div>

            <div>
              <p className="text-sm text-gray-500">{stat.title}</p>
              <p className="text-2xl font-bold">{stat.value}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}