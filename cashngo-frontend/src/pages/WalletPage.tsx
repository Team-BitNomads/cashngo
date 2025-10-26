import React from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DollarSign, CheckCircle } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";

// Mock data for transactions
const mockTransactions = [
  {
    id: "txn_1",
    title: "Social Media Content Creation",
    company: "Innovate Inc.",
    date: "Oct 24, 2025",
    amount: 25.0,
    status: "Completed",
  },
  {
    id: "txn_2",
    title: "Transcribe Audio Interview",
    company: "Media Group",
    date: "Oct 22, 2025",
    amount: 15.0,
    status: "Completed",
  },
  {
    id: "txn_3",
    title: "User Testing for Mobile App",
    company: "Appify Ltd.",
    date: "Oct 21, 2025",
    amount: 30.0,
    status: "Completed",
  },
  {
    id: "txn_4",
    title: "Data Cleaning in Excel",
    company: "Data Solutions",
    date: "Oct 20, 2025",
    amount: 20.0,
    status: "Completed",
  },
  {
    id: "txn_5",
    title: "Write Blog Post Intro",
    company: "ContentPro",
    date: "Oct 19, 2025",
    amount: 10.0,
    status: "Completed",
  },
];

// Calculate total earnings from mock data
const totalEarnings = mockTransactions.reduce(
  (acc, txn) => acc + txn.amount,
  0
);

const WalletPage: React.FC = () => {
  return (
    <DashboardLayout title="My Wallet" searchTerm="" setSearchTerm={() => {}}>
      <div className="space-y-8 max-w-4xl mx-auto">
        {/* --- Total Earnings Card --- */}
        <AnimatedSection>
          <Card className="bg-slate-900/60 border border-green-500/30 backdrop-blur-sm shadow-lg shadow-green-500/10 overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <CardTitle className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400">
                Available Balance
              </CardTitle>
              <DollarSign className="h-6 w-6 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-5xl font-extrabold text-white">
                ${totalEarnings.toFixed(2)}
              </div>
              <p className="text-xs text-slate-400 mt-2">
                +15% from last month (mock data)
              </p>
            </CardContent>
            {/* Optional: Add a subtle glow effect */}
            <div className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] bg-gradient-to-r from-transparent via-green-500/10 to-transparent opacity-30 animate-spin-slow" />
          </Card>
        </AnimatedSection>

        {/* --- Transaction History --- */}
        <AnimatedSection delay="delay-100">
          <Card className="bg-slate-900/60 border border-slate-800 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-2xl font-semibold text-white">
                Transaction History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flow-root">
                <ul role="list" className="divide-y divide-slate-800">
                  {mockTransactions.map((txn) => (
                    <li
                      key={txn.id}
                      className="flex items-center justify-between gap-4 py-4"
                    >
                      {/* Left Side: Icon and Details */}
                      <div className="flex items-center gap-4">
                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center">
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        </div>
                        <div className="min-w-0 flex-auto">
                          <p className="text-sm font-semibold leading-6 text-white">
                            {txn.title}
                          </p>
                          <p className="mt-1 truncate text-xs leading-5 text-slate-400">
                            Paid by {txn.company} • {txn.date}
                          </p>
                        </div>
                      </div>

                      {/* Right Side: Amount and Status */}
                      <div className="text-right flex-shrink-0">
                        <p className="text-sm font-semibold leading-6 text-green-400">
                          +${txn.amount.toFixed(2)}
                        </p>
                        <Badge
                          variant="outline"
                          className="mt-1 border-green-500/50 bg-green-500/10 text-green-400 text-xs"
                        >
                          {txn.status}
                        </Badge>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        </AnimatedSection>
      </div>

      {/* Add supporting CSS for animations if not already global */}
      <style>{`
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
      `}</style>
    </DashboardLayout>
  );
};

export default WalletPage;
