import { Card, CardContent } from "@/components/ui/card";
import type { DashboardStatsData } from "@/components/hooks/useAdminDashboard";

type DashboardOverviewProps = {
  stats: DashboardStatsData;
  loading: boolean;
};

const overviewItems = [
  {
    title: "Pending Orders",
    description: "Orders waiting for confirmation",
    stat: "pendingOrders" as const,
    icon: "schedule",
    iconBg: "bg-[#FFF5DF]",
    iconColor: "text-[#A47720]",
  },
  {
    title: "Confirmed Orders",
    description: "Orders confirmed by your store",
    stat: "confirmedOrders" as const,
    icon: "check",
    iconBg: "bg-[#E7F5EB]",
    iconColor: "text-[#34764A]",
  },
];

function OverviewSkeleton() {
  return (
    <Card
      className="animate-pulse rounded-2xl border-[#E7E0EF] bg-white"
      role="status"
      aria-label="Loading order overview"
    >
      <CardContent className="p-6">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 shrink-0 rounded-2xl bg-[#EDE7F5]" />

          <div className="min-w-0 flex-1">
            <div className="h-4 w-28 rounded-md bg-[#EDE7F5]" />
            <div className="mt-3 h-8 w-20 rounded-md bg-[#E5D9F2]" />
            <div className="mt-2 h-3 w-40 max-w-full rounded-md bg-[#F0ECF5]" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function DashboardOverview({
  stats,
  loading,
}: DashboardOverviewProps) {
  return (
    <section className="mt-8">
      <div className="mb-5">
        <h2 className="text-xl font-bold text-[#292335]">
          Orders Overview
        </h2>
        <p className="mt-1 text-sm text-[#827A8D]">
          Track your order activity and store sales.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          <>
            <OverviewSkeleton />
            <OverviewSkeleton />
            <OverviewSkeleton />
          </>
        ) : (
          <>
            {overviewItems.map((item) => (
              <Card
                key={item.stat}
                className="rounded-2xl border-[#E7E0EF] bg-white"
              >
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div
                      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${item.iconBg} ${item.iconColor}`}
                    >
                      {item.icon === "schedule" ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="25"
                          height="25"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <circle cx="12" cy="12" r="9" />
                          <path d="M12 7v5l3 2" />
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="25"
                          height="25"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <circle cx="12" cy="12" r="9" />
                          <path d="m8 12 2.5 2.5L16 9" />
                        </svg>
                      )}
                    </div>

                    <div>
                      <p className="text-sm font-medium text-[#827A8D]">
                        {item.title}
                      </p>
                      <p className="mt-1 text-3xl font-extrabold text-[#292335]">
                        {stats[item.stat]}
                      </p>
                      <p className="mt-1 text-xs text-[#827A8D]">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            <Card className="rounded-2xl border-[#E7E0EF] bg-white">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#EEE8F7] text-[#65528A]">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="25"
                      height="25"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M12 2v20" />
                      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                    </svg>
                  </div>

                  <div className="min-w-0">
                    <p className="text-sm font-medium text-[#827A8D]">
                      Total Sales
                    </p>
                    <p className="mt-1 text-2xl font-extrabold text-[#292335]">
                      {new Intl.NumberFormat("en-PK", {
                        style: "currency",
                        currency: "PKR",
                        maximumFractionDigits: 0,
                      }).format(stats.totalSales)}
                    </p>
                    <p className="mt-1 text-xs text-[#827A8D]">
                      Total value of recorded orders
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </section>
  );
}