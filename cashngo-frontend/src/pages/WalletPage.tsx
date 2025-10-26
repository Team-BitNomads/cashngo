/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import AnimatedSection from "@/components/AnimatedSection";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
// Removed Tabs imports
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Wallet,
  TrendingUp,
  ArrowUpRight,
  ArrowDownLeft,
  CheckCircle,
  Clock,
  AlertCircle,
  Shield,
  Building,
  Banknote,
  Eye,
  EyeOff,
} from "lucide-react";
import useLocalStorage  from "@/hooks/useLocalStorage";

// Transaction interface remains the same
interface Transaction {
  id: string;
  date: string;
  description: string;
  type: "credit" | "debit";
  status: "completed" | "pending" | "failed";
  amount: number;
}

// --- Start with empty transactions ---
const initialTransactions: Transaction[] = [];

// Nigerian Banks List including fintech banks
const nigerianBanks = [
  "Access Bank", "Citibank Nigeria", "Ecobank Nigeria", "Fidelity Bank", "First Bank of Nigeria",
  "First City Monument Bank (FCMB)", "Guaranty Trust Bank (GTBank)", "Heritage Bank", "Keystone Bank",
  "Kuda Bank", "Moniepoint", "Opay", "Palmpay", "Polaris Bank", "Providus Bank", 
  "Stanbic IBTC Bank", "Standard Chartered Bank", "Sterling Bank", "Union Bank of Nigeria", 
  "United Bank for Africa (UBA)", "Unity Bank", "Wema Bank", "Zenith Bank",
];

// Type for saved bank details remains the same
interface SavedBankDetails {
    bank: string;
    accountNumber: string;
    accountName: string;
}

export function WalletPage() {
  // Dummy search state for Layout
  const [searchTerm, setSearchTerm] = useState("");

  // Persistent states
  const [transactions, setTransactions] = useLocalStorage<Transaction[]>("cashngo_transactions", initialTransactions);
  const [isVerified, setIsVerified] = useLocalStorage<boolean>("cashngo_isVerified", false);
  const [bankAdded, setBankAdded] = useLocalStorage<boolean>("cashngo_bankAdded", false);
  const [savedBankDetails, setSavedBankDetails] = useLocalStorage<SavedBankDetails>("cashngo_savedBankDetails", {
    bank: "",
    accountNumber: "",
    accountName: "",
  });

  // Local component states
  const [showBalance, setShowBalance] = useState(true);
  const [nin, setNin] = useState("");
  const [bvn, setBvn] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [selectedBank, setSelectedBank] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [accountName, setAccountName] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Effect to reset form if bank details are removed
  useEffect(() => {
    if (!bankAdded) {
        setSelectedBank('');
        setAccountNumber('');
        setAccountName('');
    }
  }, [bankAdded]);


  // Balance calculations (will be 0 initially)
  const availableBalance = transactions
    .filter(t => t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0);

  const pendingBalance = transactions
    .filter(t => t.status === 'pending' && t.type === 'credit')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalEarnings = transactions
    .filter(t => t.type === 'credit' && t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0);

  // --- Handlers remain the same ---
  const handleVerification = () => {
    if (!nin || !bvn) { console.error("Please fill in all verification fields"); return; }
    setIsVerifying(true);
    console.log("Verifying NIN:", nin, "BVN:", bvn);
    setTimeout(() => { setIsVerified(true); setIsVerifying(false); console.log("Verification successful"); }, 2000);
  };

  const handleAccountNumberChange = (value: string) => {
    setAccountNumber(value);
    if (value.length === 10 && selectedBank) {
      console.log("Looking up account name for:", selectedBank, value);
      setTimeout(() => { const mockName = "Teslim Adetola Sadiq"; setAccountName(mockName); console.log("Account name found:", mockName); }, 500);
    } else { setAccountName(""); }
  };

  const handleSavePayoutMethod = () => {
    if (!selectedBank || !accountNumber || !accountName) { console.error("Please fill in all bank details"); return; }
    setIsSaving(true);
    console.log("Saving payout method:", selectedBank, accountNumber, accountName);
    setTimeout(() => {
      const details = { bank: selectedBank, accountNumber: accountNumber, accountName: accountName };
      setSavedBankDetails(details);
      setBankAdded(true);
      setIsSaving(false);
      console.log("Payout method saved:", details);
    }, 1500);
  };

  const handleRemoveAccount = () => {
    setSavedBankDetails({ bank: "", accountNumber: "", accountName: "" });
    setBankAdded(false);
    setSelectedBank(''); setAccountNumber(''); setAccountName('');
    console.log("Payout method removed");
  }

  // --- Render Logic ---
  const renderVerificationSection = () => (
    <Card className="bg-slate-900/60 border-slate-800 backdrop-blur-sm">
      <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl text-white">
              <Shield className="h-6 w-6 text-emerald-400" />
              Step 1: Identity Verification
          </CardTitle>
          <CardDescription className="text-slate-400">
              Verify your identity to secure your account and enable payouts. This is required by regulations.
          </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
          <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-4">
              <div className="flex gap-3">
                  <Shield className="h-5 w-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <div>
                      <p className="text-sm font-medium text-emerald-300 mb-1">
                          Identity Verification Required
                      </p>
                      <p className="text-xs text-slate-400">
                          To comply with financial regulations and ensure secure transactions,
                          please verify your identity using your NIN and BVN.
                      </p>
                  </div>
              </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                  <Label htmlFor="nin" className="text-sm font-semibold text-slate-300">
                      National Identification Number (NIN)
                      <span className="text-red-400 ml-1">*</span>
                  </Label>
                  <Input
                      id="nin" type="text" placeholder="Enter your 11-digit NIN" value={nin}
                      onChange={(e) => setNin(e.target.value)} maxLength={11}
                      className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500"
                  />
                  <p className="text-xs text-slate-500">
                      Your NIN is used to verify your identity
                  </p>
              </div>

              <div className="space-y-2">
                  <Label htmlFor="bvn" className="text-sm font-semibold text-slate-300">
                      Bank Verification Number (BVN)
                      <span className="text-red-400 ml-1">*</span>
                  </Label>
                  <Input
                      id="bvn" type="text" placeholder="Enter your 11-digit BVN" value={bvn}
                      onChange={(e) => setBvn(e.target.value)} maxLength={11}
                      className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500"
                  />
                  <p className="text-xs text-slate-500">
                      Dial *565*0# from your registered phone to get your BVN
                  </p>
              </div>
          </div>

          <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-4">
              <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                  <Shield className="h-4 w-4 text-emerald-400" /> Why we need this information
              </h4>
              <ul className="space-y-2 text-sm text-slate-400">
                  <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-emerald-400 flex-shrink-0 mt-0.5" /><span>Verify identity & prevent fraud</span></li>
                  <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-emerald-400 flex-shrink-0 mt-0.5" /><span>Comply with CBN regulations</span></li>
                  <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-emerald-400 flex-shrink-0 mt-0.5" /><span>Enable secure withdrawals</span></li>
                  <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-emerald-400 flex-shrink-0 mt-0.5" /><span>Protect your account</span></li>
              </ul>
          </div>
      </CardContent>
      <CardFooter>
          <Button
              onClick={handleVerification} disabled={isVerifying || !nin || !bvn}
              className="w-full md:w-auto bg-emerald-600 hover:bg-emerald-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
              {isVerifying ? ( <><div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" /> Verifying... </> )
                           : ( <><Shield className="h-4 w-4 mr-2" /> Verify Identity</> )}
          </Button>
      </CardFooter>
    </Card>
  );

  const renderPayoutSetupSection = () => (
     <Card className="bg-slate-900/60 border-slate-800 backdrop-blur-sm">
        <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl text-white">
                <Building className="h-6 w-6 text-cyan-400" />
                Step 2: Add Payout Method
            </CardTitle>
            <CardDescription className="text-slate-400">
                Identity verified! Now add your bank account to receive payments instantly.
            </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                <div className="flex gap-3">
                    <Building className="h-5 w-5 text-blue-400 flex-shrink-0 mt-0.5" />
                    <div>
                        <p className="text-sm font-medium text-blue-300 mb-1">
                            Add Your Bank Account
                        </p>
                        <p className="text-xs text-slate-400">
                            Your payout details are encrypted and secure. We'll use this account
                            to send your earnings.
                        </p>
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                 <div className="space-y-2">
                    <Label htmlFor="bank" className="text-sm font-semibold text-slate-300">
                        Select Bank <span className="text-red-400 ml-1">*</span>
                    </Label>
                    <Select value={selectedBank} onValueChange={setSelectedBank}>
                        <SelectTrigger id="bank" className="bg-slate-800/50 border-slate-700 text-white focus:ring-2 focus:ring-emerald-500/50">
                            <SelectValue placeholder="Choose your bank" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-900 border-slate-800 text-white max-h-60">
                            {nigerianBanks.map((bank) => ( <SelectItem key={bank} value={bank} className="focus:bg-slate-800 focus:text-white"> {bank} </SelectItem> ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="accountNumber" className="text-sm font-semibold text-slate-300">
                        Account Number <span className="text-red-400 ml-1">*</span>
                    </Label>
                    <Input
                        id="accountNumber" type="text" placeholder="Enter 10-digit account number" value={accountNumber}
                        onChange={(e) => handleAccountNumberChange(e.target.value)} maxLength={10}
                        className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="accountName" className="text-sm font-semibold text-slate-300"> Account Name </Label>
                    <Input
                        id="accountName" type="text" placeholder="Account name will appear here" value={accountName} disabled
                        className="bg-slate-800/30 border-slate-700 text-slate-400 cursor-not-allowed"
                    />
                    {accountName && ( <p className="text-xs text-emerald-400 flex items-center gap-1"> <CheckCircle className="h-3 w-3" /> Account verified </p> )}
                </div>
            </div>

            <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                    <Banknote className="h-4 w-4 text-emerald-400" /> Withdrawal Information
                </h4>
                <ul className="space-y-2 text-sm text-slate-400">
                    <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-emerald-400 flex-shrink-0 mt-0.5" /><span>Minimum withdrawal: ₦1,000</span></li>
                    <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-emerald-400 flex-shrink-0 mt-0.5" /><span>Processing time: Instant (within 5 minutes)</span></li>
                    <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-emerald-400 flex-shrink-0 mt-0.5" /><span>Withdrawal fee: ₦50 per transaction</span></li>
                    <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-emerald-400 flex-shrink-0 mt-0.5" /><span>You can update your bank details anytime</span></li>
                </ul>
            </div>
        </CardContent>
        <CardFooter>
            <Button
                onClick={handleSavePayoutMethod} disabled={isSaving || !selectedBank || !accountNumber || !accountName}
                className="w-full md:w-auto bg-emerald-600 hover:bg-emerald-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isSaving ? ( <><div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" /> Saving... </> )
                           : ( <><Building className="h-4 w-4 mr-2" /> Save Payout Method</> )}
            </Button>
        </CardFooter>
     </Card>
  );

  const renderOverviewSection = () => (
    <div className="space-y-6">
        {/* Balance Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-gradient-to-br from-emerald-900/20 to-emerald-800/10 border-emerald-500/30 backdrop-blur-sm">
                <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-emerald-300 flex items-center justify-between"> Available Balance
                        <Button variant="ghost" size="icon" className="h-6 w-6 text-emerald-400 hover:text-emerald-300" onClick={() => setShowBalance(!showBalance)}>
                            {showBalance ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                        </Button>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        <div>
                            <p className="text-3xl font-bold text-white"> {showBalance ? `₦${availableBalance.toLocaleString()}.00` : "₦••••••"} </p>
                            <p className="text-xs text-emerald-400/70 mt-1">Ready to withdraw</p>
                        </div>
                        <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"> <ArrowUpRight className="h-4 w-4 mr-2" /> Withdraw Funds </Button>
                    </div>
                </CardContent>
            </Card>
            <Card className="bg-slate-900/50 border-slate-800/50 backdrop-blur-sm">
                <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-slate-400 flex items-center gap-2"> <Clock className="h-4 w-4 text-amber-400" /> Pending Balance </CardTitle>
                </CardHeader>
                <CardContent>
                    <div>
                        <p className="text-3xl font-bold text-white"> {showBalance ? `₦${pendingBalance.toLocaleString()}.00` : "₦••••••"} </p>
                        <p className="text-xs text-slate-500 mt-1">Awaiting approval</p>
                    </div>
                </CardContent>
            </Card>
            <Card className="bg-slate-900/50 border-slate-800/50 backdrop-blur-sm">
                <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-slate-400 flex items-center gap-2"> <TrendingUp className="h-4 w-4 text-cyan-400" /> Total Earnings </CardTitle>
                </CardHeader>
                <CardContent>
                    <div>
                        <p className="text-3xl font-bold text-white"> {showBalance ? `₦${totalEarnings.toLocaleString()}.00` : "₦••••••"} </p>
                        <p className="text-xs text-slate-500 mt-1">Lifetime</p>
                    </div>
                </CardContent>
            </Card>
        </div>

        {/* Saved Bank Account Card */}
        <Card className="bg-slate-800/50 border-slate-700/50">
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-base font-semibold text-white">Saved Payout Method</CardTitle>
                 <Button variant="ghost" size="sm" className="text-slate-400 hover:text-red-400" onClick={handleRemoveAccount}>
                    Remove
                 </Button>
            </CardHeader>
            <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                    <span className="text-slate-400">Bank Name</span>
                    <span className="text-white font-semibold">{savedBankDetails.bank}</span>
                </div>
                <div className="flex items-center justify-between">
                    <span className="text-slate-400">Account Number</span>
                    <span className="text-white font-semibold">**** **** {savedBankDetails.accountNumber.slice(-4)}</span>
                </div>
                <div className="flex items-center justify-between">
                    <span className="text-slate-400">Account Name</span>
                    <span className="text-white font-semibold">{savedBankDetails.accountName}</span>
                </div>
            </CardContent>
        </Card>

        {/* Transaction History */}
        <Card className="bg-slate-900/50 border-slate-800/50 backdrop-blur-sm">
            <CardHeader>
                <CardTitle className="text-xl text-white">Transaction History</CardTitle>
            </CardHeader>
            <CardContent>
                 <div className="rounded-lg border border-slate-800 overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-slate-800/50 hover:bg-slate-800/50">
                          <TableHead className="text-slate-300">Date</TableHead>
                          <TableHead className="text-slate-300">Description</TableHead>
                          <TableHead className="text-slate-300">Status</TableHead>
                          <TableHead className="text-slate-300 text-right">Amount</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {transactions.length === 0 ? (
                            <TableRow><TableCell colSpan={4} className="text-center text-slate-500 py-10">No transactions yet.</TableCell></TableRow>
                        ) : (
                            transactions.map((txn) => (
                              <TableRow key={txn.id} className="border-slate-800">
                                <TableCell className="text-slate-400"> {new Date(txn.date).toLocaleDateString("en-NG", { day: "2-digit", month: "short", year: "numeric" })} </TableCell>
                                <TableCell>
                                  <div className="flex items-center gap-3">
                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${txn.type === "credit" ? "bg-emerald-500/20" : "bg-red-500/20"}`}>
                                      {txn.type === "credit" ? <ArrowDownLeft className="h-4 w-4 text-emerald-400" /> : <ArrowUpRight className="h-4 w-4 text-red-400" />}
                                    </div>
                                    <span className="text-white font-medium">{txn.description}</span>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <Badge className={txn.status === "completed" ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30" : txn.status === "pending" ? "bg-amber-500/20 text-amber-300 border-amber-500/30" : "bg-red-500/20 text-red-300 border-red-500/30"}>
                                    {txn.status === "completed" && <CheckCircle className="h-3 w-3 mr-1" />}
                                    {txn.status === "pending" && <Clock className="h-3 w-3 mr-1" />}
                                    {txn.status === "failed" && <AlertCircle className="h-3 w-3 mr-1" />}
                                    {txn.status.charAt(0).toUpperCase() + txn.status.slice(1)}
                                  </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                  <span className={`font-semibold ${ txn.type === "credit" ? "text-emerald-400" : "text-red-400"}`}>
                                    {txn.type === "credit" ? "+" : ""}₦{Math.abs(txn.amount).toLocaleString()}.00
                                  </span>
                                </TableCell>
                              </TableRow>
                            ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
            </CardContent>
        </Card>

    </div>
  );

  return (
    <DashboardLayout
      title="Wallet"
      searchTerm={searchTerm}
      setSearchTerm={setSearchTerm}
    >
      <AnimatedSection>
        {!isVerified
          ? renderVerificationSection()
          : !bankAdded
          ? renderPayoutSetupSection()
          : renderOverviewSection()}
      </AnimatedSection>
    </DashboardLayout>
  );
}

